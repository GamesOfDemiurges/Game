var repaint = false,
	debugPanel,
	canvas,
	ctx,
	scale;

var paths = {},
	graph = {};

var debugTraect = function debugTraect() {

	var _this = this;

	// Извлечение сохраненных путей из файла
	var readTraectFromFile = function readTraectFromFile () {
		var readTraect = new XMLHttpRequest;
		readTraect.open("GET", '/tools/traect.json?' + new Date().getTime());
		readTraect.onreadystatechange = function() {

			if (readTraect.readyState==4) {
				var newItem,
					tempPoint,
					pathList = document.querySelector('.debug__control-traects select');

				paths = JSON.parse(readTraect.responseText);

				for (var path in paths) {
					newItem = document.createElement('option');

					newItem.textContent = paths[path].name;
					newItem.setAttribute('value', paths[path].name);
					newItem.selected = true;

					pathList.appendChild(newItem);

					for (var dot = 0; dot < paths[path].dots.length; dot++) {

						// создаем DOM-представление для новой точки

						if (paths[path].dots[dot].prevHandle !== null) {

							tempPoint = document.createElement('div');
							tempPoint.className = 'debug__point-handle';
							tempPoint.style.top = paths[path].dots[dot].prevHandle.y / scale + 'px';
							tempPoint.style.left = paths[path].dots[dot].prevHandle.x / scale + 'px';
							paths[path].dots[dot].prevHandle.dom = tempPoint;

							debugPanel.appendChild(tempPoint);
						}

						tempPoint = document.createElement('div');
						tempPoint.className = 'debug__point';
						tempPoint.style.top = paths[path].dots[dot].mainHandle.y / scale+ 'px';
						tempPoint.style.left = paths[path].dots[dot].mainHandle.x / scale + 'px';
						paths[path].dots[dot].mainHandle.dom = tempPoint;

						debugPanel.appendChild(tempPoint);

						if (paths[path].dots[dot].nextHandle !== null) {
							tempPoint = document.createElement('div');
							tempPoint.className = 'debug__point-handle';
							tempPoint.style.top = paths[path].dots[dot].nextHandle.y / scale + 'px';
							tempPoint.style.left = paths[path].dots[dot].nextHandle.x / scale + 'px';
							paths[path].dots[dot].nextHandle.dom = tempPoint;

							debugPanel.appendChild(tempPoint);
						}
					}
					paths[path].dots[0].mainHandle.dom.classList.add('debug__point_first');
				}

				repaint = true;

				setTimeout(function() {
					buildGraph();
				}, 1000)

			}
		};
		readTraect.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		readTraect.send(null);
	}

	// Перерисовка служебного холста
	var render = function render() {
		if (repaint) {
			paint();
			repaint = false;
		}

		requestAnimFrame(render);
	}

	// Возвращает Эвклидово расстояния
	//p.x1
	//p.y1
	//p.x2
	//p.y2
	var getDistance = function getDistance( p ) {
		var xDistance = p.x2 - p.x1,
			yDistance = p.y2 - p.y1;

		return Math.sqrt( xDistance*xDistance + yDistance*yDistance );
	}

	// Возвращает координаты точку на отрезке
	//p.x1
	//p.y1
	//p.x2
	//p.y2
	//p.t
	var getLinePointCoords = function getLinePointCoords( p ) {
		return {
			x: (p.x2 - p.x1) * p.t + p.x1,
			y: (p.y2 - p.y1) *  p.t + p.y1,
		}
	}

	// Возвращает координаты точки в кривой Безье
	//p.x1
	//p.y1
	//p.ax1
	//p.ay1
	//p.ax2
	//p.ay2
	//p.x2
	//p.y2
	//p.t
	var getBezierPointCoords = function getBezierPointCoords( p ) {

		function polynom(z) {
			var at = (1 - p.t);

			return (at * at * at * z.p0) + (3 * p.t * at * at * z.p1) + (3 * p.t * p.t * at * z.p2) + (p.t * p.t * p.t * z.p3);
		}

		return {
			x: polynom( { p0: p.x1, p1: p.ax1, p2: p.ax2, p3: p.x2 } ),
			y: polynom( { p0: p.y1, p1: p.ay1, p2: p.ay2, p3: p.y2 } )
		}
	}

	// Возвращает позицию управляющих точек на кривой Безье
	//p.x1
	//p.y1
	//p.x2
	//p.y2
	var getAdditionalBezierPointsCoords = function getAdditionalBezierPointsCoords( p ) {

		var a1 = getLinePointCoords({
			x1: p.x1,
			y1: p.y1,
			x2: p.x2,
			y2: p.y2,
			t: 0.3
		})

		var a2 = getLinePointCoords({
			x1: p.x1,
			y1: p.y1,
			x2: p.x2,
			y2: p.y2,
			t: 0.7
		})

		return {
			ax1: a1.x,
			ay1: a1.y,
			ax2: a2.x,
			ay2: a2.y
		}
	}

	// Строит рекурсивно атомарные шаги по заданной кривой Безье длиной не более допустимого расстояния
	//p.x1
	//p.y1
	//p.ax1
	//p.ay1
	//p.ax2
	//p.ay2
	//p.x2
	//p.y2
	//p.t1,
	//p.t2
	var buildCurveSteps = function buildCurveSteps( p ) {

		// максимально допустимое расстояние в пикселах
		var maxDistance = 1.4

		var path = {};

		// считаем среднюю точку в заданном интервале [t1, t2]
		var middleT = p.t1 + (p.t2 - p.t1)/2;

		// получаем координаты точек при t = t1, middleT, t2
		var pointInT = getBezierPointCoords({
			x1: p.x1,
			y1: p.y1,
			ax1: p.ax1,
			ay1: p.ay1,
			ax2: p.ax2,
			ay2: p.ay2,
			x2: p.x2,
			y2: p.y2,
			t: middleT
		});

		var pointInT1 = getBezierPointCoords({
			x1: p.x1,
			y1: p.y1,
			ax1: p.ax1,
			ay1: p.ay1,
			ax2: p.ax2,
			ay2: p.ay2,
			x2: p.x2,
			y2: p.y2,
			t: p.t1
		});

		var pointInT2 = getBezierPointCoords({
			x1: p.x1,
			y1: p.y1,
			ax1: p.ax1,
			ay1: p.ay1,
			ax2: p.ax2,
			ay2: p.ay2,
			x2: p.x2,
			y2: p.y2,
			t: p.t2
		});

		// обход дерева слева
		var leftDistance = getDistance({
			x1: pointInT1.x,
			y1: pointInT1.y,
			x2: pointInT.x,
			y2: pointInT.y
		})

		if ( leftDistance > maxDistance ) {

			// Если можно разбить ветвь дальше, рекурсивно разбиваем
			var innerLeftSteps = buildCurveSteps({
				x1: p.x1,
				y1: p.y1,
				ax1: p.ax1,
				ay1: p.ay1,
				ax2: p.ax2,
				ay2: p.ay2,
				x2: p.x2,
				y2: p.y2,
				t1: p.t1,
				t2: middleT
			});

			// добавляем полученные точки в текущий путь
			for (var i in innerLeftSteps) {
				path[i] = innerLeftSteps[i];
			}

		} else {

			// Ветвь нельзя разбить дальше
			// Добавляем полученную точку к пути и возвращаемся обратно по стеку
			path[middleT] = pointInT;
			return path;
		}

		// обход дерева справа
		var rightDistance = getDistance({
			x1: pointInT.x,
			y1: pointInT.y,
			x2: pointInT2.x,
			y2: pointInT2.y
		})

		if ( rightDistance >= maxDistance ) {

			// Рекурсивно строим ветку (фактически работает только левый обход)
			var innerRightSteps = buildCurveSteps({
				x1: p.x1,
				y1: p.y1,
				ax1: p.ax1,
				ay1: p.ay1,
				ax2: p.ax2,
				ay2: p.ay2,
				x2: p.x2,
				y2: p.y2,
				t1: middleT,
				t2: p.t2
			});

			// Если ветвь можно разбить, добавляем полученные точки к текущему пути
			for (var i in innerRightSteps) {
				path[i] = innerRightSteps[i];
			}
		}

		// Добавим текущую среднюю точку в путь, если её еще там нет
		path[middleT] = {
			x: pointInT.x,
			y: pointInT.y
		}

		// Случай, когда весь путь уже построен
		if ((p.t1 == 0) && (p.t2 == 1)) {

			// Добавляем граничные точки
			path[0] = {
				x: p.x1,
				y: p.y1
			}

			path[1] = {
				x: p.x2,
				y: p.y2
			}

			// Разворачиваем объект в сортированный массив
			var keyArr = [],
				result = [];

			for (var i in path) {
				keyArr.push(i);
			}

			keyArr = keyArr.sort();

			for (var i = 0; i < keyArr.length; i++) {
				result.push(path[keyArr[i]]);
			}

			// Финальный возврат пути в виде массива
			return result;
		}

		// Рекурсивный возврат пути
		return path;
	}

	// Генерирует управляющий контур для траектории
	// p.pathId
	var buildControlPoligon = function buildControlPoligon( p ) {

		var touchRadiusDistance = 100;
		var currentPath = paths[p.pathId];

		var controlPath = [];

		/*var touchPointCount = Math.round( currentPath.steps.length / touchRadiusDistance );

		for (var touchPoint = 0; touchPoint < touchPointCount; touchPoint++) {
			var startTouchPoint = {
				x: currentPath.steps[touchPoint*touchRadiusDistance].x - (touchRadiusDistance/2),
				y: currentPath.steps[touchPoint*touchRadiusDistance].y - (touchRadiusDistance/2)
			}
			console.log(touchPoint*touchRadiusDistance);
			ctx.rect( startTouchPoint.x, startTouchPoint.y, touchRadiusDistance, touchRadiusDistance );

		}*/

		var lastPoint = 0;

		for (var i = 0; i < currentPath.steps.length; i++) {

			var distance = getDistance({
				x1: currentPath.steps[lastPoint].x,
				y1: currentPath.steps[lastPoint].y,
				x2: currentPath.steps[i].x,
				y2: currentPath.steps[i].y,
			})

			if (distance > touchRadiusDistance) {

				// создание
				var startTouchPoint = {
					x: currentPath.steps[lastPoint].x - (touchRadiusDistance/2),
					y: currentPath.steps[lastPoint].y - (touchRadiusDistance/2)
				}

				controlPath.push({
					rect: new PIXI.Rectangle(startTouchPoint.x, startTouchPoint.y, touchRadiusDistance, touchRadiusDistance),
					step: lastPoint
				})

				// Визуализация
				ctx.rect( controlPath[ controlPath.length-1 ].rect.x, controlPath[ controlPath.length-1 ].rect.y, controlPath[ controlPath.length-1 ].rect.width, controlPath[ controlPath.length-1 ].rect.height );
				ctx.rect( currentPath.steps[ controlPath[ controlPath.length-1 ].step ].x, currentPath.steps[ controlPath[ controlPath.length-1 ].step ].y,  6, 6 );

				lastPoint = i;
			}
		}

		var startTouchPoint = {
			x: currentPath.steps[lastPoint].x - (touchRadiusDistance/2),
			y: currentPath.steps[lastPoint].y - (touchRadiusDistance/2)
		}

		// создание
		controlPath.push({
			rect: new PIXI.Rectangle(startTouchPoint.x, startTouchPoint.y, currentPath.steps[currentPath.steps.length-1].x - startTouchPoint.x+ (touchRadiusDistance/2), currentPath.steps[currentPath.steps.length-1].y - startTouchPoint.y + (touchRadiusDistance/2)),
			step: (currentPath.steps.length-1)
		})

		currentPath.controlPath = controlPath;

		// Визуализация
		ctx.rect( controlPath[ controlPath.length-1 ].rect.x, controlPath[ controlPath.length-1 ].rect.y, controlPath[ controlPath.length-1 ].rect.width, controlPath[ controlPath.length-1 ].rect.height );
		ctx.rect( currentPath.steps[ controlPath[ controlPath.length-1 ].step ].x, currentPath.steps[ controlPath[ controlPath.length-1 ].step ].y,  6, 6 );

		ctx.stroke();
	}

	var paint = function paint() {

		// Возвращает координаты точки на холсте,
		// взятые от координаты DOM-узла токи и нормированные на масштаб
		function getCoordsFromCss( dom ) {

			return {
				x: dom.style.left.replace('px', '') * scale,
				y: dom.style.top.replace('px', '') * scale
			}
		};

		// Ощищаем холст
		ctx.clearRect(0,0,canvas.width,canvas.height);

		// Выводим линии
		// Перебираем текущие узлы и получаем их координаты.
		// Узлы образуют траектории, отдельных траекторий может быть много
		for (path in paths) {
			// IE умирает от setStrokeColor
			if ( (document.querySelector('.debug__view_hidden') === null) && (document.querySelector('.debug__control-traects option[value="' + path + '"]').selected) ) {
				ctx.setStrokeColor('#383');
			} else {
				ctx.setStrokeColor('#000');
			}

			// Работаем с каждой траекторией в списке
			if (paths[path].dots.length) {

				paths[path].steps = [];

				// Характеристики линии
				// смещение к началу рисования траектории
				ctx.lineWidth = "1";
				ctx.beginPath();
				ctx.moveTo( paths[path].dots[0].mainHandle.x, paths[path].dots[0].mainHandle.y );

				// Обновляем координаты точки из DOM
				paths[path].dots[0].mainHandle.x = getCoordsFromCss( paths[path].dots[0].mainHandle.dom ).x;
				paths[path].dots[0].mainHandle.y = getCoordsFromCss( paths[path].dots[0].mainHandle.dom ).y;
				paths[path].dots[0].mainHandle.dom.classList.add('debug__point_first');

				// Если у первой точки есть рычаг
				if (paths[path].dots[0].nextHandle !== null) {
					// Обновляем его координаты из DOM
					paths[path].dots[0].nextHandle.x = getCoordsFromCss( paths[path].dots[0].nextHandle.dom ).x;
					paths[path].dots[0].nextHandle.y = getCoordsFromCss( paths[path].dots[0].nextHandle.dom ).y;

					// рисуем
					ctx.lineTo(paths[path].dots[0].nextHandle.x, paths[path].dots[0].nextHandle.y);

					// Возвращаем перо к точке траектории
					ctx.moveTo( paths[path].dots[0].mainHandle.x, paths[path].dots[0].mainHandle.y );
				}

				// Отрисовка точек, начиная со второй
				// отдельно, потому что между двумя точками уже можно провести линию
				for (var i = 1; i < paths[path].dots.length; i++) {
					// обновить координаты точки из DOM
					paths[path].dots[i].mainHandle.x = getCoordsFromCss( paths[path].dots[i].mainHandle.dom ).x;
					paths[path].dots[i].mainHandle.y = getCoordsFromCss( paths[path].dots[i].mainHandle.dom ).y;

					// Если следующий рычаг существует, обновить его координаты из DOM
					if (paths[path].dots[i].nextHandle !== null) {
						paths[path].dots[i].nextHandle.x = getCoordsFromCss( paths[path].dots[i].nextHandle.dom ).x;
						paths[path].dots[i].nextHandle.y = getCoordsFromCss( paths[path].dots[i].nextHandle.dom ).y;
					}

					// Координаты управляющей точки предыдущего отрезка
					paths[path].dots[i].prevHandle.x = getCoordsFromCss( paths[path].dots[i].prevHandle.dom ).x;
					paths[path].dots[i].prevHandle.y = getCoordsFromCss( paths[path].dots[i].prevHandle.dom ).y;

					// Сама кривая
					//ctx.bezierCurveTo( paths[path].dots[i-1].nextHandle.x, paths[path].dots[i-1].nextHandle.y, paths[path].dots[i].prevHandle.x, paths[path].dots[i].prevHandle.y, paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )
					ctx.moveTo(paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y);

					// Нарисовать рычаг предыдущего отрезка
					ctx.lineTo(paths[path].dots[i].prevHandle.x, paths[path].dots[i].prevHandle.y);

					// Если есть следующая точка, то есть рычаг следующего отрезка
					if (paths[path].dots[i].nextHandle !== null) {

						// нарисовать его
						ctx.moveTo( paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )
						ctx.lineTo(paths[path].dots[i].nextHandle.x, paths[path].dots[i].nextHandle.y);

						// вернуть перо в точку завершения отрисовки кривой
						ctx.moveTo( paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )
					}

					var stepsArray = buildCurveSteps({
						x1: paths[path].dots[i-1].mainHandle.x,
						y1: paths[path].dots[i-1].mainHandle.y,
						ax1: paths[path].dots[i-1].nextHandle.x,
						ay1: paths[path].dots[i-1].nextHandle.y,
						ax2: paths[path].dots[i].prevHandle.x,
						ay2: paths[path].dots[i].prevHandle.y,
						x2: paths[path].dots[i].mainHandle.x,
						y2: paths[path].dots[i].mainHandle.y,
						t1: 0,
						t2: 1
					})

					for (var j = 0; j < stepsArray.length; j++) {
						ctx.rect( stepsArray[j].x, stepsArray[j].y, 1, 1 );

						paths[path].steps.push({
							x: stepsArray[j].x,
							y: stepsArray[j].y
						})
					}

					// Проверка на плотность шагов
					/*console.clear();
					for (var j = 1; j < stepsArray.length; j++) {
						var d =  getDistance({
							x1: stepsArray[j-1].x,
							y1: stepsArray[j-1].y,
							x2: stepsArray[j].x,
							y2: stepsArray[j].y
						})

						if (d >= 1.4) {
							console.log(j);
						}
					}*/
				}

				// отрендерить все линии
				ctx.stroke();

				// генерация управляющей области
				if (paths[path].steps.length) {
					buildControlPoligon({
						pathId: path
					})
				}
			}
		}

	}

	// Добавляем в список траекторий новую, с заданным именем
	var addPath = function addPath(p) {
		paths[p.name] = {
			dots: [],
			steps: [],
			name: p.name
		}
	}

	// Добавляет точку на холст с заданными координатами
	//p.x
	//p.y
	var addPoint = function addPoint(p) {
		var pathList = document.querySelectorAll('.debug__control-traects option'),
			currentPathId,
			currentPath,
			preLastPathPoint,
			lastPathPoint,
			tempPoint,
			newPoint = {
				mainHandle: {
					x: p.x * scale,
					y: p.y * scale
				},
				prevHandle: null,
				nextHandle: null
			}

		if (!pathList.length) {
			var name = Math.random(),
				newItem = document.createElement('option');

			newItem.textContent = name;
			newItem.setAttribute('value', name);
			newItem.selected = true;

			document.querySelector('.debug__control-traects select').appendChild(newItem);

			addPath({
				name: name
			});

			currentPathId = name
		} else {
			// Поиск по списку созданных траекторий
			// активная та, что имеет свойство .selected
			// Как только находим её, забираем её идентификатор и выходим из списка
			for (var i = 0; i < pathList.length; i++) {
				if (!!pathList[i].selected) {
					currentPathId = pathList[i].getAttribute('value');
					break;
				}
			}

		}

		// Если вообще ничего не выделено, не добавляем точку
		if (!paths[currentPathId]) return false;

		// Если в траектории уже есть точки,
		// значит добавление новой точки неявно повлечет создание кривой между ними,
		// значит нужно поработать с парой последних точек в траектории
		if ( paths[currentPathId].dots.length ) {
			preLastPathPoint = paths[currentPathId].dots[ paths[currentPathId].dots.length-1 ];
		}

		// Добавили самую последнюю точку — только что созданную
		paths[currentPathId].dots.push(newPoint);
		lastPathPoint = paths[currentPathId].dots[ paths[currentPathId].dots.length-1 ];

		// Если точек в пути теперь больше одной, создаем управляющие рычаги для кривой
		if (!!preLastPathPoint) {

			// (x1, y1) и (x2, y2) — координаты управлящих точек
			var addBezierPoint = getAdditionalBezierPointsCoords({
				x1: preLastPathPoint.mainHandle.x / scale,
				y1: preLastPathPoint.mainHandle.y / scale,
				x2: lastPathPoint.mainHandle.x / scale,
				y2: lastPathPoint.mainHandle.y / scale
			})

			// Создаем DOM-представление для рычага предыдущей точки
			tempPoint = document.createElement('div');
			tempPoint.className = 'debug__point-handle';
			tempPoint.style.top = addBezierPoint.ay1 + 'px';
			tempPoint.style.left = addBezierPoint.ax1 + 'px';
			preLastPathPoint.nextHandle = {
				dom: tempPoint
			}

			debugPanel.appendChild(tempPoint);

			// Создаем DOM-представление для рычага новой точки
			tempPoint = document.createElement('div');
			tempPoint.className = 'debug__point-handle';
			tempPoint.style.top = addBezierPoint.ay2 + 'px';
			tempPoint.style.left = addBezierPoint.ax2 + 'px';
			lastPathPoint.prevHandle = {
				dom: tempPoint
			}

			debugPanel.appendChild(tempPoint);
		}

		// создаем DOM-представление для новой точки
		var tempPoint = document.createElement('div');
		tempPoint.className = 'debug__point';
		tempPoint.style.top = p.y + 'px';
		tempPoint.style.left = p.x + 'px';
		lastPathPoint.mainHandle.dom = tempPoint;

		debugPanel.appendChild(tempPoint);

		// нужна перерисовка сцены
		repaint = true;

	}

	var buildGraph = function buildGraph() {
		var serviceGraph = {},
			adjacencyMatrix;

		function makeIdByCoords(x, y) {

			return Math.round(x).toString() + '_' + Math.round(y).toString();
		}

		function addToGraph(pathName, linkToPathPoint1, linkToPathPoint2, point1, point2, distance) {

			if ( serviceGraph[point1] === undefined ) {
				serviceGraph[point1] = {
					link: {}
				};
			}

			if (serviceGraph[point1].link[path] === undefined  ) {
				serviceGraph[point1].link[path] = linkToPathPoint1;
			}

			if ( serviceGraph[point2] === undefined ) {
				serviceGraph[point2] = {
					link: {}
				};
			}

			if (serviceGraph[point2].link[path] === undefined  ) {
				serviceGraph[point2].link[path] = linkToPathPoint2;
			}

			if ( serviceGraph[point1][point2] === undefined ) {
				serviceGraph[point1][point2] = {
					distance: distance,
					path: pathName
				}
			}

			if ( serviceGraph[point2][point1] === undefined ) {
				serviceGraph[point2][point1] = {
					distance: distance,
					path: pathName
				}
			}
		}

		function buildAdjacencyMatrix() {
			var reference = [];

			for (var point in serviceGraph) {
				reference.push(point);
			}

			visualizeGraph(reference);

			adjacencyMatrix = new Array(reference.length);

			for (var i = 0; i < reference.length; i++) {
				adjacencyMatrix[i] = new Array(reference.length);

				for (var j = 0; j < reference.length; j++) {
					var distance = (serviceGraph[ reference[i] ][ reference[j] ])
						? serviceGraph[ reference[i] ][ reference[j] ].distance
						: (i == j)
							? 0
							: Number.POSITIVE_INFINITY;

					var path = (distance)
						? [i, j]
						: [];

					adjacencyMatrix[i][j] = {
						path: path,
						distance: distance
					}
				}
			}

			calculateShortestDistance();

			for (var point = 0; point < reference.length; point++) {

				graph[point] = {
					targets: {},
					links: {}
				}

				for (var linkId in serviceGraph[ reference[point] ].link) {

					serviceGraph[ reference[point] ].link[linkId].graphId = point;

					graph[point].links[linkId] = serviceGraph[ reference[point] ].link[linkId];

					for (var otherId = 0; otherId < reference.length; otherId++) {
						//console.log(reference[point], reference[otherId]);
						var pathName = (serviceGraph[ reference[point] ][ reference[otherId] ] !== undefined)
							? serviceGraph[ reference[point] ][ reference[otherId] ].path
							: false;

						graph[point].targets[ otherId ] = {
							distance: adjacencyMatrix[point][otherId].distance,
							path: [],
							pathName: pathName
						}

						for (var graphPath = 0; graphPath < adjacencyMatrix[point][otherId].path.length; graphPath++) {
							graph[point].targets[otherId].path.push( adjacencyMatrix[point][otherId].path[graphPath] );
						}
					}


				}
			}
		}

		function calculateShortestDistance() {
			var n = adjacencyMatrix[0].length;

			for (var k = 0; k < n; k++) {
				for (var i = 0; i < n; i++) {
					for (var j = 0; j < n; j++) {

						if (adjacencyMatrix[i][j].distance > (adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance) ) {
							adjacencyMatrix[i][j].distance = adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance;


							adjacencyMatrix[i][j].path = [];

							for (var e1 = 0; e1 < adjacencyMatrix[i][k].path.length; e1++) {
								adjacencyMatrix[i][j].path.push( adjacencyMatrix[i][k].path[e1] );
							}

							for (var e2 = 1; e2 < adjacencyMatrix[k][j].path.length; e2++) {
								adjacencyMatrix[i][j].path.push( adjacencyMatrix[k][j].path[e2] );
							}
						}

					}
				}
			}
		}

		function visualizeGraph(arr) {
			for (var i = 0; i < arr.length; i++) {
				var x = arr[i].split('_')[0];
				var y = arr[i].split('_')[1];

				ctx.strokeText( i, x, y-10 );
			}
		}

		for (var path in paths) {
			var point1 = paths[path].dots[0].mainHandle;
			var point2 = paths[path].dots[ paths[path].dots.length-1 ].mainHandle;
			var distance = paths[path].steps.length;

			addToGraph(path, paths[path].dots[0], paths[path].dots[ paths[path].dots.length-1 ], makeIdByCoords(point1.x, point1.y), makeIdByCoords(point2.x, point2.y), distance);
		}

		buildAdjacencyMatrix();
	}

	return {
		init: function() {
			readTraectFromFile();
			render();

			return this;
		},

		addPath: function(p) {
			addPath(p);

			return this;
		},

		addPoint: function(p) {
			addPoint(p);

			return this;
		},

		paint: function() {
			paint();

			return this;
		}
	}
}()

document.addEventListener("DOMContentLoaded", function(e) {

	var currentTarget;

	debugPanel = document.querySelector('.debug');
	canvas = document.querySelector('.debug__view');
	dots = document.querySelectorAll('.debug__point');
	ctx = canvas.getContext('2d');

	scale = 510 / canvas.clientHeight;

	var pathList = document.querySelector('.debug__control-traects select'),
		tempPoint = {
			x: 0,
			y: 0
		}

	var newObj;

	// возвращает выбранный в списке путь или false
	function getCurrentPath() {
		var pathListItem = document.querySelectorAll('.debug__control-traects option'),
			currentPathId,
			currentPath = false;;

		for (var i = 0; i < pathListItem.length; i++) {
			if (!!pathListItem[i].selected) {
				currentPathId = pathListItem[i].getAttribute('value');
				break;
			}
		}

		if (!!paths[currentPathId]) {
			currentPath = paths[currentPathId];
		}

		return currentPath;
	}

	debugPanel.addEventListener("mousedown", function(e) {
		e.stopPropagation();

		// Событие начала перетаскивания
		// Точка
		if ( e.target.classList.contains('debug__point') ) {
			tempPoint.x = e.pageX;
			tempPoint.y = e.pageY;

			e.target.isDragged = true;
			currentTarget = e.target;

			e.target.classList.add('debug__point_dragged');
		}

		// Контрольный рычаг
		if ( e.target.classList.contains('debug__point-handle' )) {
			e.target.isDragged = true;
			currentTarget = e.target;
		}
	})

	debugPanel.addEventListener("mouseup", function(e) {
		e.stopPropagation();

		// Событие завершение перетаскивания
		// обрабатывается одинаково точкой и рычагом
		if ( (e.target.classList.contains('debug__point')) || (e.target.classList.contains('debug__point-handle')) ) {
			e.target.isDragged = undefined;
			currentTarget = undefined;
			e.target.classList.remove('debug__point_dragged');
		}
	})

	debugPanel.addEventListener("mousemove", function(e) {

		// Событие факта перетаскивания
		if (currentTarget !== undefined) {
			currentTarget.style.top = e.pageY + 'px';
			currentTarget.style.left = e.pageX + 'px';

			// Залипание точки
			if ( (e.target.classList.contains('debug__point')) && (e.target !== currentTarget) ) {
				currentTarget.style.top = e.target.style.top;
				currentTarget.style.left = e.target.style.left;
			}

			// При перетаскивании точки её рычаги переносятся аналогично
			if (currentTarget.classList.contains('debug__point')) {
				var d = {
					x: Number(currentTarget.style.left.replace('px', '')) - tempPoint.x,
					y: Number(currentTarget.style.top.replace('px', '')) - tempPoint.y,
				}
				tempPoint = {
					x: e.pageX,
					y: e.pageY
				}

				if ( (currentTarget.nextSibling !== null) && (currentTarget.nextSibling.className == 'debug__point-handle') ) {
					currentTarget.nextSibling.style.top = Number(currentTarget.nextSibling.style.top.replace('px', '')) + d.y + 'px';
					currentTarget.nextSibling.style.left = Number(currentTarget.nextSibling.style.left.replace('px', '')) + d.x + 'px';
				}

				if ( (currentTarget.previousSibling !== null) && (currentTarget.previousSibling.className == 'debug__point-handle') ) {
					currentTarget.previousSibling.style.top = Number(currentTarget.previousSibling.style.top.replace('px', '')) + d.y + 'px';
					currentTarget.previousSibling.style.left = Number(currentTarget.previousSibling.style.left.replace('px', '')) + d.x + 'px';
				}
			}

			// Требуется перерисовка
			repaint = true;
		}
	})

	debugPanel.addEventListener("dblclick", function(e) {
		if (e.target.classList.contains('debug__point') ) {
			e.stopPropagation();

			// TODO: удаление точки
			console.log('point dbl click');
		}

		// Даблклик по холсту создает новую точку
		if (e.target.classList.contains('debug__view') ) {
			e.stopPropagation();

			debugTraect.addPoint({
				x: e.pageX,
				y: e.pageY
			})
		}
	})

	debugPanel.addEventListener("click", function(e) {

		// переключить оверлей
		if (e.target.classList.contains('debug__button_toggle-overlay')) {
			e.stopPropagation();

			if ( canvas.classList.contains('debug__view_hidden') ) {
				canvas.classList.remove('debug__view_hidden');
			} else {
				canvas.classList.add('debug__view_hidden');
			}
		}

		// Добавление траектории
		if (e.target.classList.contains('debug__button_add')) {
			e.stopPropagation();

			var name = Math.random(),
				newItem = document.createElement('option');

			newItem.textContent = name;
			newItem.setAttribute('value', name);
			newItem.selected = true;

			pathList.appendChild(newItem);

			debugTraect.addPath({
				name: name
			});
		}

		// Переключение траектории
		if (e.target.tagName == 'OPTION') {
			e.stopPropagation();

			debugTraect.paint();
		}

		// Удаление траектории
		if (e.target.classList.contains('debug__button_remove')) {
			e.stopPropagation();

			var pathListItem = document.querySelectorAll('.debug__control-traects option'),
				currentPathId,
				currentPath = false;;

			for (var i = 0; i < pathListItem.length; i++) {
				if (!!pathListItem[i].selected) {
					currentPathId = pathListItem[i].getAttribute('value');
					break;
				}
			}

			pathList.removeChild( pathListItem[i] );

			if (!!paths[currentPathId]) {

				for (var i = 0; i < paths[currentPathId].dots.length; i++) {

					if ( paths[currentPathId].dots[i].mainHandle !== null  ) {
						debugPanel.removeChild( paths[currentPathId].dots[i].mainHandle.dom );
					}

					if ( paths[currentPathId].dots[i].prevHandle !== null ) {
						debugPanel.removeChild( paths[currentPathId].dots[i].prevHandle.dom );
					}

					if ( paths[currentPathId].dots[i].nextHandle !== null ) {
						debugPanel.removeChild( paths[currentPathId].dots[i].nextHandle.dom );
					}
				}

				delete paths[currentPathId];
			}

			repaint = true;
		}

		// Добавление модели
		if (e.target.classList.contains('debug__button_add-model')) {
			e.stopPropagation();

			var currentPath = getCurrentPath();
			if (!currentPath) return false;

			if (currentPath.steps.length) {
				newObj = obj().create({
						src: 'assets/models/spineboy/spineboy.anim',
						x: currentPath.steps[0].x,
						y: currentPath.steps[0].y,
						z: 15,
						scale: 0.5,
						hero: true,
						step: 0,
						path: currentPath.name
					});

				newObj.image.state.clearAnimation();

				scene.addObj(newObj);
			}
		}

		// Сохранение в файл
		if (e.target.classList.contains('debug__button_save')) {
			e.stopPropagation();

			// Создаем упрощенную версию пути без ссылок на DOM-узлы
			var smallPaths = {};

			for (var path in paths) {
				smallPaths[path] = {
					name: path,
					dots: []
				};

				for (var dot = 0; dot < paths[path].dots.length; dot++) {
					var prevHandle = null,
						nextHandle = null;

					var mainHandle = {
						x: paths[path].dots[dot].mainHandle.x,
						y: paths[path].dots[dot].mainHandle.y
					}

					if (paths[path].dots[dot].prevHandle !== null) {
						prevHandle = {
							x: paths[path].dots[dot].prevHandle.x,
							y: paths[path].dots[dot].prevHandle.y
						}
					}

					if (paths[path].dots[dot].nextHandle !== null) {
						nextHandle = {
							x: paths[path].dots[dot].nextHandle.x,
							y: paths[path].dots[dot].nextHandle.y
						}
					}

					smallPaths[path].dots.push({
						mainHandle: mainHandle,
						nextHandle: nextHandle,
						prevHandle: prevHandle
					})
				}
			}

			// Создаем XHR
			var req = new XMLHttpRequest;
			var param = 'data=' + JSON.stringify(smallPaths);
			req.open("POST", '/tools/writeTraectToFile.php');
			req.onreadystatechange = function() {

				if ((req.status == 200) && (req.readyState==4)) {
					console.log(req.responseText)
				}
			};

			req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			req.send(param);
		}

		if (e.target.classList.contains('debug__point') || e.target.classList.contains('debug__point-handle')) {
			e.stopPropagation();
		}

	})

	// Движение объекта
	var movement = {
		current: false,
		switchFx: false,
		fx: null
	};

	function moveHero(e) {
		if (newObj === undefined) return false;

		var animations = newObj.image.state.data.skeletonData.animations,
			animationName = animations[animations.length-1].name;

		newObj.image.stateData.setMixByName("walk", "stop", 0.5);

		//var currentPath = getCurrentPath(),
		//	pathChainCount = currentPath.controlPath.length;

		// Движение модели до заданного шага
		// p.direction
		// p.speed
		// p.targetStep
		function move( p ) {

			var currentPath = p.currentPath,
				callback = p.callback || function() {};

			if (Math.abs(newObj.step - p.targetStep) < p.speed) {
				newObj.image.state.setAnimationByName("stop", false);
				movement.current = false;
				callback();
				return;
			}

			if (movement.switchFx) {
				movement.switchFx = false;
				movement.fx();
				callback();
				return;
			}

			if (newObj.image.state.isComplete()) {
				newObj.image.state.setAnimationByName( animationName , false);
			}

			movement.current = true;

			newObj.step = newObj.step + p.direction * p.speed;
			newObj.move({
				x: currentPath.steps[ newObj.step ].x,
				y: currentPath.steps[ newObj.step ].y,
			})

			requestAnimationFrame( function() {
				move({
					currentPath: currentPath,
					direction: p.direction,
					speed: p.speed,
					targetStep: p.targetStep,
					callback: p.callback
				});
			} );
		}

		// Запуск движения модели к заданному шагу
		function processControlPoint( p ) {

			var modelStep = newObj.step,
				currentPath = paths[ p.pathName ],
				targetStep = currentPath.controlPath[ p.chain ].step,
				callback = p.callback || function() {};

			if (modelStep == targetStep ) return false;

			// Направление движения
			var stepDirection = currentPath.controlPath[ p.chain ].step - newObj.step;
			stepDirection != 0
				? stepDirection = stepDirection / Math.abs(stepDirection)
				: false;

			// включили анимацию перед движением
			newObj.image.state.setAnimationByName( animationName , false);

			if (!movement.current) {
				move({
					currentPath: currentPath,
					direction: stepDirection,
					speed: 2,
					targetStep: targetStep,
					callback: callback
				})

			} else {
				movement = {
					switchFx: true,
					fx: function() {
						move({
							currentPath: currentPath,
							direction: stepDirection,
							speed: 2,
							targetStep: targetStep,
							callback: callback
						})
					}
				}
			}
		}

		function processPaths( pathArray, targetChain ) {
console.log( pathArray, targetChain );
				if (pathArray.length > 1) {
					processControlPoint({
						pathName: pathArray[0],
						chain: paths[ pathArray[0] ].controlPath.length-1,
						callback: function() {

							newObj.step = 0;
							newObj.path = pathArray[1];

							var trash = pathArray.shift();
							processPaths( pathArray, targetChain );
						}
					});
					movement.current = true;
				} else {
					newObj.step = 0;
					newObj.path = pathArray[0];

					processControlPoint({
						pathName: pathArray[0],
						chain: targetChain
					});
				}
		}

		// Поиск шага, сопоставленного с областью клика

		var targetX = e.pageX || e.changedTouches[0].pageX,
			targetY = e.pageY || e.changedTouches[0].pageY;

		// TODO: Переделать на перебор всех возможных траекторий
		// В случае совпадения области у двух и более траекторий выбирать кратчайший путь
		// Весом ребра графа будет количество шагов
		/*while(pathChainCount--) {
			if (currentPath.controlPath[pathChainCount].rect.contains( targetX * scale, targetY * scale )) {

				processControlPoint(pathChainCount);
				movement.current = true;
				break;
			}
		}*/

		var currentPath = [
			{
				steps: newObj.step,
				graphId: paths[ newObj.path ].dots[0].graphId
			},
			{
				steps: paths[ newObj.path ].steps.length - newObj.step,
				graphId: paths[ newObj.path ].dots[ paths[ newObj.path ].dots.length-1 ].graphId
			}
		];

		var resultPath = {
			steps: Number.POSITIVE_INFINITY,
			graphIdStart: null,
			graphIdEnd: null
		}

		// получить опорные точки у текущей траектории

		// перебрать все траектории, понять, на которых из них может лежать целевая точка
		for (path in paths) {
			for (var chain = 0; chain < paths[path].controlPath.length; chain++) {
				if (paths[path].controlPath[chain].rect.contains( targetX * scale, targetY * scale )) {

					var	candidatePath = [
						{
							steps: paths[path].controlPath[chain].step,
							graphId: paths[path].dots[0].graphId
						},
						{
							steps: paths[path].steps.length - paths[path].controlPath[chain].step,
							graphId: paths[path].dots[ paths[path].dots.length-1 ].graphId
						}
					]

					var minPath = {
						steps: Number.POSITIVE_INFINITY,
						graphIdStart: null,
						graphIdEnd: null
					}

					for (var currentPathVar = 0 ; currentPathVar < 2; currentPathVar++) {
						for (var candidatePathVar = 0 ; candidatePathVar < 2; candidatePathVar++) {

							var tDistance = currentPath[currentPathVar].steps +
								candidatePath[candidatePathVar].steps +
								graph[ currentPath[currentPathVar].graphId ].targets[ candidatePath[candidatePathVar].graphId ].distance;

							if ( (tDistance) < minPath.steps ) {

								minPath = {
									steps: tDistance,
									graphIdStart: currentPath[currentPathVar].graphId,
									graphIdEnd: candidatePath[candidatePathVar].graphId
								}
							}

						}
					}

					if ( resultPath.steps > minPath.steps ) {

						resultPath = {
							steps: minPath.steps,
							graphIdStart: minPath.graphIdStart,
							graphIdEnd: minPath.graphIdEnd,
							path: path,
							chain: chain
						}
					}
				}
			}
		}

		var targetPath = graph[resultPath.graphIdStart].targets[resultPath.graphIdEnd],
			pathArray = [];

		for (var pathSteps = 1; pathSteps < targetPath.path.length; pathSteps++ ) {
			pathArray.push(graph[ targetPath.path[pathSteps-1] ].targets[ targetPath.path[pathSteps] ].pathName );
		}

		pathArray.push( resultPath.path );
		processPaths(pathArray, resultPath.chain);
	}

	document.body.addEventListener('click', function(e) {
		if ( document.querySelector('.debug__view.debug__view_hidden') !== null ) {
			moveHero(e);
		}
	})

	document.body.addEventListener('touchend', function(e) {
		if ( document.querySelector('.debug__view.debug__view_hidden') !== null ) {
			moveHero(e);
		}
	})

	// Автодобавление объекта
	setTimeout( function() {
		var currentPath = paths[ document.querySelector('.debug__control-traects option').getAttribute('value') ];
		if (!currentPath) return false;

		if (currentPath.steps.length) {
			newObj = obj().create({
					src: 'assets/models/spineboy/spineboy.anim',
					x: currentPath.steps[0].x,
					y: currentPath.steps[0].y,
					z: 15,
					scale: 0.5,
					hero: true,
					step: 0,
					path: currentPath.name
				});

			newObj.image.state.clearAnimation();

			scene.addObj(newObj);
		}

	}, 2000 )

	// инициализация траектории
	debugTraect
		.init();
})
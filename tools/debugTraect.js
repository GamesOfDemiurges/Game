var repaint = false,
	debugPanel,
	canvas,
	ctx,
	scale;

var paths = {},
	graph = {};

var debugTraect = function debugTraect() {

	var _this = this;

	// Перерисовка служебного холста
	var render = function render() {
		if (repaint) {
			paint();
			repaint = false;
		}

		requestAnimFrame(render);
	}

	function buildInterfaceFromPaths() {
		var newItem,
			tempPoint,
			pathList = document.querySelector('.debug__control-traects select');

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
			var addBezierPoint = utils.getAdditionalBezierPointsCoords({
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

	function visualizeGraph(arr) {
		for (var i = 0; i < arr.length; i++) {
			var x = arr[i].split('_')[0];
			var y = arr[i].split('_')[1];

			ctx.strokeText( i, x, y-10 );
		}
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
						src: 'assets/models/hero/images/hero_final.anim',
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



	// Автодобавление объекта
	setTimeout( function() {
		var currentPath = paths[ document.querySelector('.debug__control-traects option').getAttribute('value') ];
		if (!currentPath) return false;

		if (currentPath.steps.length) {
			newObj = obj().create({
					src: 'assets/models/hero/images/hero_final.anim',
					x: currentPath.steps[0].x,
					y: currentPath.steps[0].y,
					z: 15,
					scale: 0.5,
					hero: true,
					step: 0,
					path: currentPath.name
				});

			//newObj.image.state.clearAnimation();

			scene.addObj(newObj);
		}

	}, 2000 )

	// инициализация траектории
	debugTraect
		.init();
})
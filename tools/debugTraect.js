var repaint = false,
	debugPanel,
	canvas,
	ctx,
	scale;

var paths = {};

var debugTraect = function debugTraect() {

	var _this = this;

	// Извлечение сохраненных путей из файла
	var readTraectFromFile = function readTraectFromFile () {
		var readTraect = new XMLHttpRequest;
		readTraect.open("POST", '/tools/traect.json');
		readTraect.onreadystatechange = function() {

			if ((readTraect.status == 200) && (readTraect.readyState==4)) {
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
	var getDistance = function getDistance(p) {
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
	var getBezierPointCoords = function getBezierPointCoords(p) {

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
	var buildCurveSteps = function buildCurveSteps(p) {

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
			if ( document.querySelector('.debug__control-traects option[value="' + path + '"]').selected ) {
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

		// Событие начала перетаскивания
		// Точка
		if ( e.target.classList.contains('debug__point') ) {
			tempPoint.x = e.pageX;
			tempPoint.y = e.pageY;

			e.target.isDragged = true;
			currentTarget = e.target;
		}

		// Контрольный рычаг
		if ( e.target.classList.contains('debug__point-handle' )) {
			e.target.isDragged = true;
			currentTarget = e.target;
		}
	})

	debugPanel.addEventListener("mouseup", function(e) {

		// Событие завершение перетаскивания
		// обрабатывается одинаково точкой и рычагом
		if ( (e.target.classList.contains('debug__point')) || (e.target.classList.contains('debug__point-handle')) ) {
			e.target.isDragged = undefined;
			currentTarget = undefined;
		}
	})

	debugPanel.addEventListener("mousemove", function(e) {

		// Событие факта перетаскивания
		if (currentTarget !== undefined) {
			currentTarget.style.top = e.pageY + 'px';
			currentTarget.style.left = e.pageX + 'px';

			// При перетаскивании точки её рычаги переносятся аналогично
			if (e.target.classList.contains('debug__point')) {
				var d = {
					x: Number(e.target.style.left.replace('px', '')) - tempPoint.x,
					y: Number(e.target.style.top.replace('px', '')) - tempPoint.y,
				}
				tempPoint = {
					x: e.pageX,
					y: e.pageY
				}

				if ( (e.target.nextSibling !== null) && (e.target.nextSibling.className == 'debug__point-handle') ) {
					e.target.nextSibling.style.top = Number(e.target.nextSibling.style.top.replace('px', '')) + d.y + 'px';
					e.target.nextSibling.style.left = Number(e.target.nextSibling.style.left.replace('px', '')) + d.x + 'px';
				}

				if ( (e.target.previousSibling !== null) && (e.target.previousSibling.className == 'debug__point-handle') ) {
					e.target.previousSibling.style.top = Number(e.target.previousSibling.style.top.replace('px', '')) + d.y + 'px';
					e.target.previousSibling.style.left = Number(e.target.previousSibling.style.left.replace('px', '')) + d.x + 'px';
				}
			}

			// Требуется перерисовка
			repaint = true;
		}
	})

	debugPanel.addEventListener("dblclick", function(e) {
		if (e.target.classList.contains('debug__point') ) {
			// TODO: удаление точки
			console.log('point dbl click');
		}

		// Даблклик по холсту создает новую точку
		if (e.target.classList.contains('debug__view') ) {
			debugTraect.addPoint({
				x: e.pageX,
				y: e.pageY
			})
		}
	})

	debugPanel.addEventListener("click", function(e) {

		// переключить оверлей
		if (e.target.classList.contains('debug__button_toggle-overlay')) {

			if ( canvas.classList.contains('debug__view_hidden') ) {
				canvas.classList.remove('debug__view_hidden');
			} else {
				canvas.classList.add('debug__view_hidden');
			}
		}

		// Добавление траектории
		if (e.target.classList.contains('debug__button_add')) {
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
			debugTraect.paint();
		}

		// Удаление траектории
		if (e.target.classList.contains('debug__button_remove')) {
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

			var currentPath = getCurrentPath();
			if (!currentPath) return false;

			if (currentPath.steps.length) {
				newObj = obj().create({
						src: 'assets/models/spineboy/spineboy.anim',
						x: currentPath.steps[0].x,
						y: currentPath.steps[0].y,
						z: 15,
						scale: 0.5,
						hero: true
					});

				newObj.image.state.clearAnimation();

				scene.addObj(newObj);
			}
		}

		// Модель идет вперед
		if (e.target.classList.contains('debug__button-model-forward')) {
			var currentPath = getCurrentPath();
			if (!currentPath) return false;

			var animations = newObj.image.state.data.skeletonData.animations;
			newObj.image.state.setAnimationByName( animations[animations.length-1].name , true);

			var i = 0;

			var moveForward = function moveForward(j) {

				if ((currentPath.steps.length-1 - j) < 0) {
					newObj.image.state.clearAnimation();
					return;
				}

				newObj.move({
					x: currentPath.steps[j].x,
					y: currentPath.steps[j].y,
				})

				j += 2;

				requestAnimationFrame( function() {
					moveForward(j);
				} );
			}(i);


		}

		// Модель идет назад
		if (e.target.classList.contains('debug__button-model-backward')) {
			var currentPath = getCurrentPath();
			if (!currentPath) return false;

			var animations = newObj.image.state.data.skeletonData.animations;
			newObj.image.state.setAnimationByName( animations[animations.length-1].name , true);

			var i = currentPath.steps.length-1;

			var moveBack = function moveBack(j) {

				if (j < 0) {
					newObj.image.state.clearAnimation();
					return;
				}

				newObj.move({
					x: currentPath.steps[j].x,
					y: currentPath.steps[j].y,
				})

				j -= 2;

				requestAnimationFrame( function() {
					moveBack(j);
				} );
			}(i);
		}

		// Сохранение в файл
		if (e.target.classList.contains('debug__button_save')) {

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

	})

	// инициализация траектории
	debugTraect
		.init();
})
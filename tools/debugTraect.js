var repaint = false,
	debugPanel,
	dots,
	canvas,
	ctx,
	scale;

var paths = {};

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

		// Вернуть позицию управляющих точек
		//p.x1
		//p.y1
		//p.x2
		//p.y2
	var getAdditionalBezierPointsCoords = function getAdditionalBezierPointsCoords( p ) {
			var ap1 = 0.3,
				ap2 = 0.7;

			return {
				ax1: (p.x2 - p.x1) * ap1 + p.x1,
				ay1: (p.y2 - p.y1) * ap1 + p.y1,
				ax2: (p.x2 - p.x1) * ap2 + p.x1,
				ay2: (p.y2 - p.y1) * ap2 + p.y1
			}
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
		// Накладываем коэффициент масштабирования
		for (path in paths) {

			if (paths[path].dots.length) {
				ctx.lineWidth = "1";
				ctx.beginPath();
				ctx.moveTo( paths[path].dots[0].mainHandle.x, paths[path].dots[0].mainHandle.y );

				paths[path].dots[0].mainHandle.x = getCoordsFromCss( paths[path].dots[0].mainHandle.dom ).x;
				paths[path].dots[0].mainHandle.y = getCoordsFromCss( paths[path].dots[0].mainHandle.dom ).y;

				if (paths[path].dots[0].nextHandle !== null) {
					paths[path].dots[0].nextHandle.x = getCoordsFromCss( paths[path].dots[0].nextHandle.dom ).x;
					paths[path].dots[0].nextHandle.y = getCoordsFromCss( paths[path].dots[0].nextHandle.dom ).y;
					ctx.lineTo(paths[path].dots[0].nextHandle.x, paths[path].dots[0].nextHandle.y);
					ctx.moveTo( paths[path].dots[0].mainHandle.x, paths[path].dots[0].mainHandle.y );
				}

				for (var i = 1; i < paths[path].dots.length; i++) {
					paths[path].dots[i].mainHandle.x = getCoordsFromCss( paths[path].dots[i].mainHandle.dom ).x;
					paths[path].dots[i].mainHandle.y = getCoordsFromCss( paths[path].dots[i].mainHandle.dom ).y;

					if (paths[path].dots[i].nextHandle !== null) {
						paths[path].dots[i].nextHandle.x = getCoordsFromCss( paths[path].dots[i].nextHandle.dom ).x;
						paths[path].dots[i].nextHandle.y = getCoordsFromCss( paths[path].dots[i].nextHandle.dom ).y;
					}

					//if (paths[path].dots[i].prevHandle.dom !== null) {
						paths[path].dots[i].prevHandle.x = getCoordsFromCss( paths[path].dots[i].prevHandle.dom ).x;
						paths[path].dots[i].prevHandle.y = getCoordsFromCss( paths[path].dots[i].prevHandle.dom ).y;
					//}


					ctx.lineWidth = "3";
					ctx.bezierCurveTo( paths[path].dots[i-1].nextHandle.x, paths[path].dots[i-1].nextHandle.y, paths[path].dots[i].prevHandle.x, paths[path].dots[i].prevHandle.y, paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )

					ctx.lineWidth = "1";
					ctx.lineTo(paths[path].dots[i].prevHandle.x, paths[path].dots[i].prevHandle.y);

					if (paths[path].dots[i].nextHandle !== null) {
						ctx.moveTo( paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )
						ctx.lineTo(paths[path].dots[i].nextHandle.x, paths[path].dots[i].nextHandle.y);
						ctx.moveTo( paths[path].dots[i].mainHandle.x, paths[path].dots[i].mainHandle.y )
					}
				}

				ctx.stroke();
			}
		}

	}

	var addPath = function addPath(p) {
		paths[p.name] = {
			dots: [],
			name: p.name
		}
	}

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
				prevhandle: null,
				nextHandle: null
			}

		for (var i = 0; i < pathList.length; i++) {
			if (!!pathList[i].selected) {
				currentPathId = pathList[i].getAttribute('value');
				break;
			}
		}

		if (!paths[currentPathId]) return false;

		if ( paths[currentPathId].dots.length ) {
			preLastPathPoint = paths[currentPathId].dots[ paths[currentPathId].dots.length-1 ];
		}

		paths[currentPathId].dots.push(newPoint);
		lastPathPoint = paths[currentPathId].dots[ paths[currentPathId].dots.length-1 ];

		if (!!preLastPathPoint) {
			var addBezierPoint = getAdditionalBezierPointsCoords({
				x1: preLastPathPoint.mainHandle.x / scale,
				y1: preLastPathPoint.mainHandle.y / scale,
				x2: lastPathPoint.mainHandle.x / scale,
				y2: lastPathPoint.mainHandle.y / scale
			})


			tempPoint = document.createElement('div');
			tempPoint.className = 'debug__point-handle';
			tempPoint.style.top = addBezierPoint.ay1 + 'px';
			tempPoint.style.left = addBezierPoint.ax1 + 'px';
			preLastPathPoint.nextHandle = {
				dom: tempPoint
			}

			debugPanel.appendChild(tempPoint);

			tempPoint = document.createElement('div');
			tempPoint.className = 'debug__point-handle';
			tempPoint.style.top = addBezierPoint.ay2 + 'px';
			tempPoint.style.left = addBezierPoint.ax2 + 'px';
			lastPathPoint.prevHandle = {
				dom: tempPoint
			}

			debugPanel.appendChild(tempPoint);
		}

		var tempPoint = document.createElement('div');
		tempPoint.className = 'debug__point';
		tempPoint.style.top = p.y + 'px';
		tempPoint.style.left = p.x + 'px';
		lastPathPoint.mainHandle.dom = tempPoint;

		debugPanel.appendChild(tempPoint);

		dots = document.querySelectorAll('.debug__point');
		repaint = true;

	}

	return {
		init: function() {
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

	// var addButton = document.querySelector('.debug__button_add');

	debugPanel.addEventListener("mousedown", function(e) {
		if ( e.target.className == 'debug__point' ) {
			tempPoint.x = e.pageX;
			tempPoint.y = e.pageY;

			e.target.isDragged = true;
			currentTarget = e.target;
		}

		if ( e.target.className == 'debug__point-handle' ) {
			e.target.isDragged = true;
			currentTarget = e.target;
		}
	})

	debugPanel.addEventListener("mouseup", function(e) {
		if ( (e.target.className == 'debug__point') || (e.target.className == 'debug__point-handle') ) {
			e.target.isDragged = undefined;
			currentTarget = undefined;
		}
	})

	debugPanel.addEventListener("mousemove", function(e) {
		if (currentTarget !== undefined) {
			currentTarget.style.top = e.pageY + 'px';
			currentTarget.style.left = e.pageX + 'px';

			if (e.target.className == 'debug__point') {
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

			repaint = true;
		}
	})

	debugPanel.addEventListener("dblclick", function(e) {
		if (e.target.classList.contains('debug__point') ) {
			console.log('point dbl click');
		}

		if (e.target.classList.contains('debug__view') ) {

			debugTraect.addPoint({
				x: e.pageX,
				y: e.pageY
			})
		}
	})

	debugPanel.addEventListener("click", function(e) {
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
	})

	debugTraect
		.init();
})
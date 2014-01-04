var repaint = false,
	debugPanel,
	dots,
	canvas,
	ctx;

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

	var paint = function paint() {
		var scale = 510 / canvas.clientHeight;

		// Возвращает координаты точки на холсте,
		// взятые от координаты DOM-узла токи и нормированные на масштаб
		function getCoordsFromCss( dom ) {

			return {
				x: dom.style.left.replace('px', '') * scale,
				y: dom.style.top.replace('px', '') * scale
			}
		};

		// Вернуть позицию управляющих точек
		//p.x1
		//p.y1
		//p.x2
		//p.y2
/*		function getAdditionalBezierPointsCoords( p ) {
			var ap1 = 0.3,
				ap2 = 0.7;

			return {
				ax1: (p.x2 - p.x1) * ap1 + p.x1,
				ay1: (p.y2 - p.y1) * ap1 + p.y1,
				ax2: (p.x2 - p.x1) * ap2 + p.x1,
				ay2: (p.y2 - p.y1) * ap2 + p.y1
			}
		} */

		// Ощищаем холст
		ctx.clearRect(0,0,canvas.width,canvas.height);

		// Выводим линии
		// Перебираем текущие узлы и получаем их координаты.
		// Накладываем коэффициент масштабирования

		ctx.lineWidth = "3";
		ctx.beginPath();
		ctx.moveTo( getCoordsFromCss(dots[0]).x, getCoordsFromCss(dots[0]).y );

/*		var t = getAdditionalBezierPointsCoords({
			x1: getCoordsFromCss(dots[0]).x,
			y1: getCoordsFromCss(dots[0]).y,
			x2: getCoordsFromCss(dots[1]).x,
			y2: getCoordsFromCss(dots[1]).y
		});

		var d = document.createElement('div');
		d.style.position = 'absolute';
		d.style.width = '20px';
		d.style.height = '20px';
		d.style.marginLeft = '-10px';
		d.style.marginTop = '-10px';
		d.style.backgroundColor = 'black';
		d.style.top = t.ay1/scale + 'px';
		d.style.left = t.ax1/scale + 'px';
		debugPanel.appendChild(d);

		var d = document.createElement('div');
		d.style.position = 'absolute';
		d.style.width = '20px';
		d.style.height = '20px';
		d.style.marginLeft = '-10px';
		d.style.marginTop = '-10px';
		d.style.backgroundColor = 'black';
		d.style.top = t.ay2/scale + 'px';
		d.style.left = t.ax2/scale + 'px';
		debugPanel.appendChild(d); */

		for (var i = 1; i < dots.length; i++) {
			ctx.lineTo( getCoordsFromCss(dots[i]).x, getCoordsFromCss(dots[i]).y  )
		}

		ctx.stroke();


	}

	return {
		init: function() {
			render();

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
	canvas = document.getElementById('debug__view');
	dots = document.querySelectorAll('.debug__point');
	ctx = canvas.getContext('2d');

	debugPanel.addEventListener("mousedown", function(e) {
		if (e.target.className == 'debug__point') {
			e.target.isDragged = true;
			currentTarget = e.target;
		}
	})

	debugPanel.addEventListener("mouseup", function(e) {
		if (e.target.className == 'debug__point') {
			e.target.isDragged = undefined;
			currentTarget = undefined;
		}
	})

	debugPanel.addEventListener("mousemove", function(e) {
		if (currentTarget !== undefined) {
			currentTarget.style.top = e.pageY + 'px';
			currentTarget.style.left = e.pageX + 'px';

			repaint = true;
		}
	})

	debugPanel.addEventListener("dblclick", function(e) {
		if (e.target.className == 'debug__point') {
			console.log('click');
		}
	})

	debugTraect
		.init();
})
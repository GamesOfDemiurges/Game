var scene = function scene() {

	/* Private */
	var stage, // сцена
		renderer, // оператор рендеринга
		masterCanvas, // Физический канвас на вьюпорте
		playGround,
		x = 0, y = 0; // точки отсчета для сцены

	// Обертка над оператором рендера PIXI
	var repaintCanvas = function repaintCanvas() {
		requestAnimFrame(repaintCanvas);
		renderer.render(stage);
	}

	/* Public */

	return {

		// Инициализация сцены
		// Передается селектор физического канваса

		// p.canvasSelector
		init: function ( p ) {
			masterCanvas = document.getElementById(p.canvasId); // указатель на DOM
			stage = new PIXI.Stage(0xFFFFFF, true); // Корневая сцена

			renderer = new PIXI.CanvasRenderer(510/masterCanvas.clientHeight*masterCanvas.clientWidth, 510, masterCanvas, false); // Оператор рендеринга 900x510 native
			window.onresize = function () {
				renderer.resize(510/masterCanvas.clientHeight*masterCanvas.clientWidth, 510);
			}

			// Контейнер сцены
			// его будем двигать для смещения сцены относительно вьюпорта
			playGround = new PIXI.DisplayObjectContainer();
			playGround.position.x = x;
			playGround.position.y = y;

			// Добавили контейнер
			stage.addChild( playGround );

			// Запустили перерисовку холста
			repaintCanvas();

			return this;
		},

		// На сцену в произвольный момент может быть добавлен один из существующих объектов
		// p.image
		addObj: function ( p ) {
			var _this = this;

			var newObj = obj().create( p );
			playGround.addChild( newObj.image );

			return _this;
		},

		// Смещение сцены (не путать со смещением объекта)
		// p.dx
		// p.dy
		move: function ( p ) {

		}
	}
}();

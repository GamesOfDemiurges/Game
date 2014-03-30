var scene = function scene() {

	/* Private */
	var stage, // сцена
		renderer, // оператор рендеринга
		masterCanvas, // Физический канвас на вьюпорте
		playGround,
		x = 0, y = 0; // точки отсчета для сцены

	function repaintCanvas() {
		if (Z.zchange) {
			Z.drawZindex(playGround);
		}

		requestAnimFrame(repaintCanvas);
		renderer.render(stage);
	}

	/* Public */

	return {

		// Инициализация сцены
		// Передается селектор физического канваса

		// p.canvasSelector
		init: function ( p ) {
			var _this = this;

			// Обертка над оператором рендера PIXI
			masterCanvas = document.getElementById(p.canvasId); // указатель на DOM
			stage = new PIXI.Stage(0xFFFFFF, true); // Корневая сцена

			_this.scale = 800/masterCanvas.clientHeight;
			_this.width = _this.scale * masterCanvas.clientWidth;

			renderer = new PIXI.CanvasRenderer(_this.width, 800, masterCanvas, false);
			window.addEventListener('resize', function() {
				_this.scale = 800/masterCanvas.clientHeight;
				_this.width = _this.scale * masterCanvas.clientWidth;

				renderer.resize(_this.width, 800);
			})

			// Контейнер сцены
			// его будем двигать для смещения сцены относительно вьюпорта
			var playGround = new PIXI.DisplayObjectContainer();
			playGround.position.x = x;
			playGround.position.y = y;

			// Добавили контейнер
			stage.addChild( playGround );

			// Запустили перерисовку холста
			repaintCanvas();

			_this.stage = stage;
			_this.playGround = playGround;
			_this.zindex = Z.zindex;

			return _this;
		},

		// На сцену в произвольный момент может быть добавлен один из существующих объектов
		// p.image
		addObj: function ( p ) {
			var _this = this;

			Z.addZindex( p );

			return _this;
		},

		// Смещение сцены (не путать со смещением объекта)
		// p.dx
		// p.dy
		move: function ( p ) {
			var _this = this;

			_this.playGround.position.x -= (p.dx || 0);
			_this.playGround.position.y -= (p.dy || 0);

			if (debug) {
				document.querySelector('.debug__wrap').scrollLeft = ( (_this.playGround.position.x -= (p.dx || 0)) / globals.scale * (-1));
			}

			return _this;
		}
	}
}();

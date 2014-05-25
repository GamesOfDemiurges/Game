/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

/**
 * Класс ИИ
 *
 * @class ai
 */
function ai() {

	// Матрица вероятностей перехода из одного состояния в другое.
	// Суммарная вероятность отнормирована по 10
	// yes — факт нахождения героя в поле зрения ИИ
	// no — ИИ не видит героя
	// Состояния:
	// 1 — стоит на месте
	// 2 — разворачивается на месте
	// 3 — перемещается в точку
	// 4 — анимируется на месте
	// 5 — оценивает расстояние до героя
	var probMatrix = [
		[
			{yes: 1, no: 1},
			{yes: 3, no: 2},
			{yes: 2, no: 2},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 2, no: 4},
			{yes: 0, no: 0},
			{yes: 4, no: 1},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 1, no: 3},
			{yes: 2, no: 1},
			{yes: 1, no: 1},
			{yes: 5, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 1, no: 2},
			{yes: 3, no: 1},
			{yes: 2, no: 2},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 3, no: 5},
			{yes: 2, no: 1},
			{yes: 3, no: 2},
			{yes: 2, no: 2},
			{yes: 0, no: 0}
		]
	],
	obj, // Объект-родитель экземпляра класса
	moveAnimation, // Поле для значения анимации, проигрываемой при движении
	stayAnimation, // Поле для значения анимации, проигрываемой при стоянии на месте
	availablesPaths, // Путь, доступный для перемещения ИИ
	lookDistance, // Расстояние, на котором ИИ замечает героя
	stayTime, // Максимальное время, в течение которого ИИ может неподвижно стоять на месте
	currentState, // Текущее состояние ИИ
	heroIsVisible = false, // Факт видимости героя
	stop = false; // Факт прекращения работы ИИ

	/**
	 * Состояние нахождения на месте
	 *
	 * @method stayOnPlace
	 * @private
	 */
	function stayOnPlace() {
		currentState = 0;

		setTimeout(function () {
			processAction();
		}, utils.getRandomValue(stayTime) );
	}

	/**
	 * Состояние разворота на месте
	 *
	 * @method rotateObject
	 * @private
	 */
	function rotateObject() {
		currentState = 1;

		obj.image.scale.x *= -1;

		processAction();
	}

	/**
	 * Состояние перемещения в точку
	 *
	 * @method moveToPoint
	 * @private
	 */
	function moveToPoint() {
		currentState = 2;

		if (moveAnimation && availablesPaths) {

			var targetChain =  utils.getRandomValue(globals.paths[availablesPaths].controlPath.length-1);

			obj.moveTo({
				path: availablesPaths,
				chain: targetChain,
				animationName: moveAnimation,
				callback: function () {
					processAction();
				}
			});

		} else {
			processAction();
		}
	}

	/**
	 * Состояние воспроизведения анимации на месте
	 *
	 * @method playAnimation
	 * @private
	 */
	function playAnimation() {
		currentState = 3;

		if (stayAnimation) {
			obj.animate({
				animation: stayAnimation,
				callback: function () {
					processAction();
				}
			});
		} else {
			processAction();
		}
	}

	/**
	 * Состояние оценки расстояния до героя
	 *
	 * @method lookAround
	 * @private
	 */
	function lookAround() {

		currentState = 4;

		if (utils.getDistance({
			x1: obj.image.position.x,
			x2: globals.objects.hero.image.position.x,
			y1: obj.image.position.y,
			y2: globals.objects.hero.image.position.y
		}) < lookDistance) {
			heroIsVisible = true;
		} else {
			heroIsVisible = false;
		}

		processAction();
	}

	/**
	 * Менеджер состояний
	 *
	 * @method processAction
	 * @private
	 */
	function processAction() {
		if (stop) { return; }

		var prob = utils.getRandomValue(10),
			sum = 0,
			isVisible = heroIsVisible
				? 'yes'
				: 'no',
			i;

		for (i = 0; i < 4; i++) {
			sum += probMatrix[currentState][i][isVisible];

			if (sum >= prob) { break; }
		}

		switch (i) {

			case 0:
				stayOnPlace();
				break;

			case 1:
				rotateObject();
				break;

			case 2:
				moveToPoint();
				break;

			case 3:
				playAnimation();
				break;

			default:
				lookAround();
		}

	}

	/**
	 * Инициализирует экземпляр
	 *
	 * @method initParams
	 * @private
	 * @param p {Object}
	 * @param p.probMatrix {Object} матрица вероятностей состояний
	 * @param p.moveAnimation {String} название анимации, проигрываемой при движении
	 * @param p.stayAnimaton {String} название анимации, проигрываемой при нахождении на месте
	 * @param p.availablesPaths {String} доступная для движения траектория
	 * @param p.lookDistance {Integer} расстояние, на котором ИИ видит героя
	 * @param p.stayTime {Integer} максимальное время, которое ИИ может стоять на месте без движения
	 * @param p.obj {Object} объкт, к которому принадлежит ИИ
	 */
	function initParams( p ) {

		probMatrix = p.probMatrix || probMatrix;
		moveAnimation = p.moveAnimation || false;
		stayAnimation = p.stayAnimation || false;
		availablesPaths = p.availablesPaths || false;
		lookDistance = p.lookDistance || 300;
		stayTime = p.stayTime || 3000;
		obj = p.obj;
	}

	return {

		/**
		 * Конструктор экземпляра ИИ
		 *
		 * @method init
		 * @public
		 * @param p {Object}
		 * @param p.probMatrix {Object} матрица вероятностей состояний
		 * @param p.moveAnimation {String} название анимации, проигрываемой при движении
		 * @param p.stayAnimaton {String} название анимации, проигрываемой при нахождении на месте
		 * @param p.availablesPaths {String} доступная для движения траектория
		 * @param p.lookDistance {Integer} расстояние, на котором ИИ видит героя
		 * @param p.stayTime {Integer} максимальное время, которое ИИ может стоять на месте без движения
		 * @param p.obj {Object} объкт, к которому принадлежит ИИ
		 * @returns ai
		 */
		init: function ( p ) {

			initParams( p );

			return this;
		},

		/**
		 * Запуск работы ИИ
		 *
		 * @method play
		 * @public
		 * @returns ai
		 */
		start: function () {
			stop = false;
			currentState = 4;
			processAction();

			return this;
		},

		/**
		 * Остановка работы ИИ
		 *
		 * @method stop
		 * @public
		 * @returns ai
		 */
		stop: function () {
			stop = true;

			return this;
		}
	};
}
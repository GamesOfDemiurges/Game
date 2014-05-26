/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

/**
 * Класс игрового объекта
 *
 * @class obj
 */
function obj() {

	var x = -9999, // координаты на сцене
		y = -9999,
		z = 1, // слой
		pz = 1, // приоритет объекта на слое
		step = null, // текущий шаг объекта на пути
		path = null; // текущий путь объекта

	return {

		/**
		 * Конструктор объекта
		 *
		 * @constructor
		 * @param p {Object}
		 * @param p.name {String} имя объекта
		 * @param p.src {String} источник модели объекта
		 * @param p.x {Number} координаты на плоскости
		 * @param p.y {Number}
		 * @param p.z {Number} слой
		 * @param p.pz {Number} приоритет слоя
		 * @param p.step {number} шаг на траектории
		 * @param p.path {String} идентификатор траектории
		 * @param p.scale {Number} масштаб модели
		 * @param p.reverse {Boolean} факт прямого/обратного направления
		 * @param p.animation {Object} набор анимаций и связанных данных
		 * @param p.interactive {Boolean} факт возможности пользовательского взаимодействия с объектом
		 * @param p.ai {Object} данные экземпляра ИИ
		 * @param p.ai.probMatrix {Array} вероятностная матрица состояний
		 * @param p.ai.moveAnimation {String} анимация при движении
		 * @param p.ai.stayAnimation {String} анимация при нахождении на месте
		 * @param p.ai.availablesPaths {String} доступные пути для перемещения
		 * @param p.ai.lookDistance {Number} расстояние, на котором объект замечает главного героя
		 * @returns obj
		 */
		create: function ( p ) {
			var _this = this,
				id;

			if (p.src === undefined) { return false; }

			// расположение на сцене
			function setObjectPosition() {
				_this.image.position.x = (p.x !== undefined) ? p.x : x;
				_this.image.position.y = (p.y !== undefined) ? p.y : y;
				_this.z = (p.z !== undefined) ? p.z : z;
				_this.pz = (p.pz !== undefined) ? p.pz : pz;

				// Если объект расположен на траектории, нет необходимости явно задавать его координаты
				_this.step = (p.step !== undefined) ? p.step : step;
				_this.path = (p.path !== undefined) ? p.path : path;

				if ( (_this.step !== null) && (_this.path !== null) ) {
					if ( (p.x === undefined) || (p.y === undefined) ) {
						_this.image.position.x = globals.paths[ _this.path ].steps[ _this.step ].x;
						_this.image.position.y = globals.paths[ _this.path ].steps[ _this.step ].y;
					}
				}
			}

			// Задание масштаба
			function setObjectScale() {
				_this.image.scale.x = _this.image.scale.y = (p.scale !== undefined)
					? p.scale
					: 1;
			}

			// Разворот объекта
			function setReverse() {
				if (p.reverse) {
					_this.image.scale.x *= -1;
				}
			}

			// Генерация идентификатора, если не задан
			function generateRandomObjectId() {
				var objectId = Math.random().toString();

				if ( globals.objects[objectId] !== undefined) {
					objectId = generateRandomObjectId();
				}

				return objectId;
			}

			// Анимации и связанные мультимедиа-события
			function setAnimation() {
				var animationName;

				if (p.animation) {
					_this.animation = {};

					for (animationName in p.animation) {
						_this.animation[animationName] = {};

						if (p.animation[animationName].soundSrc) {

							_this.animation[animationName].track = track().load({
								obj: _this,
								url: p.animation[animationName].soundSrc
							});
						}
					}
				}
			}

			// Обработка событий взаимодействия пользователя с объектом
			function setInteractive() {
				if (p.interactive) {
					_this.image.setInteractive(true);

					_this.image.click = _this.image.tap = function () {
						if (globals.viewport.resize) { return false; }

						globals.objectClicked = true;

						relay.drop({
							obj: _this.id,
							type: 'objectClick'
						});
					};

					_this.image.mouseover = function () {

						document.body.className += ' _cursor';
					};

					_this.image.mouseout = function () {
						document.body.className = document.body.className.replace(/\s_cursor/ig, '');
					};
				}
			}

			// обпределение экземпляра класса ИИ для объекта
			function setAI() {
				if (p.ai) {

					_this.ai = ai().init({

						probMatrix: p.ai.probMatrix,
						moveAnimation: p.ai.moveAnimation,
						stayAnimation: p.ai.stayAnimation,
						availablesPaths: p.ai.availablesPaths,
						lookDistance: p.ai.lookDistance,
						obj: _this
					});
				}

			}

			if (p.src.indexOf('.anim') !== -1) {

				id = p.name || generateRandomObjectId();

				_this.type = 'spine';
				_this.src = p.src;
				_this.image = new PIXI.Spine( p.src );
				_this.id = id;
				//_this.image.state.setAnimationByName("stop", false); // STOP

				globals.objects[ id ] = _this;

				relay.drop({
					obj: id,
					type: 'objectAdded'
				});

			} else {
				_this.type = 'image';
				_this.src = p.src;
				_this.image = new PIXI.Sprite.fromImage( p.src );
			}

			setObjectPosition();
			setObjectScale();
			setReverse();
			setAnimation();
			setInteractive();
			setAI();

			return _this;
		},

		/**
		 * Перемещает объект в пространстве
		 * Скорость движения будет зависеть от текущей анимации
		 *
		 * @method move
		 * @public
		 * @param p {Object}
		 * @param p.x
		 * @param p.y
		 * @param p.z
		 * @returns obj
		 */
		move: function ( p ) {
			var _this = this,
				dx,
				screenHalfWidth,
				screenHalfHeight,
				dx1, dy1;

			if (p.y !== undefined) {
				_this.image.position.y = p.y;
			}

			if (p.x !== undefined) {
				dx = p.x - _this.image.position.x;

				// Идем назад
				if ( dx < 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if ( (_this.image.state.current.name !== 'stairCaseWalk' && _this.id !== 'tree') && (_this.image.scale.x > 0) ) {
						_this.image.scale.x *= -1;
					}
				}

				// Идем вперед
				if ( dx > 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if ( (_this.image.state.current.name !== 'stairCaseWalk') && (_this.image.scale.x < 0) )  {
						_this.image.scale.x *= -1;
					}
				}

				_this.image.position.x = p.x;

				if ( _this.id === 'hero' ) {

					screenHalfWidth = scene.width / 2 / globals.viewport.scale;
					screenHalfHeight = scene.height / 2 / globals.viewport.scale;
					dx1 = (_this.image.position.x - screenHalfWidth ) * globals.viewport.scale;
					dy1 = (_this.image.position.y - (50/globals.scale) - screenHalfHeight ) * globals.viewport.scale;

					scene.move({
						dx: (-dx1),
						dy: (-dy1)
					});

				}

			}

			if (p.z !== undefined) {
				Z.changeZindex({
					obj: _this,
					z: p.z
				});
			}

			return _this;
		},

		/**
		 * Обертка для пермещения объекта в заданную точку траектории
		 *
		 * @method moveTo
		 * @public
		 * @param p {Object}
		 * @param p.path {String} идентификатор траектории
		 * @param p.chain {Number} целевое звено
		 * @param p.animationName {String} проигрываемая при движении анимация
		 * @param p.speedValue {Number} скорость перемещения
		 * @param p.callback {Function} выполнится по завершении
		 * @returns obj
		 */
		moveTo: function ( p ) {
			var _this = this;

			pathfinder.moveObjectByChain({
				id: _this.id,
				path: p.path,
				chain: p.chain,
				animationName: p.animationName,
				speedValue: p.speedValue,
				callback: p.callback
			});

			return _this;
		},

		/**
		 * Воспроизводит анимации объекта без перемещения его в пространстве
		 *
		 * @method animate
		 * @public
		 * @param p {Object}
		 * @param p.animation {String} идентификатор анимации
		 * @param p.callback {Function} выполнится по завершении
		 * @returns obj
		 */
		animate: function ( p ) {
			var _this = this,
				callback = p.callback || function () {},
				duration,
				animationId;

			_this.image.state.setAnimationByName( p.animation , false);

			if (_this.animation && _this.animation[p.animation]) {
				_this.animation[p.animation].track.play();
			}

			duration = _this.image.state.current.duration * 1000;
			animationId = Math.random();

			setTimeout(function () {
				callback();

				relay.drop({
					obj: _this,
					type: 'endAnimation',
					animation: p.animation,
					id: animationId
				});
			}, duration);

			relay.drop({
				obj: _this,
				type: 'startAnimation',
				animation: p.animation,
				id: animationId
			});

			return _this;
		},

		/**
		 * Возвращает информацию о нахождении объекта
		 *
		 * @method getPosition
		 * @public
		 * @returns {Object}
		 */
		getPosition: function () {

			var _this = this,
				path = _this.path,
				chain,
				graphId,
				orientation = Math.abs(_this.image.scale.x)/_this.image.scale.x,
				i;

			for (i = 0; i < globals.paths[ _this.path ].controlPath.length; i++) {

				if ( Math.abs(globals.paths[ _this.path ].controlPath[i].step - _this.step) < 10 ) {

					chain = i;
					break;
				}

			}

			if ( _this.step < 10 ) {
				graphId = globals.paths[ path ].dots[0].graphId;
			}

			if ( Math.abs(globals.paths[ path ].steps.length - _this.step) < 10 ) {
				graphId = globals.paths[ path ].dots[ globals.paths[ path ].dots.length-1 ].graphId;
			}

			return {
				path: path,
				chain: chain,
				graphId: graphId,
				orientation: orientation
			};

		}
	};
}
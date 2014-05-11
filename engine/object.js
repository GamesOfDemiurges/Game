function obj() {

	/* Private */
	var animations = {},
		x = -9999,
		y = -9999,
		z = 1,
		pz = 1,
		step = null,
		path = null;
	/* Public */

	return {

		// Создает объект из заданного ресурса
		// в заданную точку (необязательно)
		// с заданной анимацией (необязательно)

		// p.image
		// p.x
		// p.y
		// p.z
		// p.animation
		create: function ( p ) {
			var _this = this;
			if (p.src === undefined) return false;

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

			function setObjectScale() {
				_this.image.scale.x = _this.image.scale.y = (p.scale !== undefined) ? p.scale : 1
			}

			function setReverse() {
				if (p.reverse) {
					_this.image.scale.x *= -1;
					//_this.image.position.x = centerX - _this.image.scale.x * containerWidth / 2;
				}
			}

			function generateRandomObjectId() {
				var objectId = Math.random().toString();
				if ( globals.objects[objectId] !== undefined) {
					return generateRandomObjectId();
				} else {
					return objectId;
				}
			}

			function setAnimation() {
				if (p.animation) {
					_this.animation = {};

					for (var animationName in p.animation) {
						_this.animation[animationName] = {};

						if (p.animation[animationName].soundSrc) {

							_this.animation[animationName].track = track().load({
								obj: _this,
								url: p.animation[animationName].soundSrc
							})
						}
					}
				}
			}

			function setInteractive() {
				if (p.interactive) {
					_this.image.setInteractive(true);

					_this.image.click = _this.image.tap = function(data) {
						if (globals.viewport.resize) return false;

						globals.objectClicked = true;

						relay.drop({
							obj: _this.id,
							type: 'objectClick'
						});
					}
				}
			}

			if (p.src.indexOf('.anim') !== -1) {

				var id = p.name
					? p.name
					: generateRandomObjectId();

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

			return _this;
		},

		// Двигает объект по горизонтали/вертикали, коэффициенту удаления
		// На первом этапе принимаем, что коэффициент удаления не оказывает влияния
		// на скорость движения и размер (перспективу), а только лишь на порядок отрисовки
		// аналог z-index

		// Скорость движения будет зависеть от текущей анимации

		// p.x
		// p.y
		// p.z
		move: function ( p ) {
			var _this = this;

			if (p.y !== undefined) {
				_this.image.position.y = p.y;
			}

			if (p.x !== undefined) {
				var dx = p.x - _this.image.position.x;

				// Идем назад
				if ( dx < 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if ( (_this.image.state.current.name != 'stairCaseWalk') && (_this.image.scale.x > 0) ) {
						_this.image.scale.x *= -1;
					}
				}

				// Идем вперед
				if ( dx > 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if ( (_this.image.state.current.name != 'stairCaseWalk') && (_this.image.scale.x < 0) )  {
						_this.image.scale.x *= -1;
					}
				}

				_this.image.position.x = p.x;

				if ( _this.id == 'hero' ) {

					var screenHalfWidth = scene.width / 2 / globals.viewport.scale,
						screenHalfHeight = scene.height / 2 / globals.viewport.scale,
						dx1 = (_this.image.position.x - screenHalfWidth ) * globals.viewport.scale,
						dy1 = (_this.image.position.y - (50/globals.scale) - screenHalfHeight ) * globals.viewport.scale;

					scene.move({
						dx: (0-dx1),
						dy: (0-dy1)
					})

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

		moveTo: function( p ) {
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

		//p.animation
		animate: function( p ) {
			var _this = this,
				callback = p.callback || function() {};

			_this.image.state.setAnimationByName( p.animation , false);

			if (_this.animation && _this.animation[p.animation]) {
				_this.animation[p.animation].track.play();
			}

			var duration = _this.image.state.current.duration * 1000,
				animationId = Math.random();

			setTimeout(function() {
				callback();

				relay.drop({
					obj: _this,
					type: 'endAnimation',
					animation: p.animation,
					id: animationId
				});
			}, duration)

			relay.drop({
				obj: _this,
				type: 'startAnimation',
				animation: p.animation,
				id: animationId
			});

			return _this;
		}
	}
}
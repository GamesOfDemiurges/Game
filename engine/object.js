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

				_this.step = (p.step !== undefined) ? p.step : step;
				_this.path = (p.path !== undefined) ? p.path : path;
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

			if (p.src.indexOf('.anim') !== -1) {

				var id = p.name
					? p.name
					: generateRandomObjectId();

				_this.type = 'spine';
				_this.src = p.src;
				_this.image = new PIXI.Spine( p.src );
				_this.id = id;
				_this.image.state.setAnimationByName("stop", false);

				globals.objects[ id ] = _this;

				/*if (_this.animated) {
					var animations = _this.image.state.data.skeletonData.animations;
					_this.image.state.setAnimationByName( animations[animations.length-1].name , true);
				}*/

				/*if (_this.image.state.data.skeletonData.skins.length > 1) {
					_this.image.skeleton.setSkinByName("goblin");
					_this.image.skeleton.setSlotsToSetupPose();
				}*/
			} else {
				_this.type = 'image';
				_this.src = p.src;
				_this.image = new PIXI.Sprite.fromImage( p.src );
			}

			setObjectPosition();
			setObjectScale();
			setReverse();

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

			if (p.x !== undefined) {
				var dx = p.x - _this.image.position.x

				// Идем назад
				if ( dx < 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if (_this.image.scale.x > 0 ) {
						_this.image.scale.x *= -1;
					}
				}

				// Идем вперед
				if ( dx > 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if (_this.image.scale.x < 0)  {
						_this.image.scale.x *= -1;
					}
				}

				_this.image.position.x = p.x;

				if ( (_this.id == 'hero') && ((Math.abs(_this.image.position.x - scene.playGround.position.x)) > scene.width/2) ) {

					if (scene.playGround.position.x > -2150  ) { // TODO: Clean
						scene.playGround.position.x = scene.width/2 - _this.image.position.x;

						scene.move({
							dx: dx /2
						})
					}
				}
			}

			if (p.y !== undefined) {
				_this.image.position.y = p.y;
			}

			if (p.z !== undefined) {
				Z.changeZindex({
					obj: _this,
					z: p.z
				});
			}

			return _this;
		},

		//p.animation
		animate: function( p ) {
			var _this = this;

			_this.image.state.setAnimationByName( p.animation , false);
			var duration = _this.image.state.current.duration * 1000,
				animationId = Math.random();

			setTimeout(function() {
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
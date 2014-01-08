function obj() {

	/* Private */
	var animations = {},
		x = -9999,
		y = -9999,
		z = 1,
		pz = 1;

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

			function setHero() {
				_this.hero = p.hero || false;
			}

			if (p.src.indexOf('.anim') !== -1) { //console.log('anim');
				_this.type = 'spine';
				_this.src = p.src;
				_this.image = new PIXI.Spine( p.src );
				_this.animated = p.animated || false;

				if (_this.animated) {
					var animations = _this.image.state.data.skeletonData.animations;
					_this.image.state.setAnimationByName( animations[animations.length-1].name , true);
				}

				if (_this.image.state.data.skeletonData.skins.length > 1) {
					_this.image.skeleton.setSkinByName("goblin");
					_this.image.skeleton.setSlotsToSetupPose();
				}
			} else { //console.log('image');
				_this.type = 'image';
				_this.src = p.src;
				_this.image = new PIXI.Sprite.fromImage( p.src );
			}

			setObjectPosition();
			setObjectScale();
			setReverse();
			setHero();

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

				if ( (_this.hero) && ((Math.abs(_this.image.position.x - scene.playGround.position.x)) > scene.width/2) ) {
					scene.move({
						dx: _this.image.position.x + scene.playGround.position.x - scene.width/2
					})
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
		}
	}
}
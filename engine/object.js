function obj() {

	/* Private */
	var animations = {},
		x = -9999,
		y = -9999,
		z = 1;

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
			if (typeof p.image === undefined) return false;

			var setObjectPosition = function setObjectPosition( ) {
				_this.image.position.x = (typeof p.x !== undefined) ? p.x : x;
				_this.image.position.y = (typeof p.y !== undefined) ? p.y : y;
			}

			if (p.image.indexOf('.anim') !== -1) { console.log('anim');
				_this.type = 'spine';
				_this.image = new PIXI.Spine( p.image );

				_this.image.state.setAnimationByName("walk", true);
			} else { console.log('image');
				_this.type = 'image';
				_this.image = new PIXI.Sprite.fromImage( p.image );
			}

			setObjectPosition();

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

		}
	}
}
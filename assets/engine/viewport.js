/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var viewport = (function () {
	var magicYHeroShift = 0;


	function viewportInitScale( p ) {
		globals.viewport.resize = true;
		globals.viewport.distance = Math.sqrt( ( p.x1 - p.x2 )*( p.x1 - p.x2 ) + ( p.y1 - p.y2 )*( p.y1 - p.y2 ) );

		globals.viewport.sceneX = scene.playGround.position.x - globals.objects.hero.image.position.x * (1 - globals.viewport.scale);
		globals.viewport.sceneY = scene.playGround.position.y - (globals.objects.hero.image.position.y + magicYHeroShift) * (1 - globals.viewport.scale);
	}

	function viewportProcessScale( p ) {
		var newDistance = Math.sqrt( ( p.x1 - p.x2 )*( p.x1 - p.x2 ) + ( p.y1 - p.y2 )*( p.y1 - p.y2 ) ),
			k = globals.viewport.scale * (newDistance / globals.viewport.distance),
			x, y, rx, ry, maxYShift, maxXShift;

		// не обрабатывать, если масштаб меньше 1
		if (k < 1) {
			globals.viewport.scale = 1;
			return false;
		}

		if (k > 2.5) {
			globals.viewport.scale = 2.5;
			return false;
		}

		x = (globals.objects.hero.image.position.x) * (1-k);
		y = (globals.objects.hero.image.position.y + magicYHeroShift) * (1-k);
		rx = globals.viewport.sceneX + x;
		ry = globals.viewport.sceneY + y;
		maxYShift = (scene.height / globals.scale - (scene.height / globals.scale) * k ) * globals.scale;
		maxXShift = (scene.width / globals.scale - (globals.sceneWidth / globals.scale) * k ) * globals.scale;

		rx = rx < maxXShift
			? maxXShift
			: rx;

		rx = (rx > 0)
			? 0
			: rx;

		ry = ry < maxYShift
			? maxYShift
			: ry;

		ry = (ry > 0)
			? 0
			: ry;

		scene.playGround.scale = {
			x: k,
			y: k
		};

		scene.playGround.position.x = rx;
		scene.playGround.position.y = ry;

		globals.viewport.x = x;
		globals.viewport.y = y;
	}

	function viewportSaveScale() {
		setTimeout(function () {
			globals.viewport.resize = false;
		}, 100);

		globals.viewport.scale = scene.playGround.scale.x;
	}

	function attachEvents() {

		if (document.ontouchend !== undefined) {

			window.addEventListener('touchstart', function (e) {
				e.preventDefault();

				if (e.touches.length > 1) {
					viewportInitScale({
						x1: e.touches[0].pageX,
						x2: e.touches[1].pageX,
						y1: e.touches[0].pageY,
						y2: e.touches[1].pageY
					});
				}
			});

			window.addEventListener('touchmove', function (e) {
				if ( (globals.viewport.resize) && (e.touches.length > 1) ) {
					viewportProcessScale({
						x1: e.touches[0].pageX,
						x2: e.touches[1].pageX,
						y1: e.touches[0].pageY,
						y2: e.touches[1].pageY
					});
				}
			});

			window.addEventListener('touchend', function () {
				if ( globals.viewport.resize ) {
					viewportSaveScale();
				}
			});

		} else {

			window.addEventListener('mousedown', function (e) {
				if (e.altKey) {
					viewportInitScale({
						x1: e.pageX,
						x2: 0,
						y1: e.pageY,
						y2: 0
					});
				}
			});

			window.addEventListener('mousemove', function (e) {
				if (globals.viewport.resize) {
					viewportProcessScale({
						x1: e.pageX,
						x2: 0,
						y1: e.pageY,
						y2: 0
					});
				}
			});

			window.addEventListener('mouseup', function () {
				if (globals.viewport.resize) {
					viewportSaveScale();
				}
			});

		}
	}

	return {

		init: function () {
			attachEvents();
		}
	};

}());
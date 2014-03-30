var viewport = (function() {

	function viewportInitScale( p ) {
		globals.viewport.resize = true;
		globals.viewport.distance = Math.sqrt( ( p.x1 - p.x2 )*( p.x1 - p.x2 ) + ( p.y1 - p.y2 )*( p.y1 - p.y2 ) );
	}

	function viewportProcessScale( p ) {
		var newDistance = Math.sqrt( ( p.x1 - p.x2 )*( p.x1 - p.x2 ) + ( p.y1 - p.y2 )*( p.y1 - p.y2 ) ),
			k = globals.viewport.scale * (newDistance / globals.viewport.distance);

		// не обрабатывать, если масштаб меньше 1
		if (k < 1) {
			globals.viewport.scale = 1;
			return false;
		}

		var x = (globals.objects['hero'].image.position.x) * (1-k),
			y = (globals.objects['hero'].image.position.y - 150) * (1-k); // Magic number

		scene.playGround.scale = {
			x: k,
			y: k
		};

		scene.playGround.position.x = x;
		scene.playGround.position.y = y;
	}

	function viewportSaveScale() {
		setTimeout(function() {
			globals.viewport.resize = false;
		}, 100)

		globals.viewport.scale = scene.playGround.scale.x;
	}

	function attachEvents() {

		if ('ontouchend' in document) {

			window.addEventListener('touchstart', function(e) {
				e.preventDefault();

				if (e.touches.length > 1) {
					viewportInitScale({
						x1: e.touches[0].pageX,
						x2: e.touches[1].pageX,
						y1: e.touches[0].pageY,
						y2: e.touches[1].pageY
					})
				}
			})

			window.addEventListener('touchmove', function(e) {
				if ( (globals.viewport.resize) && (e.touches.length > 1) ) {
					viewportProcessScale({
						x1: e.touches[0].pageX,
						x2: e.touches[1].pageX,
						y1: e.touches[0].pageY,
						y2: e.touches[1].pageY
					})
				}
			})

			window.addEventListener('touchend', function(e) {
				if ( globals.viewport.resize ) {
					viewportSaveScale();
				}
			})

		} else {

			window.addEventListener('mousedown', function(e) {
				if (e.altKey) {
					viewportInitScale({
						x1: e.pageX,
						x2: 0,
						y1: e.pageY,
						y2: 0
					})
				}
			})

			window.addEventListener('mousemove', function(e) {
				if (globals.viewport.resize) {
					viewportProcessScale({
						x1: e.pageX,
						x2: 0,
						y1: e.pageY,
						y2: 0
					})
				}
			})

			window.addEventListener('mouseup', function(e) {
				if (globals.viewport.resize) {
				 viewportSaveScale()
				}
			})

		}
	}

	return {

		init: function() {
			attachEvents();
		}
	}

})()
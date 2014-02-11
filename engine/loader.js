var loader = (function() {

	// Предзагрузка ресурсов
	function init( p ) {
		var assetsLoader = new PIXI.AssetLoader(p.resources),
			callback = p.callback || function() {};

		assetsLoader.onComplete = function() {
			callback();
		}

		assetsLoader.load();
	}

	// Извлечение сохраненных путей из файла
	function readTraectFromFile ( p ) {
		var readTraect = new XMLHttpRequest,
			callback = p.callback || function() {};

		readTraect.open("GET", '/tools/traect.json?' + new Date().getTime());
		readTraect.onreadystatechange = function() {

			if (readTraect.readyState==4) {
				globals.paths = JSON.parse(readTraect.responseText);

				// Построить траектории
				utils.processPaths({
					callback: function() {

						// Построить граф
						graph.buildGraph({
							callback: function() {
								callback();
								pathfinder.start();
							}
						});

					}
				});

			}
		};

		readTraect.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		readTraect.send(null);
	}

	return {

		init: function( p ) {
			var callback = p.callback || function() {};

			// предзагрузить ресурсы
			init({
				resources: p.resources,
				callback: function() {

					if (!debug) {
						document.body.classList.add('_noscroll');
					}

					globals.scale = 510 / document.body.clientHeight;

					// загрузить траектории
					readTraectFromFile({
						callback: callback
					})
				}
			})
		}
	}

})();

document.addEventListener("DOMContentLoaded", function() {
	loader.init({
		resources: [
			"assets/models/hero/images/hero_final.json",
			"assets/models/hero/images/hero_final.anim",

			"assets/background/lvl1_1.png"
		],
		callback: function() {

			var currentPath = globals.paths['0.29949478153139353'];

			var background = obj().create({
				src: 'assets/background/lvl1_1.png',
				x: 0,
				y: 0,
				z: 5
			});

			globals.hero = obj().create({
				src: 'assets/models/hero/images/hero_final.anim',
				x: currentPath.steps[0].x,
				y: currentPath.steps[0].y,
				z: 15,
				scale: 0.5,
				hero: true,
				step: 0,
				path: currentPath.name
			});

			//globals.hero.image.state.clearAnimation();

			scene
				.init({
					canvasId: 'view'
				})
				.addObj(background)
				.addObj(globals.hero);

			if (debug) {
				document.querySelector('.debug__wrap' ).style.display = "block";
				debugTraect.init();
			}

		}
	})

})
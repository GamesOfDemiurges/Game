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

					globals.scale = 800 / document.body.clientHeight;

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
			"assets/models/ready/hero/hero.json",
			"assets/models/ready/hero/hero.anim",

			"assets/models/ready/bird/bird.json",
			"assets/models/ready/bird/bird.anim",

			"assets/models/ready/villain/villain.json",
			"assets/models/ready/villain/villain.anim",

			"assets/models/ready/villain2/villain2.json",
			"assets/models/ready/villain2/villain2.anim",

			"assets/background/background.png"
		],
		callback: function() {

			var currentPath = globals.paths['0.021916289813816547'],
				birdPath = globals.paths['0.04654977540485561'],
				groundPath = globals.paths['0.02847454440779984'];

			var background = obj().create({
				src: 'assets/background/background.png',
				x: 0,
				y: 0,
				z: 5
			});

			var hero = obj().create({
				name: 'hero',
				src: 'assets/models/ready/hero/hero.anim',
				z: 15,
				pz: 5,
				scale: 0.4,
				step: 0,
				path: currentPath.name,
				interactive: true
			});

			var villain = obj().create({
				name: 'villain',
				src: 'assets/models/ready/villain/villain.anim',
				z: 15,
				pz: 5,
				scale: 0.4,
				step: 0,
				path: groundPath.name,
				interactive: true
			});

			var villain2 = obj().create({
				name: 'villain2',
				src: 'assets/models/ready/villain2/villain2.anim',
				z: 15,
				pz: 5,
				scale: 1,
				step: 500,
				path: groundPath.name,
				interactive: true
			});

			var bird = obj().create({
				name: 'bird',
				src: 'assets/models/ready/bird/bird.anim',
				z: 15,
				pz: 5,
				step: 0,
				path: birdPath.name,
				interactive: true
			});

			//globals.hero.image.state.clearAnimation();

			scene
				.init({
					canvasId: 'view'
				})
				.addObj(background)
				.addObj(hero)
				.addObj(villain)
				.addObj(villain2)
				.addObj(bird);

			queue.startQueue();

			relay
				.listen('breakpoint')
				.listen('start')
				.listen('stop')
				.listen('startAnimation')
				.listen('endAnimation')
				.listen('objectClick');

			pathfinder.moveObjectByChain( {
				id: 'bird',
				path: '0.04654977540485561',
				chain: 3
			})

			if (debug) {
				document.querySelector('.debug__wrap' ).style.display = "block";
				debugTraect.init();
			}

		}
	})

})
var loader = (function() {

	// Предзагрузка ресурсов
	function init( p ) {
		var assetsLoader = new PIXI.AssetLoader(p.resources),
			callback = p.callback || function() {};

		assetsLoader.onComplete = function() { console.log('Ресурсы загружены');
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

			if (readTraect.readyState==4) { console.log('Траектории загружены')
				globals.paths = JSON.parse(readTraect.responseText);

				// Построить траектории
				utils.processPaths({
					callback: function() {

						// Построить граф
						graph.buildGraph({
							callback: function() { console.log('Граф построен');
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

			"assets/models/ready/bucket/bucket.json",
			"assets/models/ready/bucket/bucket.anim",

			"assets/models/ready/semaphore/semaphore.json",
			"assets/models/ready/semaphore/semaphore.anim",

			"assets/background/background.png"
		],
		callback: function() {

			relay
				.listen('breakpoint')
				.listen('start')
				.listen('stop')
				.listen('startAnimation')
				.listen('endAnimation')
				.listen('objectClick')
				.listen('objectAdded');

			var currentPath = 'stair2',
				birdPath = 'birdTreePath',
				groundPath = 'groundTreeToLeft',
				semaphoreVillainPath = 'semaphoreVillainPath';

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
				pz: 10,
				scale: 0.4,
				step: 0,
				path: currentPath,
				interactive: true
			});

			var villain = obj().create({
				name: 'villain',
				src: 'assets/models/ready/villain/villain.anim',
				z: 15,
				pz: 5,
				scale: 0.4,
				step: 440,
				path: groundPath,
				interactive: true
			});

			var villain2 = obj().create({
				name: 'villain2',
				src: 'assets/models/ready/villain2/villain2.anim',
				z: 15,
				pz: 5,
				scale: 1,
				step: 0,
				path: semaphoreVillainPath,
				interactive: true
			});

			var bird = obj().create({
				name: 'bird',
				src: 'assets/models/ready/bird/bird.anim',
				z: 15,
				pz: 5,
				step: 0,
				path: birdPath,
				interactive: true
			});

			var bucket = obj().create({
				name: 'bucket',
				src: 'assets/models/ready/bucket/bucket.anim',
				x: 530,
				y: 293,
				z: 13,
				pz: 5,
				//step: 0,
				//path: bucketPath.name,
			});

			var semaphore = obj().create({
				name: 'semaphore',
				src: 'assets/models/ready/semaphore/semaphore.anim',
				x: 1500,
				y: 730,
				z: 10,
			});

			//globals.hero.image.state.clearAnimation();

			globals.objects['hero'].image.stateData.setMixByName("new", "stairCaseWalk", 0);
			globals.objects['hero'].image.stateData.setMixByName("new", "stop", 0.3);

			scene
				.init({
					canvasId: 'view'
				})
				.addObj(background)
				.addObj(hero)
				.addObj(villain)
				.addObj(villain2)
				.addObj(bird)
				.addObj(bucket)
				.addObj(semaphore);

			viewport.init();

			queue.startQueue();

			console.log('Загрузка завершена');

			if (debug) {
				document.querySelector('.debug__wrap' ).style.display = "block";
				debugTraect.init();
			}
/*
			pathfinder.moveObjectByChain( {
				id: 'bird',
				path: birdPath,
				chain: 3,
				animationName: 'bird',
				speedValue: 4
			})
*/
		}
	})

})
var loader = (function() {

	// Предзагрузка ресурсов
	function initResources( p ) {
		var assetsLoader = new PIXI.AssetLoader(p.resources),
			callback = p.callback || function() {};

		assetsLoader.onComplete = function () { console.log('Ресурсы загружены');
			callback();
		}

		assetsLoader.load();
	}

	// Извлечение сохраненных путей из файла
	function readTraectFromFile ( p ) {
		var readTraect = new XMLHttpRequest,
			callback = p.callback || function () {};

		readTraect.open("GET", 'tools/traect.json?' + new Date().getTime());
		readTraect.onreadystatechange = function () {

			if (readTraect.readyState==4) { console.log('Траектории загружены')
				globals.paths = JSON.parse(readTraect.responseText);

				// Построить траектории
				utils.processPaths({
					callback: function() {

						// Построить граф
						graph.buildGraph({
							callback: function () { console.log('Граф построен');
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
			var callback = p.callback || function () {};

			// предзагрузить ресурсы
			initResources({
				resources: p.resources,
				callback: function () {

					globals.sceneWidth = 3828;
					globals.sceneHeight = 800;

					globals.scale = globals.sceneHeight / document.body.clientHeight;

					// загрузить траектории
					readTraectFromFile({
						callback: callback
					});
				}
			})
		}
	}

})();

function init() {
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

			"assets/models/ready/garbageBucket/garbageBucket.json",
			"assets/models/ready/garbageBucket/garbageBucket.anim",

			"assets/models/ready/stone/stone.json",
			"assets/models/ready/stone/stone.anim",

			"assets/models/ready/semaphore/semaphore.json",
			"assets/models/ready/semaphore/semaphore.anim",

			"assets/models/ready/butterfly/butterfly.json",
			"assets/models/ready/butterfly/butterfly.anim",

			"assets/models/ready/tv/tv.json",
			"assets/models/ready/tv/tv.anim",

			"assets/models/ready/additionalHero2/additionalHero2.json",
			"assets/models/ready/additionalHero2/additionalHero2.anim",

			"assets/models/ready/elephant/elephant.json",
			"assets/models/ready/elephant/elephant.anim",

			"assets/models/ready/doorToTheNextLavel/doorToTheNextLavel.json",
			"assets/models/ready/doorToTheNextLavel/doorToTheNextLavel.anim",

			"assets/models/ready/barrier/barrier.json",
			"assets/models/ready/barrier/barrier.anim",

			"assets/models/ready/roadSing/roadSing.json",
			"assets/models/ready/roadSing/roadSing.anim",

			"assets/background/background.jpg",
			"assets/background/backgroundVillainPatch.png",

			"assets/models/ready/tree/tree.json",
			"assets/models/ready/tree/tree.anim"
		],
		callback: function () {

			relay
				.listen('hero.breakpoint')
				.listen('hero.start')
				.listen('hero.stop')
				.listen('hero.startAnimation')
				.listen('hero.endAnimation')
				.listen('objectClick')
				.listen('objectAdded');

			var currentPath = 'stair2',
				birdPath = 'birdTreePath',
				groundPath = 'groundTreeToLeft',
				semaphoreVillainPath = 'semaphoreVillainPath',
				butterflyPath = 'butterflyPath',
				stoneToHand = 'stoneToHand',
				addHero2Path = 'addHero2Path',
				elephantPath = 'elephantPath',
				elephantPathEnd = 'elephantPathEnd',
				pathToMonitors = 'pathToMonitors',
				pathToRoadSing = 'pathToRoadSing',
				endPath = 'endPath';

			var background = obj().create({
				src: 'assets/background/background.jpg',
				name: 'background',
				x: 0,
				y: 0,
				z: 5
			});

			var backgroundVillainPatch = obj().create({
				src: 'assets/background/backgroundVillainPatch.png',
				name: 'backgroundVillainPatch',
				x: 1582,
				y: 600,
				z: 10
			});

			var tree = obj().create({
				name: 'hero',
				src: 'assets/models/ready/tree/tree.anim',
				z: 10,
				pz: 10,
				scale: 1.15,
				step: 275,
				path: groundPath
			});

			var hero = obj().create({
				name: 'hero',
				src: 'assets/models/ready/hero/hero.anim',
				z: 15,
				pz: 10,
				scale: 0.4,
				step: 0,
				path: currentPath
			});

			var villain = obj().create({
				name: 'villain',
				src: 'assets/models/ready/villain/villain.anim',
				z: 15,
				pz: 5,
				scale: 0.4,
				step: 440,
				path: groundPath,
				interactive: true,
				ai: {
					stayAnimation: 'animation'
				},
				animation: {
					animation: {
						soundSrc: 'assets/models/ready/villain/villain_sound.ogg'
					}
				}
			});

			var villain2 = obj().create({
				name: 'villain2',
				src: 'assets/models/ready/villain2/villain2.anim',
				z: 7,
				pz: 5,
				scale: 1,
				step: 0,
				path: semaphoreVillainPath,
				interactive: true,
				ai: {
					stayAnimation: 'animation'
				},
				animation: {
					animation: {
						soundSrc: 'assets/models/ready/villain2/villain2_sound.ogg'
					}
				}
			});

			var bird = obj().create({
				name: 'bird',
				src: 'assets/models/ready/bird/bird.anim',
				z: 15,
				pz: 5,
				step: 0,
				path: birdPath,
				interactive: true,
				ai: {
					stayAnimation: 'bird'
				},
				animation: {
					bird: {
						soundSrc: 'assets/models/ready/bird/bird_sound.ogg'
					}
				}
			});

			var bucket = obj().create({
				name: 'bucket',
				src: 'assets/models/ready/bucket/bucket.anim',
				x: 530,
				y: 293,
				z: 13,
				pz: 5
			});

			var garbageBucket = obj().create({
				name: 'garbageBucket',
				src: 'assets/models/ready/garbageBucket/garbageBucket.anim',
				x: 1193,
				y: 647,
				z: 10,
			});

			var semaphore = obj().create({
				name: 'semaphore',
				src: 'assets/models/ready/semaphore/semaphore.anim',
				x: 1500,
				y: 730,
				z: 10,
				interactive: true,
				animation: {
					trafficLight: {
						soundSrc: 'assets/models/ready/semaphore/semaphore_sound.ogg'
					}
				}
			});

			var stone = obj().create({
				name:'stone',
				src: 'assets/models/ready/stone/stone.anim',
				path: stoneToHand,
				step: 20,
				z: 10,
				pz:  15,
				interactive: true
			});

			var barrier = obj().create({
				name: 'barrier',
				src: 'assets/models/ready/barrier/barrier.anim',
				x:1750,
				y: 610,
				z: 10
			});

			var butterfly = obj().create({
				name: 'butterfly',
				src: 'assets/models/ready/butterfly/butterfly.anim',
				scale: 0.35,
				z: 15,
				pz: 5,
				step: 0,
				path: butterflyPath,
				interactive: true
			});

			var tv = obj().create({
				name: 'tv',
				src: 'assets/models/ready/tv/tv.anim',
				z: 20,
				pz: 5,
				x: 2370,
				y: 840,
				interactive: true,
				animation: {
					'TV run': {
						soundSrc: 'assets/models/ready/tv/tv_sound.ogg'
					},
					'TV stop': {
						soundSrc: 'assets/models/ready/tv/tv_sound.ogg'
					}
				}
			});

			var addHero2 = obj().create({
				name: 'addHero2',
				src: 'assets/models/ready/additionalHero2/additionalHero2.anim',
				z:10,
				pz: 10,
				step:0,
				path: elephantPathEnd,
				ai: {
					stayAnimation: 'animation',
					moveAnimation: 'animation',
					availablesPaths: elephantPathEnd,
					stayTime: 5000
				},
				animation: {
					animation: {
						soundSrc: 'assets/models/ready/additionalHero2/additionalHero2_sound.ogg'
					}
				}
			});

			var elephant = obj().create({
				name: 'elephant',
				src: 'assets/models/ready/elephant/elephant.anim',
				z:10,
				pz: 10,
				scale: 0.8,
				step:0,
				path: addHero2Path,
				interactive: false,
				ai: {
					moveAnimation: 'Elefant',
					availablesPaths: addHero2Path,
					stayTime: 6000
				}
			});

			var doorToTheNextLavel = obj().create({
				name:'doorToTheNextLavel',
				src: 'assets/models/ready/doorToTheNextLavel/doorToTheNextLavel.anim',
				x: 3700,
				y: 550,
				z: 10,
				interactive: true,
				animation: {
					door: {
						soundSrc: 'assets/models/ready/doorToTheNextLavel/door_sound.ogg'
					}
				}
			});

			var roadSing = obj().create({
				name:'roadSing',
				src: 'assets/models/ready/roadSing/roadSing.anim',
				x: 3485,
				y: 285,
				z: 10,
				interactive: true
			});

			// Переходы между анимациями
			globals.objects.hero.image.stateData.setMixByName("new", "stairCaseWalk", 0);
			globals.objects.hero.image.stateData.setMixByName("new", "stop", 0.3);
			globals.objects.semaphore.image.stateData.setMixByName("trafficLight", "trafficLight_stop", 0.5);

			audio.initBackgroundSound();

			scene
				.init({
					canvasId: 'view'
				})
				.addObj(background)
				.addObj(backgroundVillainPatch)
				.addObj(tree)
				.addObj(hero)
				.addObj(villain)
				.addObj(villain2)
				.addObj(bird)
				.addObj(bucket)
				.addObj(garbageBucket)
				.addObj(semaphore)
				.addObj(butterfly)
				.addObj(tv)
				.addObj(addHero2)
				.addObj(elephant)
				.addObj(stone)
				.addObj(doorToTheNextLavel)
				.addObj(barrier)
				.addObj(roadSing);

			viewport.init();
			hint.init();

			queue.startQueue();

			console.log('Загрузка завершена');

			if (debug) {
				document.querySelector('.debug__wrap' ).style.display = "block";
				debugTraect.init();
			}

		}
	})
}

document.addEventListener("DOMContentLoaded", function () {

	function fullScreen() {
		var html = document.body;

		if (html.requestFullScreen) {
			html.requestFullScreen();
		} else if (html.mozRequestFullScreen) {
			html.mozRequestFullScreen();
		} else if (html.webkitRequestFullScreen) {
			html.webkitRequestFullScreen();
		}

	}

	audio
		.init();
		//.initSplashSound();

	video
		.init();

	if (!debug) {
		document.body.className += ' _noscroll';
		document.querySelector('.start__run').onclick = function () {
			document.body.removeChild( document.querySelector('.start') );
			fullScreen();

			audio.finishSplashSound();

			video.play(function() {
				init();
			});

		}
	} else {
		init();
	}
})
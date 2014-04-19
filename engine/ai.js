// Клик на птицу
document.addEventListener('objectClick', function( p ) {
	if( p.detail.obj == 'bird' ) {

		if ( (globals.objects.hero.path == 'treeInside') && (globals.objects.hero.step == 126) ) {
			// Запретить пользователю ходить на время анимации
			globals.preventClick = true;

			pathfinder.moveObjectByChain( {
				id: 'bird',
				path: 'birdTreePath',
				chain: 3,
				animationName: 'bird',
				speedValue: 4
			})

			setTimeout(function() {
				// Разрешить спуститься
				globals.paths.treeToBucket.breakpath = false;

				graph.buildGraph({
					callback: function() {

						// Дойти до ведра
						pathfinder.moveObjectByChain( {
							id: 'hero',
							path: 'treeToBucket',
							chain: 0,
							animationName: 'new',
							speedValue: 3
						})

						setTimeout(function() {
							// Развернуть героя для спуска по веревке
							globals.objects.hero.image.scale.x *= -1;

							// Бросить ведро вниз
							globals.objects.bucket.animate({
								animation: 'bucket',
								callback: function() {

									// Спустить героя на землю
									pathfinder.moveObjectByChain( {
										id: 'hero',
										path: 'groundTreeToLeft',
										chain: 1
									})

								}
							})

						}, 1300)

					}
				});
			}, 1000)
		}

		// Если потянуться за птицей с земли
		if ( (globals.objects.hero.path == 'treeToSemaphore') && (globals.objects.hero.step == 207) &&
			(globals.objects.bird.path == 'birdTreePath') && (globals.objects.bird.step == 456 ) ) {

			globals.objects.hero.animate({
				animation: 'ReachOut'
			})

			// Птица улетает до того, как герой дотянется
			setTimeout(function() {

				pathfinder.moveObjectByChain( {
					id: 'bird',
					path: 'birdTreePath2',
					chain: 3,
					animationName: 'bird',
					speedValue: 4
				})

			}, 300)
		}
	}
});

// Спуск героя по веревке на землю
document.addEventListener('breakpoint', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '5' && (!globals.triggers.heroOnTheGround)) {
		// Запретить подниматься обратно наверх
		globals.paths.bucketToGround.breakpath = true;

		graph.buildGraph({
			callback: function() {

				// Разрешить пользователю ходить
				globals.triggers.heroOnTheGround = true;
				globals.preventClick = false;
			}
		});
	}
});

// Клик на злодея под деревом
document.addEventListener('objectClick', function( p ) {
	if (p.detail.obj == 'villain') {
		// Если герой тоит вплотную к злодею, можно попробовать его поймать
		if ( (globals.objects.hero.path == 'groundTreeToLeft') && (globals.objects.hero.step == 333) ) {
			globals.objects.hero.animate({
				animation: 'catch',
				callback: function() {
					globals.objects.villain.animate({
						animation: 'animation'
					})
				}
			})
		} else {
			globals.objects.villain.animate({
				animation: 'animation'
			})
		}
	}
});

// Семафор качается
document.addEventListener('objectAdded', function( p ) {
	if (p.detail.obj == 'semaphore') {

		function startSemaphore() {
			globals.objects.semaphore.animate({
				animation: 'trafficLight',
				callback: function() {
					startSemaphore();
				}
			})
		}

		startSemaphore();
	}
});


/*document.addEventListener('objectAdded', function(p){
	if(p.detail.obj =='villain2') {
		setTimeout(function(){
			pathfinder.moveObjectByChain({
				id: 'villain2',
				path:'groundTreeToLeft',
				chain: 0,
				speedValue: 5
			})
		}, 1000)
	}
})
document.addEventListener('stop', function(p){
	if(p.detail.obj =='villain2' && p.detail.graphId =='5') {
		setTimeout(function(){
			pathfinder.moveObjectByChain({
				id: 'villain2',
				path:'groundTreeToLeft',
				chain: 5,
				speedValue: 5
			})
		}, 1000)
	}

	if(p.detail.obj =='villain2' && p.detail.graphId =='6') {
		setTimeout(function(){
			pathfinder.moveObjectByChain({
				id: 'villain2',
				path:'groundTreeToLeft',
				chain: 0,
				speedValue: 5
			})
		}, 1000)
	}
})
*/
/*
document.addEventListener('stop', function(p){
	if(p.detail.obj =='villain2' && p.detail.graphId =='5') {

		pathfinder.moveObjectByChain({
			id: 'villain',
			path:'bucketToGround',
			chain: 0
		})

	}
})
*/
/*
document.addEventListener('stop', function (p){
	if(p.detail.obj =='hero' && p.detail.graphId =='4'){}

	????? Как присвоить  точке 4 анимацию "ReachOut" главному герою??
})*/





/*
document.addEventListener('stop', function(p){
	if(p.detail.obj =='villain' && p.detail.graphId =='3') {

		pathfinder.moveObjectByChain({
			id: 'villain2',
			path:'groundTreeToLeft',
			chain: 5
		})

	}
})
*/





// Bird
/*document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'bird' && p.detail.graphId == '9') {

		setTimeout(function() {
			pathfinder.moveObjectByChain( {
				id: 'bird',
				path: 'birdTreePath',
				chain: 0,
				animationName: 'bird',
				speedValue: 4
			})

		}, 1000)
	}

	if (p.detail.obj == 'bird' && p.detail.graphId == '8') {

		setTimeout(function() {
			pathfinder.moveObjectByChain( {
				id: 'bird',
				path: 'birdTreePath',
				chain: 3,
				animationName: 'bird',
				speedValue: 4
			})

		}, 1000)

	}
})*/

/*
document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '4') {
		globals.paths['0.2527436772361398'].breakpath = false;

		graph.buildGraph({
			callback: function() {
				alert('Ведро! Автоспуск');

				pathfinder.moveObjectByChain( {
					id: 'hero',
					path: '0.35202742647379637',
					chain: 0
				})
			}
		});
	}
})


document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '15') {
		globals.paths['0.1525857609231025'].breakpath = false;

		graph.buildGraph({
			callback: function() {
				alert('Камень!');
			}
		});
	}
})

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '20') {
		globals.paths['0.048842963529750705'].breakpath = false;

		graph.buildGraph({
			callback: function() {
				alert('Телевизор!');
			}
		});
	}
})

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '19') {
		globals.paths['0.4269534260965884'].breakpath = false;

		graph.buildGraph({
			callback: function() {
				alert('Телевизор2!');
			}
		});
	}
})

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '28') {
		globals.paths['0.9639693887438625'].breakpath = false;

		graph.buildGraph({
			callback: function() {
				alert('Мусор!');
			}
		});
	}
})
*/



/*
document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero1') {
		if (p.detail.graphId == '3') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero1',
					path: '0.06227287882938981',
					chain: 3
				})
			}, 500)
		}

		if (p.detail.graphId == '5') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero1',
					path: '0.08568654861301184',
					chain: 4
				})
			}, 500)
		}
	}
})

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero2') {
		if (p.detail.graphId == '1') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero2',
					path: '0.8360544058959931',
					chain: 0
				})
			}, 500)
		}

		if (p.detail.graphId == '0') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero2',
					path: '0.8360544058959931',
					chain: 9
				})
			}, 500)
		}
	}
})



document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '6' && (!globals.triggers.thirdHeroAdded)) {
		var currentPath = globals.paths['0.8360544058959931'];

		var hero2 = obj().create({
			name: 'hero2',
			src: 'assets/models/hero/images/hero_final.anim',
			x: currentPath.steps[0].x,
			y: currentPath.steps[0].y,
			z: 15,
			scale: 0.5,
			step: 900,
			path: currentPath.name
		});

		scene
			.addObj(hero2);

		pathfinder.moveObjectByChain( {
			id: 'hero2',
			path: '0.8360544058959931',
			chain: 9
		})
	}
})
*/
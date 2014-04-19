// Клик на птицу
document.addEventListener('objectClick', function( p ) {
	if( p.detail.obj == 'bird' ) {

		if ( (globals.objects.hero.path == 'treeInside') && (globals.objects.hero.step == 126) ) {
			// Запретить пользователю ходить на время анимации
			globals.preventClick = true;

			globals.objects.hero.animate({
				animation: 'slope',
				callback: function() {

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
								speedValue: 3,
								callback: function() {

									// Бросить ведро вниз
									globals.objects.bucket.animate({
										animation: 'bucket',
										callback: function() {

											// Развернуть героя для спуска по веревке
											globals.objects.hero.image.scale.x *= -1;

											// Спустить героя на землю
											pathfinder.moveObjectByChain( {
												id: 'hero',
												path: 'groundTreeToLeft',
												chain: 1
											})

										}
									})
								}
							})

						}
					});
				}
			})

			// Запустить птицу через таймер, потому что улетает в середине анимации
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'bird',
					path: 'birdTreePath',
					chain: 3,
					animationName: 'bird',
					speedValue: 4
				})

			}, 400)

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

// Светофор качается
document.addEventListener('objectAdded', function( p ) {
	if (p.detail.obj == 'semaphore') {

		function startSemaphore() {
			if (!globals.triggers.stopSemaphore) {
				globals.objects.semaphore.animate({
					animation: 'trafficLight',
					callback: function() {
						startSemaphore();
					}
				})
			}
		}

		startSemaphore();

	}
});

// Положить птицу в Светофор
document.addEventListener('objectClick', function( p ) {
	if ( (p.detail.obj == 'semaphore') && (globals.triggers.semaphoreIsClickable) ) {

		if ( (globals.objects.hero.path == 'semaphoreTurnOnPath') && (globals.objects.hero.step < 10) ) {

			globals.triggers.stopSemaphore = true;

			// Остановить качание светофора
			globals.objects.semaphore.animate({
				animation: 'trafficLight_stop'
			})

			// Герой тянется к светофору
			globals.objects.hero.animate({
				animation: 'ReachOut'
			})

			// Таймер, потому что до завершения анимации
			setTimeout(function() {
				// Показать птицу в светофоре
				if (globals.triggers.butterflyWasCatched) {

					globals.objects.butterfly.move({
						z: 15
					})

					// Разрешить ходить за шлагбаум
					globals.paths.semaphoreToTV.breakpath = false;
					graph.buildGraph({
						callback: function() {
							alert('Шлагбаум поднялся!');
						}
					});
				}
			}, 400);
		}
	}
});


// Бабочка летает
document.addEventListener('objectAdded', function( p ) {
	if (p.detail.obj == 'butterfly') {

		// setTimeout, потому что может не успеть проинициализироваться
		setTimeout(function() {
			pathfinder.moveObjectByChain( {
				id: 'butterfly',
				path: 'butterflyPath2',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})
		}, 1000)
	}
})

function catchButterfly() {
	globals.objects.hero.animate({
		animation: 'catch',
		callback: function() {
			globals.triggers.butterflyWasCatched = true;
			globals.preventClick = false;
		}
	})

	pathfinder.moveObjectByChain( {
		id: 'butterfly',
		path: 'butterflyStopPath',
		chain: 2,
		animationName: 'butterfly',
		speedValue: 10
	})

	// Скрыть птицу
	setTimeout(function() {
		globals.objects.butterfly.move({
			z: 0
		})
	}, 100)
}

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'butterfly') {
		if ( p.detail.graphId == 17 ) {
			pathfinder.moveObjectByChain( {
				id: 'butterfly',
				path: 'butterflyPath2',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})

		}

		if ( p.detail.graphId == 18 ) {
			pathfinder.moveObjectByChain( {
				id: 'butterfly',
				path: 'butterflyPath3',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})

			if ( (globals.triggers.butterflyCanBeCatched) &&
				( ((globals.objects.hero.path == 'semaphoreBreakPath') && (globals.objects.hero.step < 10)) ||
				((globals.objects.hero.path == 'treeToSemaphore') && (globals.objects.hero.step > 890 && globals.objects.hero.step < 900))) ) {

				globals.preventClick = true;

				// С таймером, потому что ловля бабочки не в самом начале её движения
				setTimeout(function() {
					catchButterfly();
				}, 1000)
			}
		}

		if ( p.detail.graphId == 19 ) {
			pathfinder.moveObjectByChain( {
				id: 'butterfly',
				path: 'butterflyPath4',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})

			if ( (globals.triggers.butterflyCanBeCatched) && (globals.objects.hero.path == 'treeToSemaphore') && (globals.objects.hero.step > 630 && globals.objects.hero.step < 740) ) {

				globals.preventClick = true;

				if (globals.objects.hero.step > 730) {

					// С таймером, потому что ловля бабочки не в самом начале её движения
					setTimeout(function() {
						catchButterfly();
					}, 1000);


				} else {

					// С таймером, потому что ловля бабочки не в самом начале её движения
					setTimeout(function() {
						catchButterfly();
					}, 1500);
				}
			}
		}

		if ( p.detail.graphId == 20 ) {
			pathfinder.moveObjectByChain( {
				id: 'butterfly',
				path: 'butterflyPath',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 3
			})
		}
	}
});

document.addEventListener('objectClick', function( p ) {
	if (p.detail.obj == 'butterfly') {
		if (globals.triggers.butterflyInerval) {
			clearInterval(globals.triggers.butterflyInerval);
		}

		globals.triggers.butterflyCanBeCatched = true;

		globals.triggers.butterflyInerval = setTimeout(function() {
			globals.triggers.butterflyCanBeCatched = false;
		}, 3000);
	}
});

// Кинуть камень в злодея

function dropToVillain() {

	globals.objects.hero.animate({
		animation: 'slope',
		callback: function() {

			globals.preventClick = false;

			// С таймером, потому что камень должен долететь
			setTimeout(function() {

				globals.paths.semaphoreBreakPath.breakpath = false;

				graph.buildGraph({
					callback: function() {
						globals.triggers.semaphoreIsClickable = true;
					}
				});

				pathfinder.moveObjectByChain( {
					id: 'villain2',
					path: 'semaphoreVillainPath',
					chain: 1,
					animationName: 'down',
					speedValue: 15
				});
			}, 300)
		}
	})
}

document.addEventListener('objectClick', function( p ) {
	if (p.detail.obj == 'villain2') {

		if (globals.objects.hero.path == 'treeToSemaphore') {

			if (globals.objects.hero.step > 730) {
				globals.preventClick = true;

				if (globals.objects.hero.step < 890) {

					pathfinder.moveObjectByChain( {
						id: 'hero',
						path: 'treeToSemaphore',
						chain: 8,
						animationName: 'new',
						speedValue: 3,
						callback: function() {
							dropToVillain();
						}
					});
				} else {
					dropToVillain();
				}

			}

		}
	}
});
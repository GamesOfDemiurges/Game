// Клик на птицу
document.addEventListener('bird.objectClick', function( p ) {

	if ( (globals.objects.hero.getPosition().path == 'treeInside') && (globals.objects.hero.getPosition().graphId == 4) ) {
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
						globals.objects.hero.moveTo( {
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
										if (globals.objects.hero.getPosition().orientation == 1) {
											globals.objects.hero.image.scale.x *= -1;
										}

										// Спустить героя на землю
										globals.objects.hero.moveTo( {
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
			globals.objects.bird.moveTo( {
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

			globals.objects.bird.moveTo( {
				path: 'birdTreePath2',
				chain: 3,
				animationName: 'bird',
				speedValue: 4
			})

		}, 300)
	}
});

// Спуск героя по веревке на землю
document.addEventListener('hero.breakpoint.inGraphId.5', function( p ) {
	if ( !globals.triggers.heroOnTheGround) {
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
document.addEventListener('villain.objectClick', function( p ) {

	// Если герой стоит вплотную к злодею, можно попробовать его поймать
	if ( (globals.objects.hero.getPosition().path == 'groundTreeToLeft') && (globals.objects.hero.getPosition().chain == 3) ) {
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

	hint.message('Этот сиккарах выглядит рассерженным. Вряд ли он пропустит меня.')
});

// Светофор качается
document.addEventListener('semaphore.objectAdded', function( p ) {

	(function startSemaphore() {
		if (!globals.triggers.stopSemaphore) {
			globals.objects.semaphore.animate({
				animation: 'trafficLight',
				callback: function() {
					startSemaphore();
				}
			})
		}
	})();

});

// Положить птицу в Светофор
document.addEventListener('semaphore.objectClick', function( p ) {
	if ( globals.triggers.semaphoreIsClickable ) {

		if ( globals.objects.hero.getPosition().graphId == 17 ) {

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

							//шлагбаум поднимается
							globals.objects.barrier.animate({
								animation: 'barrier'
							})
						}
					});
				}
			}, 400);
		}
	}
});


// Бабочка летает
document.addEventListener('butterfly.objectAdded', function( p ) {

	/*!!!!*/
	/*globals.paths.semaphoreToTV.breakpath = false;*/


	// setTimeout, потому что может не успеть проинициализироваться
	setTimeout(function() {

		globals.objects.butterfly.moveTo( {
			path: 'butterflyPath2',
			chain: 0,
			animationName: 'butterfly',
			speedValue: 4
		})
	}, 3000)
})

function catchButterfly() {
	globals.objects.hero.animate({
		animation: 'catch',
		callback: function() {
			globals.triggers.butterflyWasCatched = true;
			globals.preventClick = false;
		}
	})

	globals.objects.butterfly.moveTo( {
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

document.addEventListener('butterfly.stop', function( p ) {

	if ( p.detail.graphId == 18 ) {
		globals.objects.butterfly.moveTo( {
			path: 'butterflyPath2',
			chain: 0,
			animationName: 'butterfly',
			speedValue: 4
		})

	}

	if ( p.detail.graphId == 19 ) {
		globals.objects.butterfly.moveTo( {
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

	if ( p.detail.graphId == 20 ) {
		globals.objects.butterfly.moveTo( {
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

	if ( p.detail.graphId == 21 ) {
		globals.objects.butterfly.moveTo( {
			path: 'butterflyPath',
			chain: 0,
			animationName: 'butterfly',
			speedValue: 3
		})
	}

});

document.addEventListener('butterfly.objectClick', function( p ) {

	if (globals.triggers.butterflyInerval) {
		clearInterval(globals.triggers.butterflyInerval);
	}

	globals.triggers.butterflyCanBeCatched = true;

	globals.triggers.butterflyInerval = setTimeout(function() {
		globals.triggers.butterflyCanBeCatched = false;
	}, 25000);

});

function getTheStone(cb) {
	var callback = cb || function() {};

	if (!globals.triggers.ihavestone) {
		globals.objects.hero.animate({
			animation: 'slope',
			callback: function() {
				globals.triggers.ihavestone	 = true;
				callback();
			}
		})

		setTimeout(function() {
			globals.objects.stone.move({
				z: 0
			})

			globals.objects.stone.moveTo({
				path: 'stoneToHand',
				chain: 1,
				speedValue: 20
			})
		}, 700)

	} else {
		callback();
	}

}

// Кинуть камень в злодея

function dropToVillain() {

	getTheStone(function() {

		globals.preventClick = false;

		globals.objects.stone.move({
			z: 10
		})

		globals.objects.stone.moveTo({
			path: 'stoneToHand',
			chain: 3,
			speedValue: 18,
			callback: function() {

				globals.objects.stone.move({
					z: 0
				})

				globals.objects.villain2.ai.stop();
				globals.objects.villain2.moveTo( {
					path: 'semaphoreVillainPath',
					chain: 1,
					animationName: 'down',
					speedValue: 15
				});

				globals.paths.semaphoreBreakPath.breakpath = false;

/* === */
//				globals.paths.semaphoreToTV.breakpath = false;
/* === */
				graph.buildGraph({
					callback: function() {
						globals.triggers.semaphoreIsClickable = true;
					}
				});

				globals.objects.villain2.image.setInteractive(false);

			}
		})
	})
}

document.addEventListener('stone.objectClick', function( p ) {

	if ( globals.objects.hero.getPosition().graphId == 11 ) {
		getTheStone();
	}
})

document.addEventListener('villain2.objectClick', function( p ) {

	if (globals.objects.hero.path == 'treeToSemaphore') {

		if (globals.objects.hero.step > 730) {
			globals.preventClick = true;

			if (globals.objects.hero.step < 890) {

				globals.objects.hero.moveTo( {
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
});

// Телевизор

function TVPictures() {
	globals.objects.tv.animate({
		animation: 'TV stop',
		callback: function() {
			TVPictures();
		}
	})
}

document.addEventListener('tv.objectClick', function( p ) {

	if ( globals.objects.hero.path == 'TVPath' ) {

		globals.objects.hero.moveTo( {
			path: 'TVPath',
			chain: 2,
			callback: function() {

				globals.objects.tv.animate({
					animation: 'TV run',
					callback: function() {

						globals.paths.pathToMonitors.breakpath = false;
						graph.buildGraph();

						TVPictures();
					}
				})
			}
		});
	}
});



//второй вариант
document.addEventListener('roadSing.objectClick', function( p ){

   if( (globals.objects.hero.getPosition().path == 'elephantPath') && (globals.objects.hero.getPosition().chain == 1) ){

	   globals.objects.hero.animate({
		   animation:'ReachOut',
		   callback: function(){

			   //знак меняется на противоположный
			   globals.objects.roadSing.animate({
				   animation:'roadSing',
				   callback: function () {

					   //дверь открывается
					   globals.objects.doorToTheNextLavel.animate({
						   animation:'door',
						   callback: function () {
								globals.triggers.exit = true;
						   }
					   })

				   }
			   });
		   }
	   })
   }

})

// Конец уровня
document.addEventListener('hero.stop.inGraphId.32', function( p ) {

	if (globals.triggers.exit) {
		alert('Уровень пройден!');
	}
})


/* === Подсказки */



// Лестница
document.addEventListener('hero.objectAdded', function( p ) {

	globals.triggers.stairHint = setInterval(function() {

		hint.message('Высоко тут...');

	}, utils.getRandomValue(60000, 90000) );
})

document.addEventListener('hero.stop.inGraphId.2', function( p ) {
	bucketHint();
	clearInterval( globals.triggers.stairHint );
})

document.addEventListener('hero.breakpoint.inGraphId.2', function( p ) {
	bucketHint();
	clearInterval( globals.triggers.stairHint );
})

// Ведро
function bucketHint() {
	if (globals.triggers.bucketHint) return;

	globals.triggers.bucketHint = setInterval(function() {

		if ( ~['tree1', 'jump2', 'treeInside', 'treeToBucket'].indexOf(globals.objects.hero.getPosition().path)  ) {
			hint.message('Додумался же кто-то повесить ведро на дерево!');
		}

	}, utils.getRandomValue(60000, 90000) );
}

document.addEventListener('hero.bucketToGround.inGraphId.3', function( p ) {
	clearInterval( globals.triggers.bucketHint );
})
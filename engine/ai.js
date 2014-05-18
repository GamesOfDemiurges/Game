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
/*document.addEventListener('butterfly.objectAdded', function( p ) {


	//globals.paths.semaphoreToTV.breakpath = false;


	// setTimeout, потому что может не успеть проинициализироваться
	setTimeout(function() {

		globals.objects.butterfly.move({
			z: 15
		})

		globals.objects.butterfly.moveTo( {
			path: 'butterflyPath2',
			chain: 0,
			animationName: 'butterfly',
			speedValue: 4
		})
	}, 3000)
})*/

function catchButterfly() {
	globals.objects.hero.animate({
		animation: 'catch',
		callback: function() {
			globals.triggers.butterflyWasCatched = true;
			globals.preventClick = false;
		}
	})

	globals.objects.butterfly.move({
		z: 0
	})

	globals.objects.butterfly.moveTo( {
		path: 'butterflyStopPath',
		chain: 1,
		animationName: 'butterfly',
		speedValue: 10
	})
}

document.addEventListener('butterfly.stop.inGraphId.18', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath2',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 4
	})

	if ( globals.triggers.butterflyCanBeCatched) {

		if (globals.objects.hero.getPosition().path == 'treeToSemaphore' && globals.objects.hero.getPosition().chain == 6) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.stop.inGraphId.19', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath3',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 4
	})

	if ( globals.triggers.butterflyCanBeCatched) {

		if (globals.objects.hero.getPosition().path == 'treeToSemaphore' && globals.objects.hero.getPosition().chain == 5) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.stop.inGraphId.20', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath4',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 4
	})

	if ( (globals.triggers.butterflyCanBeCatched) ) {

		if (globals.objects.hero.getPosition().graphId == 11 ) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.stop.inGraphId.21', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 3
	})

	if ( globals.triggers.butterflyCanBeCatched) {

		if (globals.objects.hero.getPosition().path == 'treeToSemaphore' && globals.objects.hero.getPosition().chain == 7) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.objectClick', function( p ) {

	if (globals.triggers.butterflyInerval) {
		clearInterval(globals.triggers.butterflyInerval);
	}

	globals.triggers.butterflyCanBeCatched = true;

	globals.triggers.butterflyInerval = setTimeout(function() {
		globals.triggers.butterflyCanBeCatched = false;
	}, 25000);


	if ( globals.objects.butterfly.getPosition().path == 'butterflyPath' ) {
		globals.objects.hero.moveTo({
			path: 'treeToSemaphore',
			chain: 8
		})
	}

	if ( globals.objects.butterfly.getPosition().path == 'butterflyPath2' ) {
		globals.objects.hero.moveTo({
			path: 'treeToSemaphore',
			chain: 7
		})
	}

	if ( globals.objects.butterfly.getPosition().path == 'butterflyPath3' ) {
		globals.objects.hero.moveTo({
			path: 'treeToSemaphore',
			chain: 6
		})
	}

	if ( globals.objects.butterfly.getPosition().path == 'butterflyPath4' ) {
		globals.objects.hero.moveTo({
			path: 'treeToSemaphore',
			chain: 5
		})
	}

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

		if (globals.objects.hero.getPosition().orientation == -1) {
			globals.objects.hero.image.scale.x *= -1;
		}

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

				globals.paths.semaphoreTurnOnPath.breakpath = false;

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

	if (globals.objects.hero.getPosition().graphId == 11) {
		dropToVillain();
	} else if ( ~['treeToSemaphore', 'semaphoreBreakPath'].indexOf( globals.objects.hero.getPosition().path ) ) {
		globals.objects.hero.moveTo( {
			path: 'treeToSemaphore',
			chain: 8,
			animationName: 'new',
			speedValue: 3,
			callback: function() {
				dropToVillain();
			}
		});
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


function checkGarbageBucket() {

	if (globals.triggers.garbageBucketIsOpen) return;

	var currentChain = globals.objects.hero.getPosition().chain;

	if (currentChain > 1 && currentChain < 9) {

		globals.objects.garbageBucket.animate({
			animation: 'live'
		})
	}

	setTimeout(function() {
		if ( globals.objects.hero.getPosition().path !== 'treeToSemaphore' ) return;
		checkGarbageBucket();
	}, 1200);
}

document.addEventListener('hero.stop.inGraphId.5', function( p ) { checkGarbageBucket() })
document.addEventListener('hero.breakpoint.inGraphId.5', function( p ) { checkGarbageBucket() })
document.addEventListener('hero.stop.inGraphId.11', function( p ) { checkGarbageBucket() })
document.addEventListener('hero.breakpoint.inGraphId.11', function( p ) { checkGarbageBucket() })

document.addEventListener('garbageBucket.objectClick', function( p ) {
	if ( globals.triggers.garbageBucketIsOpen ) return;

	var currentChain = globals.objects.hero.getPosition().chain;
	if ( !((globals.objects.hero.getPosition().path == 'treeToSemaphore') && (currentChain == 6 || currentChain == 7)) ) return;

 	globals.triggers.garbageBucketIsOpen = true;
	globals.objects.garbageBucket.animate({
		animation: 'open',
		callback: function() {

			globals.objects.butterfly.move({
				z: 15
			})

			globals.objects.butterfly.moveTo( {
				path: 'butterflyPath2',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})

		}
	})
})

function moveTree() {
	globals.paths.jump2.breakpath = true;
	globals.paths.tree1.breakpath = true;
	graph.buildGraph({
		callback: function() {
			globals.objects.tree.moveTo({
				path: 'groundTreeToLeft',
				chain: 4,
				animationName: 'animation',
				speedValue: 2
			})
		}
	});

}

document.addEventListener('hero.stop.inGraphId.8', function( p ) { moveTree() })
document.addEventListener('hero.breakpoint.inGraphId.8', function( p ) { moveTree() })

/* === Подсказки */



// Лестница
/*
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
*/
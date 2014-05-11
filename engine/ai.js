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
											globals.objects.hero.image.scale.x *= -1;

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
document.addEventListener('objectAdded', function( p ) {
	if (p.detail.obj == 'butterfly') {
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

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'butterfly') {
		if ( p.detail.graphId == 17 ) {
			globals.objects.butterfly.moveTo( {
				path: 'butterflyPath2',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})

		}

		if ( p.detail.graphId == 18 ) {
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

		if ( p.detail.graphId == 19 ) {
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

		if ( p.detail.graphId == 20 ) {
			globals.objects.butterfly.moveTo( {
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
		}, 25000);
	}
});
// Злодей
document.addEventListener('objectAdded', function( p ) {
    if (p.detail.obj == 'villain2') {

        (function animateVillain2() {
            if (!globals.triggers.stopVillain2) {
                globals.objects.villain2.animate({
                    animation: 'animation',
                    callback: function() {
                        animateVillain2();
                    }
                })
            }
        })();

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

		globals.objects.stone.move({
			z: 10
		})

		globals.objects.stone.moveTo({
			path: 'stoneToHand',
			chain: 3,
			speedValue: 12,
			callback: function() {

				globals.objects.stone.move({
					z: 0
				})

				globals.objects.villain2.moveTo( {
					path: 'semaphoreVillainPath',
					chain: 1,
					animationName: 'down',
					speedValue: 15
				});

				globals.paths.semaphoreBreakPath.breakpath = false;

/* === */
				globals.paths.semaphoreToTV.breakpath = false;
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

document.addEventListener('objectClick', function( p ) {

	if (p.detail.obj == 'stone') {

		if ( ((globals.objects.hero.path == 'treeToSemaphore') && (globals.objects.hero.step > 880)) ||
			((globals.objects.hero.path == 'semaphoreBreakPath') && (globals.objects.hero.step < 10)) ) {
			getTheStone();
		}
	}
})

document.addEventListener('objectClick', function( p ) {
	if (p.detail.obj == 'villain2') {

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

document.addEventListener('objectClick', function( p ) {

	if ( p.detail.obj == 'tv' ) {

		if ( globals.objects.hero.path == 'TVPath' ) {

			globals.objects.hero.moveTo( {
				path: 'TVPath',
				chain: 2,
				callback: function() {

					globals.objects.tv.animate({
						animation: 'TV run',
						callback: function() {

							//globals.paths.TVBreakPath.breakpath = false;
							graph.buildGraph();

							TVPictures();
						}
					})
				}
			});
		}
	}
});

// AddHero2
document.addEventListener('objectAdded', function(p){
	if (p.detail.obj == 'addHero2' ){
		setTimeout(function(){
			pathfinder.moveObjectByChain({
				id:'addHero2',
				path: 'addHero2Path',
				chain: 8,
				speedValue: 1
			})
		}, 1000)
	}
});


document.addEventListener('stop', function(p){

if(p.detail.obj =='addHero2' && p.detail.graphId =='24') {
	setTimeout(function(){
		pathfinder.moveObjectByChain({
			id: 'addHero2',
			path:'addHero2Path',
			chain: 8,
			speedValue: 1
		})
	}, 1000)
}

if(p.detail.obj =='addHero2' && p.detail.graphId =='25') {
	setTimeout(function(){
		pathfinder.moveObjectByChain({
			id: 'addHero2',
			path:'addHero2Path',
			chain: 0,
			speedValue: 1
		})
	}, 1000)
	}
});

/*
// elephant
document.addEventListener('objectAdded', function(p){
	if(p.detail.obj == 'elephant'){

		setTimeout(function() {
			pathfinder.moveObjectByChain({
				id: 'elephant',
				path: 'endPath',
				chain: 2,
				speedValue: 2
			})

		}, 1000)
	}
});

document.addEventListener('stop', function(p){
	if ( (p.detail.obj == 'elephant') && (p.detail.graphId == '29') ) {
		pathfinder.moveObdjectByChain({
			id: 'elephant',
			path:'elephantPath',
			chain: 0,
			speedValue: 4
		})
	}
})*/

//запуск слона по траекториям
function animateElephant(){
    pathfinder.moveObjectByChain({
        id: 'elephant',
        path: 'endPath',
        chain: 2,
        speedValue: 2,
        callback: function() {
            pathfinder.moveObjectByChain({
                id: 'elephant',
                path:'elephantPath',
                chain: 0,
                speedValue: 4
            });
            pathfinder.moveObjectByChain({
                id: 'elephant',
                path:'elephantPathEnd',
                chain: 0,
                speedValue: 4
            })
        }
    })
}
//когда герой находится рядом, слон должен указать путь
document.addEventListener('objectClick', function(p){
    if(p.detail.obj =='elephant'){
        if ( globals.objects.hero.getPosition().graphId == 23 ){
            //запускаем слона
            animateElephant();
        }
    }
})
//Финальный этап
//Герой дотягивется до дорожного знака
document.addEventListener('objectClick', function(p){
    if(p.detail.obj=='roadSing'){
        if(globals.objects.hero.getPosition().graphId == 28){
            //герой тянется
            globals.object.hero.animate({
                animation:'ReachOut'
            })
            //знак меняется на противоположный
            globals.object.roadSing.animate({
                animation:'roadSing'
            })
            //дверь открывается
            globals.object.doorToTheNextLavel.animate({
                animation:'door'
            })
        }
    }
})
//второй вариант
document.addEventListener('objectClick', function(p){
   if(p.detail.obj=='roadSing'){
       if((globals.objects.hero.path=='ElephantPath')&&(globals.objects.hero.step==1551)){
           globals.objects.hero.animate({
               animation:'ReachOut',
               callback: function(){
                   //знак меняется на противоположный
                   globals.object.roadSing.animate({
                       animation:'roadSing'
                   });
                   //дверь открывается
                   globals.object.doorToTheNextLavel.animate({
                       animation:'door'
                   })
               }
           })
       }
   }
})


/*doorToTheNextLavel*/
document.addEventListener('objectAdded', function(p){
	if(p.detail.obj =='doorToTheNextLavel'){
		globals.objects.doorToTheNextLavel.animate({
			animation: 'door',
			speedValue: 2
		})
	}
});

/*Финал*/
/*
document.addEventListener('objectClick', function(p){
	if((globals.objects.hero.path =='endPath')&&(globals.objects.hero.step == ???)){
		globals.objects.hero.animate({
			animation:'ReachOut'
		})
		/*теперь анимация двери*/
		/*
		globals.objects.doorToTheNextLavel.animate({
			animation: 'door',
			speedValue: 2
		})
	}
})*/
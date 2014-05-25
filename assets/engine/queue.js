/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var queue = (function () {

	var objects = {};

	function processQueue() {
		var removedObjects = [],
			objectPathsLength,
			i, obj;

		// Очистка исполненных объектов
		function removeObjects() {
			for (i = 0; i < removedObjects.length; i++) {
				delete objects[removedObjects[i]];
			}
		}

		// Перебираются все анимируемые объекты (всё, что есть в очереди)
		for (obj in objects) {
			objectPathsLength = objects[obj].length;

			// Если у текущего объекта в очереди есть цепочки анимаций на исполнение,
			// обрабатывается текущая первая из них
			if (objectPathsLength) {

				// Если текущая анимация объекта определна и отличается от заданной,
				// сбросить её — новая анимация подхватится сама
				if ((!!globals.objects[obj].image.state.current) && (objects[obj][0].animation !== globals.objects[obj].image.state.current.name) ) {
					globals.objects[obj].image.state.clearAnimation();
				}

				// Если анимация происходит на месте,
				// просто вызовем метод однократного проигрывания анимации.
				// на время проигрывания анимации выставим временный флаг, предотвращающий исполнение
				// следующих анимаций в очереди, после завершения проигрывания снимем этот флаг
				if (!objects[obj][0].speed) {

					if (!objects[obj][0].playingNow) {
						globals.objects[obj].animate({
							animation: objects[obj][0].animation,
							callback: function () {
								// Сохраняем путь
								globals.objects[obj].path = objects[obj][0].pathId;

								// Если только что завершенная анимация объекта не последняя в его цепочке,
								// значение текущего шага устанавливается на первое из следующей анимации в цепочке
								globals.objects[obj].step = objects[obj][1]
									? objects[obj][1].step
									: globals.objects[obj].step;

								// После завершения исполнения анимации выкинуть её из цепочки объекта
								// а также те идущие непосредственно за ней, если их скорость == 0
								while ( (objects[obj].length) && (!objects[obj][0].speed) ) {
									var oldPath = objects[obj].shift();
								}

								relay.drop({
									obj: obj,
									graphId: graph.getGraphIdByStep({
										path: globals.objects[obj].path,
										step: globals.objects[obj].step
									}),
									type: 'stop'
								});
							}
						});
						objects[obj][0].playingNow = true;
					}

				} else {
					// Анимация происходит поступательно — задана скорость перемещения

					move.setMovement({
						id: obj,
						path: objects[obj][0].pathId,
						chain: objects[obj][0].targetChain,
						animation: objects[obj][0].animation,
						speed: objects[obj][0].speed,
						callback: function () {
							// Если только что завершенная анимация объекта не последняя в его цепочке,
							// значение текущего шага устанавливается на первое из следующей анимации в цепочке
							globals.objects[obj].step = objects[obj][1]
								? objects[obj][1].step
								: globals.objects[obj].step;

							// После завершения исполнения анимации выкинуть её из цепочки объекта
							var objectCallback = objects[obj].callback || function () {},
								oldPath = objects[obj].shift();

							if (!objects[obj].length) {
								// Цепочка анимаций закончилась, нужно остановиться

								if (obj === 'hero') {
									globals.objects[ obj ].image.state.setAnimationByName("stop", false); // STOP
								}

								objectCallback();

								relay.drop({
									obj: obj,
									graphId: graph.getGraphIdByStep({
										path: globals.objects[obj].path,
										step: globals.objects[obj].step
									}),
									type: 'stop'
								});

							} else {
								// Закончилась только текущая анимация, промежуточное сообщение

								relay.drop({
									obj: obj,
									graphId: graph.getGraphIdByStep({
										path: objects[obj][0].pathId,
										step: globals.objects[obj].step
									}),
									type: 'breakpoint'
								});
							}
						}
					});

				}

			} else {
				// Если цепочка анимаций для объекта пустая, добавляем его на вычистку из очереди
				// Удалять будем по завершении цикла всё вместе, поэтому массив
				removedObjects.push(obj);
			}

		}

		// Удалить объекты без цепочек анимаций
		removeObjects();

		// Запустить цикл очереди заново
		requestAnimationFrame( function () {
			processQueue();
		} );
	}

	return {

		// Добавляет анимацию в очередь.
		// Если такой объект уже есть в очереди,
		// добавленная анимация будет выполнена сразу же после уже запланированных для данного объекта.
		// Очередь обрабатывает все анимируемые объекты со скоростью ~ 60 раз в секунду.
		// После того, как цепочка анимаций для объекта полностью выполнена, он автоматически выкидывается из очереди
		//
		// p.objectId
		// p.paths
		addToObjPaths: function ( p ) {
			objects[p.objectId] = p.paths;
			objects[p.objectId].callback = p.callback;

			relay.drop({
				obj: p.objectId,
				graphId: graph.getGraphIdByStep({
					path: globals.objects[ p.objectId ].path,
					step: globals.objects[ p.objectId ].step
				}),
				type: 'start'
			});

			return this;
		},

		// Запускает агент очереди;
		// Агент крутится в фоне и следит за добавлением объектов в очереди
		// Как только в очередь добавляется объект, начинается исполнение его анимации
		startQueue: function () {
			processQueue();

			return this;
		}
	};

}());
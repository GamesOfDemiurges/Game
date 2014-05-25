/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var utils = (function () {

	return {

		getRandomValue: function ( low, high ) {
			var innerLow = high
					? low
					: 0,
				innerHigh = high || low;

			return innerLow + Math.round( Math.random()*(innerHigh-innerLow) );
		},

		// Возвращает Эвклидово расстояния
		//p.x1
		//p.y1
		//p.x2
		//p.y2
		getDistance: function ( p ) {
			var xDistance = p.x2 - p.x1,
				yDistance = p.y2 - p.y1;

			return Math.sqrt( xDistance*xDistance + yDistance*yDistance );
		},

		// Возвращает координаты точку на отрезке
		//p.x1
		//p.y1
		//p.x2
		//p.y2
		//p.t
		getLinePointCoords: function ( p ) {
			return {
				x: (p.x2 - p.x1) * p.t + p.x1,
				y: (p.y2 - p.y1) *  p.t + p.y1
			};
		},

		// Возвращает координаты точки в кривой Безье
		//p.x1
		//p.y1
		//p.ax1
		//p.ay1
		//p.ax2
		//p.ay2
		//p.x2
		//p.y2
		//p.t
		getBezierPointCoords: function ( p ) {
			function polynom(z) {
				var at = (1 - p.t);

				return (at * at * at * z.p0) + (3 * p.t * at * at * z.p1) + (3 * p.t * p.t * at * z.p2) + (p.t * p.t * p.t * z.p3);
			}

			return {
				x: polynom( { p0: p.x1, p1: p.ax1, p2: p.ax2, p3: p.x2 } ),
				y: polynom( { p0: p.y1, p1: p.ay1, p2: p.ay2, p3: p.y2 } )
			};
		},

		// Возвращает позицию управляющих точек на кривой Безье
		//p.x1
		//p.y1
		//p.x2
		//p.y2
		getAdditionalBezierPointsCoords: function ( p ) {
			var a1 = utils.getLinePointCoords({
					x1: p.x1,
					y1: p.y1,
					x2: p.x2,
					y2: p.y2,
					t: 0.3
				}),

				a2 = utils.getLinePointCoords({
					x1: p.x1,
					y1: p.y1,
					x2: p.x2,
					y2: p.y2,
					t: 0.7
				});

			return {
				ax1: a1.x,
				ay1: a1.y,
				ax2: a2.x,
				ay2: a2.y
			};
		},

		// Строит рекурсивно атомарные шаги по заданной кривой Безье длиной не более допустимого расстояния
		//p.x1
		//p.y1
		//p.ax1
		//p.ay1
		//p.ax2
		//p.ay2
		//p.x2
		//p.y2
		//p.t1,
		//p.t2
		buildCurveSteps: function ( p ) {
			// максимально допустимое расстояние в пикселах
			var maxDistance = 1.4,
				path = {},

				// считаем среднюю точку в заданном интервале [t1, t2]
				middleT = p.t1 + (p.t2 - p.t1)/ 2,

				// получаем координаты точек при t = t1, middleT, t2
				pointInT = utils.getBezierPointCoords({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t: middleT
				}),

				pointInT1 = utils.getBezierPointCoords({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t: p.t1
				}),

				pointInT2 = utils.getBezierPointCoords({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t: p.t2
				}),

				// обход дерева слева
				leftDistance = utils.getDistance({
					x1: pointInT1.x,
					y1: pointInT1.y,
					x2: pointInT.x,
					y2: pointInT.y
				}),

				innerLeftSteps, rightDistance, innerRightSteps, keyArr, result, i;

			if ( leftDistance > maxDistance ) {

				// Если можно разбить ветвь дальше, рекурсивно разбиваем
				innerLeftSteps = utils.buildCurveSteps({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t1: p.t1,
					t2: middleT
				});

				// добавляем полученные точки в текущий путь
				for (i in innerLeftSteps) {
					path[i] = innerLeftSteps[i];
				}

			} else {

				// Ветвь нельзя разбить дальше
				// Добавляем полученную точку к пути и возвращаемся обратно по стеку
				path[middleT] = pointInT;
				return path;
			}

			// обход дерева справа
			rightDistance = utils.getDistance({
				x1: pointInT.x,
				y1: pointInT.y,
				x2: pointInT2.x,
				y2: pointInT2.y
			});

			if ( rightDistance >= maxDistance ) {

				// Рекурсивно строим ветку (фактически работает только левый обход)
				innerRightSteps = utils.buildCurveSteps({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t1: middleT,
					t2: p.t2
				});

				// Если ветвь можно разбить, добавляем полученные точки к текущему пути
				for (i in innerRightSteps) {
					path[i] = innerRightSteps[i];
				}
			}

			// Добавим текущую среднюю точку в путь, если её еще там нет
			path[middleT] = {
				x: pointInT.x,
				y: pointInT.y
			};

			// Случай, когда весь путь уже построен
			if ((p.t1 === 0) && (p.t2 === 1)) {

				// Добавляем граничные точки
				path[0] = {
					x: p.x1,
					y: p.y1
				};

				path[1] = {
					x: p.x2,
					y: p.y2
				};

				// Разворачиваем объект в сортированный массив
				keyArr = [];
				result = [];

				for (i in path) {
					keyArr.push(i);
				}

				keyArr = keyArr.sort();

				for (i = 0; i < keyArr.length; i++) {
					result.push(path[keyArr[i]]);
				}

				// Финальный возврат пути в виде массива
				return result;
			}

			// Рекурсивный возврат пути
			return path;
		},

		// Генерирует управляющий контур для траектории
		// p.pathId
		buildControlPoligon: function ( p ) {

			var touchRadiusDistance = 100,
				currentPath = globals.paths[p.pathId],
				controlPath = [],
				lastPoint = 0,
				distance, startTouchPoint, i;

			for (i = 0; i < currentPath.steps.length; i++) {

				distance = utils.getDistance({
					x1: currentPath.steps[lastPoint].x,
					y1: currentPath.steps[lastPoint].y,
					x2: currentPath.steps[i].x,
					y2: currentPath.steps[i].y
				});

				if (distance > touchRadiusDistance) {

					// создание
					startTouchPoint = {
						x: currentPath.steps[lastPoint].x - (touchRadiusDistance/2),
						y: currentPath.steps[lastPoint].y - (touchRadiusDistance/2)
					};

					controlPath.push({
						rect: new PIXI.Rectangle(startTouchPoint.x, startTouchPoint.y, touchRadiusDistance, touchRadiusDistance),
						step: lastPoint
					});

					lastPoint = i;
				}
			}

			startTouchPoint = {
				x: currentPath.steps[lastPoint].x - (touchRadiusDistance/2),
				y: currentPath.steps[lastPoint].y - (touchRadiusDistance/2)
			};

			// создание
			controlPath.push({
				rect: new PIXI.Rectangle(startTouchPoint.x, startTouchPoint.y, currentPath.steps[currentPath.steps.length-1].x - startTouchPoint.x+ (touchRadiusDistance/2), currentPath.steps[currentPath.steps.length-1].y - startTouchPoint.y + (touchRadiusDistance/2)),
				step: (currentPath.steps.length-1)
			});

			currentPath.controlPath = controlPath;
		},

		processPaths: function ( p ) {
			var callback = p
					? p.callback || function () {}
					: function () {},
				path, stepsArray, i, j;

			for (path in globals.paths) {
				if (globals.paths[path].dots.length) {

					globals.paths[path].steps = [];
					for (i = 1; i < globals.paths[path].dots.length; i++) {

						stepsArray = utils.buildCurveSteps({
							x1: globals.paths[path].dots[i-1].mainHandle.x,
							y1: globals.paths[path].dots[i-1].mainHandle.y,
							ax1: globals.paths[path].dots[i-1].nextHandle.x,
							ay1: globals.paths[path].dots[i-1].nextHandle.y,
							ax2: globals.paths[path].dots[i].prevHandle.x,
							ay2: globals.paths[path].dots[i].prevHandle.y,
							x2: globals.paths[path].dots[i].mainHandle.x,
							y2: globals.paths[path].dots[i].mainHandle.y,
							t1: 0,
							t2: 1
						});

						for (j = 0; j < stepsArray.length; j++) {
							globals.paths[path].steps.push({
								x: stepsArray[j].x,
								y: stepsArray[j].y
							});
						}
					}

					// генерация управляющей области
					if (globals.paths[path].steps.length) {
						utils.buildControlPoligon({
							pathId: path
						});
					}

				}

			}

			callback();

		},

		fadeIn: function () {
			document.querySelector('.black-fade').className += ' black-fade_active';
		},

		fadeOut: function () {
			document.querySelector('.black-fade').className = document.querySelector('.black-fade').className.replace(/\sblack-fade_active/ig, '');
		}
	};

}());






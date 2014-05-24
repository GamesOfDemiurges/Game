var pathfinder = (function() {

	// Прохождение по массиву путей
	// У промежуточных путей targetChain считается конечной точкой,
	// у последнего пути — берется из параметра
	function processPaths( p ) {
		var servicePoints,
			step = p.currentObject.step,
			resultPath = [];

		function getAnimation( p ) {
			var resultAnimation = {
				animation: p.animation,
				speed: p.speed
			}

			// Приоритет анимаций —
			// 1. Задана явно
			// 2. Взята из параметров траектории для этого объкта
			// 3. Первая анимация из всех доступных для этого объекта
			resultAnimation.animation = resultAnimation.animation || (globals.paths[ p.pathId ].objects && globals.paths[ p.pathId ].objects[ p.obj ] && globals.paths[ p.pathId ].objects[ p.obj ].animation) || globals.objects[ p.obj ].image.spineData.animations[0].name;
			resultAnimation.speed = resultAnimation.speed || (globals.paths[ p.pathId ].objects && globals.paths[ p.pathId ].objects[ p.obj ] && globals.paths[ p.pathId ].objects[ p.obj ].speed) || 0;

			return resultAnimation;
		}

		// Вычисляет целевой targetChain на промежуточных путях, а также шаг,
		// возникающий после достижения этого targetChain
		function getServicePoint(path0, path1) {
			var serviceChain,
				serviceStep;

			var path0point1 = {
				x: globals.paths[ path0 ].dots[0].mainHandle.x,
				y: globals.paths[ path0 ].dots[0].mainHandle.y
			}

			var path0point2 = {
				x: globals.paths[ path0 ].dots[ globals.paths[ path0 ].dots.length-1 ].mainHandle.x,
				y: globals.paths[ path0 ].dots[ globals.paths[ path0 ].dots.length-1 ].mainHandle.y
			}

			var path1point1 = {
				x: globals.paths[ path1 ].dots[0].mainHandle.x,
				y: globals.paths[ path1 ].dots[0].mainHandle.y,
			}

			var path1point2 = {
				x: globals.paths[ path1 ].dots[ globals.paths[ path1 ].dots.length-1 ].mainHandle.x,
				y: globals.paths[ path1 ].dots[ globals.paths[ path1 ].dots.length-1 ].mainHandle.y
			}

			if ( (path0point1.x == path1point1.x) && (path0point1.y == path1point1.y) ) {
				serviceChain = 0;
				serviceStep = 0;
			}

			if ( (path0point1.x == path1point2.x) && (path0point1.y == path1point2.y) ) {
				serviceChain = 0;
				serviceStep = globals.paths[ path1 ].steps.length;
			}

			if ( (path0point2.x == path1point1.x) && (path0point2.y == path1point1.y) ) {
				serviceChain = globals.paths[ path0 ].controlPath.length-1;
				serviceStep = 0;
			}

			if ( (path0point2.x == path1point2.x) && (path0point2.y == path1point2.y) ) {
				serviceChain = globals.paths[ path0 ].controlPath.length-1;
				serviceStep = globals.paths[ path1 ].steps.length;
			}

			return {
				serviceChain: serviceChain,
				serviceStep: serviceStep
			}
		}

		if (p.pathArray.length > 1) {
			for (var i = 1; i < p.pathArray.length; i++) {
				var pathId = p.pathArray[i-1],
					objectAnimation = getAnimation({
						obj: p.currentObject.id,
						pathId: pathId,
						animation: p.animationName,
						speed: p.speedValue
					});

				servicePoints = getServicePoint( p.pathArray[i-1], p.pathArray[i] );

				resultPath.push({
					pathId: pathId,
					targetChain: servicePoints.serviceChain,
					animation: objectAnimation.animation,
					speed: objectAnimation.speed,
					step: step
				})

				step = servicePoints.serviceStep;
			}
		}

		var pathId = p.pathArray[ p.pathArray.length-1 ],
			objectAnimation = getAnimation({
				obj: p.currentObject.id,
				pathId: pathId,
				animation: p.animationName,
				speed: p.speedValue
			});

		resultPath.push({
			pathId: pathId,
			targetChain: p.targetChain,
			animation: objectAnimation.animation,
			speed: objectAnimation.speed,
			step: step
		});

		queue.addToObjPaths({
			objectId: p.currentObject.id,
			paths: resultPath,
			callback: p.callback
		})
	}

	function buildPathArray( p ) {
		// Построение списка путей, необходимых для достижения конечной вершины графа
		if ( p.resultPath.graphIdEnd == null) return false;
		var targetPath = globals.graph[ p.resultPath.graphIdStart].targets[ p.resultPath.graphIdEnd],
			pathArray = [];

		for (var pathSteps = 1; pathSteps < targetPath.path.length; pathSteps++ ) {
			pathArray.push(globals.graph[ targetPath.path[pathSteps-1] ].targets[ targetPath.path[pathSteps] ].pathName );
		}

		pathArray.push( p.resultPath.path);

		if (pathArray[0] !==  p.currentObject.path) {
			pathArray.unshift( p.currentObject.path );
		}

		processPaths( {
			pathArray: pathArray,
			targetChain: p.resultPath.chain,
			currentObject: p.currentObject,
			animationName: p.animationName,
			speedValue: p.speedValue,
			callback: p.callback
		} );
	}

	function findPathToChain( p ) {
		if (!p.currentObject || !globals.paths[p.path] || !globals.paths[ p.currentObject.path ]) return false;

		var path = p.path,
			chain = p.chain,
			currentObject = p.currentObject,

			// Предполагаем, что у искомого пути от объекта до заданной точки в исходном (худшем) состоянии
			// бесконечное число шагов, начальная и конечная вершина графа не определены
			resultPath = p.resultPath || { steps: Number.POSITIVE_INFINITY, graphIdStart: null, graphIdEnd: null },

			candidatePath = [
				{
					steps: globals.paths[path].controlPath[chain].step,
					graphId: globals.paths[path].dots[0].graphId
				},
				{
					steps: globals.paths[path].steps.length - globals.paths[path].controlPath[chain].step,
					graphId: globals.paths[path].dots[ globals.paths[path].dots.length-1 ].graphId
				}
			],

			minPath = {
				steps: Number.POSITIVE_INFINITY,
				graphIdStart: null,
				graphIdEnd: null
			},

			// Отражает количество шагов от объекта до ближайших двух вершин графа
			currentPath = [
				{
					steps: currentObject.step,
					graphId: globals.paths[ currentObject.path ].dots[0].graphId
				},
				{
					steps: globals.paths[ currentObject.path ].steps.length - currentObject.step,
					graphId: globals.paths[ currentObject.path ].dots[ globals.paths[ currentObject.path ].dots.length-1 ].graphId
				}
			];

		// Пары кратчайших путей (2*2)
		for (var currentPathVar = 0 ; currentPathVar < 2; currentPathVar++) {
			for (var candidatePathVar = 0 ; candidatePathVar < 2; candidatePathVar++) {

				var tDistance = currentPath[currentPathVar].steps +
					candidatePath[candidatePathVar].steps +
					globals.graph[ currentPath[currentPathVar].graphId ].targets[ candidatePath[candidatePathVar].graphId ].distance;

				if ( (tDistance) < minPath.steps ) {

					minPath = {
						steps: tDistance,
						graphIdStart: currentPath[currentPathVar].graphId,
						graphIdEnd: candidatePath[candidatePathVar].graphId
					}
				}

			}
		}

		// Сохраняется путь с минимальным числом шагов
		if ( resultPath.steps > minPath.steps ) {

			return {
				steps: minPath.steps,
				graphIdStart: minPath.graphIdStart,
				graphIdEnd: minPath.graphIdEnd,
				path: path,
				chain: chain
			}
		} else {
			return resultPath;
		}
	}

	/**
	* Перемещает объект точку, заданную координатами клика
	* @param
	*/
	function moveObjectByCoords( p ) {
		var currentObject = globals.objects[p.id];
		if (!currentObject) return false;

		// Анимации для перемещения
		/* var animations = globals.hero.image.state.data.skeletonData.animations,
			animationName = 'new';*/

		// Скорость перехода между анимациями
		//globals.hero.image.stateData.setMixByName("new", "stop", 0.8);

		// Поиск шага, сопоставленного с областью клика

		var resultPath = {};

		// перебрать все траектории, понять, на которых из них может лежать целевая точка
		for (path in globals.paths) {
			if ( !globals.paths[path].controlPath || globals.paths[path].breakpath ) continue;

			for (var chain = 0; chain < globals.paths[path].controlPath.length; chain++) {
				if (globals.paths[path].controlPath[chain].rect.contains( p.x * globals.scale, p.y * globals.scale )) {

					// Поиск ближайшей вершины графа из попадающих в область клика
					resultPath = JSON.parse(JSON.stringify(findPathToChain( {
						currentObject: currentObject,
						path: path,
						chain: chain
					})));
				}
			}
		}

		buildPathArray( {
			resultPath: resultPath,
			currentObject: currentObject
		} )
	}

	function moveObjectByChain( p ) {
		var currentObject = globals.objects[p.id];
		if (!currentObject) return false;

		var resultPath = findPathToChain( {
				currentObject: currentObject,
				path: p.path,
				chain: p.chain
			} );

		buildPathArray( {
			resultPath: resultPath,
			currentObject: currentObject,
			animationName: p.animationName,
			speedValue: p.speedValue,
			callback: p.callback
		} )
	}

	function attachPathFinderListeners() {

		if ('ontouchend' in document) {

			window.addEventListener('touchend', function(e) {
				if (globals.objectClicked || globals.viewport.resize) {
					globals.objectClicked = false;
					globals.viewport.resize = false;
					return false;
				}

				if (globals.preventClick) {
					return false;
				}

				moveObjectByCoords({
					id: 'hero',
					x: (e.changedTouches[0].pageX - (scene.playGround.position.x / globals.scale)) / globals.viewport.scale ,
					y: (e.changedTouches[0].pageY - (scene.playGround.position.y / globals.scale)) / globals.viewport.scale
				})
			})

		} else {

			window.addEventListener('click', function(e) {
				if (globals.objectClicked || globals.viewport.resize) {
					globals.objectClicked = false;
					globals.viewport.resize = false;
					return false;
				}

				if (globals.preventClick) {
					return false;
				}

				moveObjectByCoords({
					id: 'hero',
					x: (e.pageX - (scene.playGround.position.x / globals.scale)) / globals.viewport.scale,
					y: (e.pageY - (scene.playGround.position.y / globals.scale)) / globals.viewport.scale
				})


			})

		}

	}

	return {
		start: function() {
			attachPathFinderListeners();
		},

		// p.id
		// p.path
		// p.chain
		moveObjectByChain: function( p ) {
			moveObjectByChain( p );
		}
	}

})();



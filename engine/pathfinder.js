var pathfinder = (function() {
	var paths,
		hero;

	// Движение объекта
	var movement = {
		current: false,
		switchFx: false,
		fx: null,
		noCallback: false
	};

	// Движение модели до заданного шага
	// p.direction
	// p.speed
	// p.targetStep
	function move( p ) {

		var currentPath = p.currentPath,
			callback = p.callback || function() {};

		// Объект пришел в конечную точку (возможно, конечную точку промежуточной траектории)
		if (Math.abs(hero.step - p.targetStep) < p.speed) {
			hero.image.state.setAnimationByName("stop", false);
			movement.current = false;
			callback();
			return;
		}

		// Событие переключения направления движения
		if (movement.switchFx) {
			movement.switchFx = false;
			movement.fx();
			if (!movement.noCallback) {
				callback();
			}
			movement.noCallback = false;
			return;
		}

		// Анимация запукается циклически
		if (hero.image.state.isComplete()) {
			hero.image.state.setAnimationByName( animationName , false);
		}

		// Флаг того, что объект сейчас в движении
		movement.current = true;

		hero.step = hero.step + p.direction * p.speed;

		// Если возникла ошибка в перемещении, останавливаемся
		if (currentPath.steps[ hero.step ] === undefined) {
			hero.image.state.setAnimationByName("stop", false);
			movement.current = false;
			callback();
			return;
		}

		hero.move({
			x: currentPath.steps[ hero.step ].x,
			y: currentPath.steps[ hero.step ].y,
		})

		// Рекурсивное достижение точки
		requestAnimationFrame( function() {
			move({
				currentPath: currentPath,
				direction: p.direction,
				speed: p.speed,
				targetStep: p.targetStep,
				callback: p.callback
			});
		} );
	}

	// Запуск движения модели к заданному шагу
	function processControlPoint( p ) {

		var modelStep = hero.step,
			currentPath = paths[ p.pathName ],
			targetStep = currentPath.controlPath[ p.chain ].step,
			callback = p.callback || function() {};

		if (modelStep == targetStep ) {
			callback();
			return;
		}

		// Направление движения
		var stepDirection = currentPath.controlPath[ p.chain ].step - hero.step;
		stepDirection != 0
			? stepDirection = stepDirection / Math.abs(stepDirection)
			: false;

		// включили анимацию перед движением
		hero.image.state.setAnimationByName( animationName , false);

		if (!movement.current) {
			move({
				currentPath: currentPath,
				direction: stepDirection,
				speed: 2,
				targetStep: targetStep,
				callback: callback
			})

		} else {
			movement = {
				switchFx: true,
				fx: function() {
					move({
						currentPath: currentPath,
						direction: stepDirection,
						speed: 2,
						targetStep: targetStep,
						callback: callback
					})
				}
			}
		}
	}

	// Прохождение по массиву путей
	// У промежуточных путей targetChain считается конечной точкой,
	// у последнего пути — берется из параметра
	function processPaths( pathArray, targetChain ) {
		var servicePoints;

		// Вычисляет целевой targetChain на промежуточных путях, а также шаг,
		// возникающий после достижения этого targetChain
		function getServicePoint(path0, path1) {
			var serviceChain,
				serviceStep;

			var path0point1 = {
				x: paths[ path0 ].dots[0].mainHandle.x,
				y: paths[ path0 ].dots[0].mainHandle.y
			}

			var path0point2 = {
				x: paths[ path0 ].dots[ paths[ path0 ].dots.length-1 ].mainHandle.x,
				y: paths[ path0 ].dots[ paths[ path0 ].dots.length-1 ].mainHandle.y
			}

			var path1point1 = {
				x: paths[ path1 ].dots[0].mainHandle.x,
				y: paths[ path1 ].dots[0].mainHandle.y,
			}

			var path1point2 = {
				x: paths[ path1 ].dots[ paths[ path1 ].dots.length-1 ].mainHandle.x,
				y: paths[ path1 ].dots[ paths[ path1 ].dots.length-1 ].mainHandle.y
			}

			if ( (path0point1.x == path1point1.x) && (path0point1.y == path1point1.y) ) {
				serviceChain = 0;
				serviceStep = 0;
			}

			if ( (path0point1.x == path1point2.x) && (path0point1.y == path1point2.y) ) {
				serviceChain = 0;
				serviceStep = paths[ path1 ].steps.length;
			}

			if ( (path0point2.x == path1point1.x) && (path0point2.y == path1point1.y) ) {
				serviceChain = paths[ path0 ].controlPath.length-1;
				serviceStep = 0;
			}

			if ( (path0point2.x == path1point2.x) && (path0point2.y == path1point2.y) ) {
				serviceChain = paths[ path0 ].controlPath.length-1;
				serviceStep = paths[ path1 ].steps.length;
			}

			return {
				serviceChain: serviceChain,
				serviceStep: serviceStep
			}
		}

		// Если есть промежуточные пути
		if (pathArray.length > 1) {

			servicePoints = getServicePoint( pathArray[0], pathArray[1] );

			processControlPoint({
				pathName: pathArray[0],
				chain: servicePoints.serviceChain,
				callback: function() {
					// По завершению перехода переключиться на следующий путь
					// установить новое значения шага
					hero.path = pathArray[1];
					hero.step = servicePoints.serviceStep;

					var trash = pathArray.shift();
					processPaths( pathArray, targetChain );
				}
			});
			movement.current = true;
		} else {
			// Промежуточных путей нет
			processControlPoint({
				pathName: pathArray[0],
				chain: targetChain
			});
		}
	}


	/**
	* Перемещает объект точку, заданную координатами клика
	* @param {Event} e
	*/
	function moveHero(e) {
		if (hero === undefined) return false;

		// Анимации для перемещения
		var animations = hero.image.state.data.skeletonData.animations,
			animationName = 'new';

		// Скорость перехода между анимациями
		hero.image.stateData.setMixByName("new", "stop", 0.8);

		// Поиск шага, сопоставленного с областью клика



		// Отражает количество шагов от объекта до ближайших двух вершин графа
		var currentPath = [
			{
				steps: hero.step,
				graphId: paths[ hero.path ].dots[0].graphId
			},
			{
				steps: paths[ hero.path ].steps.length - hero.step,
				graphId: paths[ hero.path ].dots[ paths[ hero.path ].dots.length-1 ].graphId
			}
		];

		// Предполагаем, что у искомого пути от объекта до заданной точки в исходном (худшем) состоянии
		// бесконечное число шагов, начальная и конечная вершина графа не определены
		var resultPath = {
			steps: Number.POSITIVE_INFINITY,
			graphIdStart: null,
			graphIdEnd: null
		}

		// перебрать все траектории, понять, на которых из них может лежать целевая точка
		for (path in paths) {
			for (var chain = 0; chain < paths[path].controlPath.length; chain++) {
				if (paths[path].controlPath[chain].rect.contains( targetX * scale, targetY * scale )) {

					// Поиск ближайшей вершины графа из попадающих в область клика
					var	candidatePath = [
						{
							steps: paths[path].controlPath[chain].step,
							graphId: paths[path].dots[0].graphId
						},
						{
							steps: paths[path].steps.length - paths[path].controlPath[chain].step,
							graphId: paths[path].dots[ paths[path].dots.length-1 ].graphId
						}
					]

					var minPath = {
						steps: Number.POSITIVE_INFINITY,
						graphIdStart: null,
						graphIdEnd: null
					}

					// Пары кратчайших путей (2*2)
					for (var currentPathVar = 0 ; currentPathVar < 2; currentPathVar++) {
						for (var candidatePathVar = 0 ; candidatePathVar < 2; candidatePathVar++) {

							var tDistance = currentPath[currentPathVar].steps +
								candidatePath[candidatePathVar].steps +
								graph[ currentPath[currentPathVar].graphId ].targets[ candidatePath[candidatePathVar].graphId ].distance;

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

						resultPath = {
							steps: minPath.steps,
							graphIdStart: minPath.graphIdStart,
							graphIdEnd: minPath.graphIdEnd,
							path: path,
							chain: chain
						}
					}
				}
			}
		}

		// Построение списка путей, необходимых для достижения конечной вершины графа
		if (resultPath.graphIdEnd == null) return false;
		var targetPath = graph[resultPath.graphIdStart].targets[resultPath.graphIdEnd],
			pathArray = [];

		for (var pathSteps = 1; pathSteps < targetPath.path.length; pathSteps++ ) {
			pathArray.push(graph[ targetPath.path[pathSteps-1] ].targets[ targetPath.path[pathSteps] ].pathName );
		}

		pathArray.push( resultPath.path );

		if (pathArray[0] !== hero.path) {
			pathArray.unshift(hero.path);
		}

		// Если в момент клика объект движется, нужно прервать движение и запустить просчет
		// графа с текущей точки
		if (movement.current) {
			movement = {
				switchFx: true,
				noCallback: true,
				fx: function() {
					processPaths(pathArray, resultPath.chain);
				}
			}
		} else {
			processPaths(pathArray, resultPath.chain);
		}

	}

	function attachPathFinderListeners() {
		document.body.addEventListener('click', function(e) {
			moveHero({
				x: e.pageX,
				y: e.pageY
			})
		})

		document.body.addEventListener('touchend', function(e) {
			moveHero({
				x: e.changedTouches[0].pageX,
				y: e.changedTouches[0].pageY
			})
		})
	}

	return {
		start: function() {
			paths = globals.paths;
			hero = globals.hero;

			attachPathFinderListeners();
		}
	}

})();



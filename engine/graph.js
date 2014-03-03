var graph = (function() {

	var serviceGraph,
		adjacencyMatrix;

	function makeIdByCoords(x, y) {

		return Math.round(x).toString() + '_' + Math.round(y).toString();
	}

	// Добаввляет данные в структуру ServiceGraph, отражающую связь между вершинами графа, определенных координатами
	// таким образом, две вершины разных отрезков, располашающихся в одной точке, образуют одну вершину
	function addToGraph(pathName, linkToPathPoint1, linkToPathPoint2, point1, point2, distance) {

		// Если таких координат еще вообще нет, создаем структуру данных
		if ( serviceGraph[point1] === undefined ) {
			serviceGraph[point1] = {
				link: {}
			};
		}

		// Поле link содержит информацию, каким путям принадлежит эта вершина.
		// Если записи о принадлежности для заданного пути нет, создать
		if (serviceGraph[point1].link[pathName] === undefined  ) {
			serviceGraph[point1].link[pathName] = linkToPathPoint1;
		}

		// Аналогично для второй вершины
		if ( serviceGraph[point2] === undefined ) {
			serviceGraph[point2] = {
				link: {}
			};
		}

		if (serviceGraph[point2].link[pathName] === undefined  ) {
			serviceGraph[point2].link[pathName] = linkToPathPoint2;
		}

		// Если нет информации о связи данных двух вершин, создать
		// записывается расстояние между ними и имя пути (id)
		if ( serviceGraph[point1][point2] === undefined ) {
			serviceGraph[point1][point2] = {
				distance: distance,
				path: pathName
			}
		}

		// В обратную сторону путь тоже идет
		if ( serviceGraph[point2][point1] === undefined ) {
			serviceGraph[point2][point1] = {
				distance: distance,
				path: pathName
			}
		}
	}

	// Вычисление кратчайшей дистанции
	function calculateShortestDistance() {
		var n = adjacencyMatrix[0].length;

		for (var k = 0; k < n; k++) {
			for (var i = 0; i < n; i++) {
				for (var j = 0; j < n; j++) {

					// Если суммарное расстояние кандидатов при разбиении меньше, чем текущий путь,
					// значение дистанции текущего пути перезаписывается суммой расстояний,
					if (adjacencyMatrix[i][j].distance > (adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance) ) {
						adjacencyMatrix[i][j].distance = adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance;

						// запишем составные части пути заново — для первого кандидата и второго
						adjacencyMatrix[i][j].path = [];

						// для текущего поля матрицы записывается массив кратчайших путей
						for (var e1 = 0; e1 < adjacencyMatrix[i][k].path.length; e1++) {
							adjacencyMatrix[i][j].path.push( adjacencyMatrix[i][k].path[e1] );
						}

						// с единицы — чтобы не дублировать точку пересечения
						for (var e2 = 1; e2 < adjacencyMatrix[k][j].path.length; e2++) {
							adjacencyMatrix[i][j].path.push( adjacencyMatrix[k][j].path[e2] );
						}
					}

				}
			}
		}
	}

	// Построение матрицы достижимости
	function buildAdjacencyMatrix( p ) {
		var reference = [],
			callback = p.callback || function() {};

		// Пересобираем объект в массив, потому что нам важен порядок их следования для построения матрицы достижимости
		for (var point in serviceGraph) {
			reference.push(point);
		}

		// Матрица двумерна, создаем
		adjacencyMatrix = new Array(reference.length);

		for (var i = 0; i < reference.length; i++) {
			adjacencyMatrix[i] = new Array(reference.length);

			for (var j = 0; j < reference.length; j++) {

				// Если расстояние между вершинами существует и не равно 0, берем его
				// Если расстояние равно нулю (одна и та же вершина), это нужно записать отдельно
				// Если расстояние неизвестно, приравниваем его к бесконечности
				var distance = (serviceGraph[ reference[i] ][ reference[j] ])
					? serviceGraph[ reference[i] ][ reference[j] ].distance
					: (i == j)
						? 0
						: Number.POSITIVE_INFINITY;

				// Если вершина не одна и та же, запишем путь как пару вершин
				var path = (distance)
					? [i, j]
					: [];

				// При инициализации матрицы для каждой пары вершин укажем расстояние
				adjacencyMatrix[i][j] = {
					path: path,
					distance: distance
				}
			}
		}

		// После инициализации посчитали кратчайшие расстояния
		calculateShortestDistance();

		// Записываем результат работы в граф так, чтобы каждая вершина имела информацию о том,
		// с кем она связана, на каком расстоянии и как достичь одну вершину из другой
		for (var point = 0; point < reference.length; point++) {

			globals.graph[point] = {
				targets: {},
				links: {}
			}

			for (var linkId in serviceGraph[ reference[point] ].link) {

				serviceGraph[ reference[point] ].link[linkId].graphId = point;

				globals.graph[point].links[linkId] = serviceGraph[ reference[point] ].link[linkId];

				for (var otherId = 0; otherId < reference.length; otherId++) {
					//console.log(reference[point], reference[otherId]);
					var pathName = (serviceGraph[ reference[point] ][ reference[otherId] ] !== undefined)
						? serviceGraph[ reference[point] ][ reference[otherId] ].path
						: false;

					globals.graph[point].targets[ otherId ] = {
						distance: adjacencyMatrix[point][otherId].distance,
						path: [],
						pathName: pathName
					}

					for (var graphPath = 0; graphPath < adjacencyMatrix[point][otherId].path.length; graphPath++) {
						globals.graph[point].targets[otherId].path.push( adjacencyMatrix[point][otherId].path[graphPath] );
					}
				}


			}
		}

		callback();
	}


	return {
		// Строит граф
		buildGraph: function( p ) {

			globals.graph = {},
			serviceGraph = {},
			adjacencyMatrix = {};

			for (var path in globals.paths) {
				var point1 = globals.paths[path].dots[0].mainHandle;
				var point2 = globals.paths[path].dots[ globals.paths[path].dots.length-1 ].mainHandle;
				var distance = (globals.paths[path].breakpath)
					? Number.POSITIVE_INFINITY
					: globals.paths[path].steps.length;

				addToGraph(path, globals.paths[path].dots[0], globals.paths[path].dots[ globals.paths[path].dots.length-1 ], makeIdByCoords(point1.x, point1.y), makeIdByCoords(point2.x, point2.y), distance);
			}

			buildAdjacencyMatrix( p );
		},

		// Просто выводит матрицу достижимости
		getAdjacencyMatrix: function() {

			return adjacencyMatrix;
		},

		// Отдает вершину графа, если совпадает с заданным шагом
		getGraphIdByStep: function( p ) {

			if (p.step < 5) {
				return globals.paths[p.path].dots[ 0 ].graphId;
			} else if ( (globals.paths[p.path].steps.length-1) - p.step < 5  ) {
				return globals.paths[p.path].dots[ globals.paths[p.path].dots.length-1 ].graphId;
			} else {
				return undefined;
			}
		}
	}
})();
var graph = (function() {

	var serviceGraph = {},
		adjacencyMatrix,
		paths;

	function makeIdByCoords(x, y) {

		return Math.round(x).toString() + '_' + Math.round(y).toString();
	}

	function addToGraph(pathName, linkToPathPoint1, linkToPathPoint2, point1, point2, distance) {

		if ( serviceGraph[point1] === undefined ) {
			serviceGraph[point1] = {
				link: {}
			};
		}

		if (serviceGraph[point1].link[path] === undefined  ) {
			serviceGraph[point1].link[path] = linkToPathPoint1;
		}

		if ( serviceGraph[point2] === undefined ) {
			serviceGraph[point2] = {
				link: {}
			};
		}

		if (serviceGraph[point2].link[path] === undefined  ) {
			serviceGraph[point2].link[path] = linkToPathPoint2;
		}

		if ( serviceGraph[point1][point2] === undefined ) {
			serviceGraph[point1][point2] = {
				distance: distance,
				path: pathName
			}
		}

		if ( serviceGraph[point2][point1] === undefined ) {
			serviceGraph[point2][point1] = {
				distance: distance,
				path: pathName
			}
		}
	}

	function calculateShortestDistance() {
		var n = adjacencyMatrix[0].length;

		for (var k = 0; k < n; k++) {
			for (var i = 0; i < n; i++) {
				for (var j = 0; j < n; j++) {

					if (adjacencyMatrix[i][j].distance > (adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance) ) {
						adjacencyMatrix[i][j].distance = adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance;


						adjacencyMatrix[i][j].path = [];

						for (var e1 = 0; e1 < adjacencyMatrix[i][k].path.length; e1++) {
							adjacencyMatrix[i][j].path.push( adjacencyMatrix[i][k].path[e1] );
						}

						for (var e2 = 1; e2 < adjacencyMatrix[k][j].path.length; e2++) {
							adjacencyMatrix[i][j].path.push( adjacencyMatrix[k][j].path[e2] );
						}
					}

				}
			}
		}
	}

	function buildAdjacencyMatrix( p ) {
		var reference = [],
			callback = p.callback || function() {};

		for (var point in serviceGraph) {
			reference.push(point);
		}

		//visualizeGraph(reference);

		adjacencyMatrix = new Array(reference.length);

		for (var i = 0; i < reference.length; i++) {
			adjacencyMatrix[i] = new Array(reference.length);

			for (var j = 0; j < reference.length; j++) {
				var distance = (serviceGraph[ reference[i] ][ reference[j] ])
					? serviceGraph[ reference[i] ][ reference[j] ].distance
					: (i == j)
						? 0
						: Number.POSITIVE_INFINITY;

				var path = (distance)
					? [i, j]
					: [];

				adjacencyMatrix[i][j] = {
					path: path,
					distance: distance
				}
			}
		}

		calculateShortestDistance();

		for (var point = 0; point < reference.length; point++) {

			global.graph[point] = {
				targets: {},
				links: {}
			}

			for (var linkId in serviceGraph[ reference[point] ].link) {

				serviceGraph[ reference[point] ].link[linkId].graphId = point;

				global.graph[point].links[linkId] = serviceGraph[ reference[point] ].link[linkId];

				for (var otherId = 0; otherId < reference.length; otherId++) {
					//console.log(reference[point], reference[otherId]);
					var pathName = (serviceGraph[ reference[point] ][ reference[otherId] ] !== undefined)
						? serviceGraph[ reference[point] ][ reference[otherId] ].path
						: false;

					global.graph[point].targets[ otherId ] = {
						distance: adjacencyMatrix[point][otherId].distance,
						path: [],
						pathName: pathName
					}

					for (var graphPath = 0; graphPath < adjacencyMatrix[point][otherId].path.length; graphPath++) {
						global.graph[point].targets[otherId].path.push( adjacencyMatrix[point][otherId].path[graphPath] );
					}
				}


			}
		}

		callback();
	}


	return {
		buildGraph: function( p ) {
			paths = globals.paths;
// тут уже нужен результат генерации шагов
			for (var path in paths) {
				var point1 = paths[path].dots[0].mainHandle;
				var point2 = paths[path].dots[ paths[path].dots.length-1 ].mainHandle;
				var distance = paths[path].steps.length;

				addToGraph(path, paths[path].dots[0], paths[path].dots[ paths[path].dots.length-1 ], makeIdByCoords(point1.x, point1.y), makeIdByCoords(point2.x, point2.y), distance);
			}

			buildAdjacencyMatrix( p );
		}
	}
})();
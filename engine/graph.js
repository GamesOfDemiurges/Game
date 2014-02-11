var graph = (function() {

	var serviceGraph,
		adjacencyMatrix;

	function makeIdByCoords(x, y) {

		return Math.round(x).toString() + '_' + Math.round(y).toString();
	}

	function addToGraph(pathName, linkToPathPoint1, linkToPathPoint2, point1, point2, distance) {

		if ( serviceGraph[point1] === undefined ) {
			serviceGraph[point1] = {
				link: {}
			};
		}

		if (serviceGraph[point1].link[pathName] === undefined  ) {
			serviceGraph[point1].link[pathName] = linkToPathPoint1;
		}

		if ( serviceGraph[point2] === undefined ) {
			serviceGraph[point2] = {
				link: {}
			};
		}

		if (serviceGraph[point2].link[pathName] === undefined  ) {
			serviceGraph[point2].link[pathName] = linkToPathPoint2;
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
		buildGraph: function( p ) {

			globals.graph = {},
			serviceGraph = {},
			adjacencyMatrix = {};

			for (var path in globals.paths) {
				var point1 = globals.paths[path].dots[0].mainHandle;
				var point2 = globals.paths[path].dots[ globals.paths[path].dots.length-1 ].mainHandle;
				var distance = globals.paths[path].steps.length;

				addToGraph(path, globals.paths[path].dots[0], globals.paths[path].dots[ globals.paths[path].dots.length-1 ], makeIdByCoords(point1.x, point1.y), makeIdByCoords(point2.x, point2.y), distance);
			}

			buildAdjacencyMatrix( p );
		},

		getAdjacencyMatrix: function() {

			return adjacencyMatrix;
		}
	}
})();
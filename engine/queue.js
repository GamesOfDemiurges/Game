var queue = (function() {

	var objects = {};

	function processQueue() {
		var removedObjects = [];

		function removeObjects() {
			for (var i = 0; i < removedObjects.length; i++) {
				delete objects[removedObjects[i]];
			}
		}

		for (var obj in objects) {
			var objectPathsLength = objects[obj].length;

			if (objectPathsLength) {
				move.setMovement({
					id: obj,
					path: objects[obj][0].pathId,
					chain: objects[obj][0].targetChain,
					animation: objects[obj][0].animation || 'new',
					speed: objects[obj][0].speed || 1,
					callback: function() {
						globals.objects[obj].step = objects[obj][1]
							? objects[obj][1].step
							: globals.objects[obj].step;

						var oldPath = objects[obj].shift();

						if (!objects[obj].length) {
							globals.objects[ obj ].image.state.setAnimationByName("stop", false);

							relay.drop({
								obj: obj,
								graphId: graph.getGraphIdByStep({
									path: globals.objects[obj].path,
									step: globals.objects[obj].step
								}),
								type: 'stop'
							});

						} else {
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
				})

			} else {
				removedObjects.push(obj);
			}

		}

		removeObjects();

		requestAnimationFrame( function() {
			processQueue();
		} );
	}

	return {

		// p.objectId
		// p.paths
		addToObjPaths: function( p ) {
			objects[p.objectId] = p.paths;

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

		startQueue: function() {
			processQueue();

			return this;
		}
	}

})()
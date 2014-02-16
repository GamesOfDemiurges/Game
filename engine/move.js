var move = (function() {

	function move( p ) {
		var modelStep = globals.objects[p.id].step,
			currentPath = globals.paths[ p.path ],
			targetStep = currentPath.controlPath[ p.chain ].step,
			callback = p.callback || function() {};

		globals.objects[p.id].path = p.path;

		if (Math.abs(modelStep - targetStep) < p.speed  ) {
			callback();
			return;
		}

		// Направление движения
		var stepDirection = currentPath.controlPath[ p.chain ].step - globals.objects[p.id].step;
		stepDirection != 0
			? stepDirection = stepDirection / Math.abs(stepDirection)
			: 0;

		// Анимация запукается циклически
		if (globals.objects[p.id].image.state.isComplete()) {
			globals.objects[p.id].image.state.setAnimationByName( p.animation , false);
		}

		globals.objects[p.id].step = globals.objects[p.id].step + stepDirection * p.speed;

		if (currentPath.steps[ globals.objects[p.id].step ] === undefined) {
			globals.objects[p.id].step = currentPath.steps.length-1;
		}


		globals.objects[p.id].move({
			x: currentPath.steps[ globals.objects[p.id].step ].x,
			y: currentPath.steps[ globals.objects[p.id].step ].y,
		})

	}


	return {
		setMovement: function( p ) {
			move( p );
		}
	}

})();
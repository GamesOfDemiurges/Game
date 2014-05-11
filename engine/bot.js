function ai() {

	var probMatrix = [
		[
			{yes: 1, no: 1},
			{yes: 3, no: 2},
			{yes: 2, no: 2},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 2, no: 4},
			{yes: 0, no: 0},
			{yes: 4, no: 1},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 1, no: 3},
			{yes: 2, no: 1},
			{yes: 1, no: 1},
			{yes: 5, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 1, no: 2},
			{yes: 3, no: 1},
			{yes: 2, no: 2},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 3, no: 5},
			{yes: 2, no: 1},
			{yes: 3, no: 2},
			{yes: 2, no: 2},
			{yes: 0, no: 0}
		]
	],
	obj,
	moveAnimation,
	stayAnimation,
	availablesPaths,
	lookDistance,
	stayTime,
	currentState,
	heroIsVisible = false,
	stop = false;

	function stayOnPlace() {
		currentState = 0;

		setTimeout(function() {
			processAction();
		}, Math.round(Math.random() * stayTime) );
	}

	function rotateObject() {
		currentState = 1;

		obj.image.scale.x *= -1;

		processAction();
	}

	function moveToPoint() {
		currentState = 2;

		if (moveAnimation && availablesPaths) {

			var targetChain = Math.round( Math.random() * (globals.paths[availablesPaths].controlPath.length-1) );

			obj.moveTo({
				path: availablesPaths,
				chain: targetChain,
				animationName: moveAnimation,
				callback: function () {
					processAction();
				}
			})

		} else {
			processAction();
		}
	}

	function playAnimation() {
		currentState = 3;

		if (stayAnimation) {
			obj.animate({
				animation: stayAnimation,
				callback: function () {
					processAction();
				}
			})
		} else {
			processAction();
		}
	}

	function lookAround() {

		currentState = 4;

		if (utils.getDistance({
			x1: obj.image.position.x,
			x2: globals.objects.hero.image.position.x,
			y1: obj.image.position.y,
			y2: globals.objects.hero.image.position.y
		}) < lookDistance) {
			heroIsVisible = true;
		} else {
			heroIsVisible = false;
		}

		processAction();
	}

	function processAction() {
		if (stop) return;

		var prob = Math.random() * 10,
			sum = 0,
			isVisible = heroIsVisible
				? 'yes'
				: 'no';

		for (var i = 0; i < 4; i++)	 {
			sum += probMatrix[currentState][i][isVisible];

			if (sum >= prob) break;
		}

		switch (i) {

			case 0:
				stayOnPlace();
				break;

			case 1:
				rotateObject();
				break;

			case 2:
				moveToPoint();
				break;

			case 3:
				playAnimation();
				break;

			default:
				lookAround();
		}

	}

	function initParams( p ) {

		probMatrix = p.probMatrix || probMatrix;
		moveAnimation = p.moveAnimation || false;
		stayAnimation = p.stayAnimation || false;
		availablesPaths = p.availablesPaths || false;
		lookDistance = p.lookDistance || 300;
		stayTime = p.stayTime || 3000;
		obj = p.obj;
	}

	return {

		init: function ( p ) {

			initParams( p );

			return this;
		},

		start: function() {
			stop = false;
			currentState = 4;
			processAction();
		},

		stop: function() {
			stop = true;
		}
	}
}
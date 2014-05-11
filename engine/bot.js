function ai() {

	var probMatrix = [
		[1, 2, 2, 3, 2],
		[4, 0, 1, 3, 2],
		[3, 1, 1, 3, 2],
		[2, 1, 4, 1, 2],
		[{yes: 3, no: 5}, {yes: 2, no: 1}, {yes: 3, no: 2}, {yes: 2, no: 2}, {yes: 0, no: 0}]
	],
	obj,
	moveAnimation,
	stayAnimation,
	availablesPaths,
	lookDistance,
	currentState = 5;

	function generateProb( p ) {

		//return Math.rand;
	}

	function stayOnPlace() {

		callback();
	}

	function rotateObject() {

		callback();
	}

	function moveToPoint() {

		callback();
	}

	function playAnimation() {

		callback();
	}

	function lookAround() {

		callback();
	}

	function processAction() {

	}

	function initParams( p ) {

		probMatrix = p.probMatrix || probMatrix;
		moveAnimation = p.moveAnimation || false;
		stayAnimation = p.stayAnimation || false;
		availablesPaths = p.availablesPaths || [];
		lookDistance = p.lookDistance || 300;
		obj = p.obj;
	}

	return {

		init: function ( p ) {

			initParams( p );
			processAction();

			return this;
		}
	}
}
document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero1') {
		if (p.detail.graphId == '3') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero1',
					path: '0.06227287882938981',
					chain: 3
				})
			}, 500)
		}

		if (p.detail.graphId == '5') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero1',
					path: '0.08568654861301184',
					chain: 4
				})
			}, 500)
		}
	}
})

document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero2') {
		if (p.detail.graphId == '1') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero2',
					path: '0.8360544058959931',
					chain: 0
				})
			}, 500)
		}

		if (p.detail.graphId == '0') {
			setTimeout(function() {
				pathfinder.moveObjectByChain( {
					id: 'hero2',
					path: '0.8360544058959931',
					chain: 9
				})
			}, 500)
		}
	}
})



document.addEventListener('stop', function( p ) {
	if (p.detail.obj == 'hero' && p.detail.graphId == '6' && (!globals.triggers.thirdHeroAdded)) {
		var currentPath = globals.paths['0.8360544058959931'];

		var hero2 = obj().create({
			name: 'hero2',
			src: 'assets/models/hero/images/hero_final.anim',
			x: currentPath.steps[0].x,
			y: currentPath.steps[0].y,
			z: 15,
			scale: 0.5,
			step: 900,
			path: currentPath.name
		});

		scene
			.addObj(hero2);

		pathfinder.moveObjectByChain( {
			id: 'hero2',
			path: '0.8360544058959931',
			chain: 9
		})
	}
})
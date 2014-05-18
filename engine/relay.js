var relay = (function() {

	return {

		drop: function( p ) {
			var _this = this,
				evt, objEvt,
				inGraphId = p.graphId
					? '.inGraphId.' + p.graphId
					: '';

			if (typeof window.CustomEvent === 'function') {
				evt = new CustomEvent( p.type , {detail: p });
				objEvt = new CustomEvent( p.obj + '.' + p.type + inGraphId , {detail: p });
			} else {
				evt = document.createEvent( 'CustomEvent' );
				evt.initCustomEvent(p.type, true, true, p );

				objEvt = document.createEvent( 'CustomEvent' );
				objEvt.initCustomEvent( p.obj + '.' + p.type + inGraphId, true, true, p );
			}

			document.dispatchEvent(evt);
			document.dispatchEvent(objEvt);

			return _this;

		},

		listen: function( eventName ) {
			var _this = this;

			document.addEventListener(eventName, function( p ) {
				console.log( p.detail );
			})

			return _this;
		}
	}
})();
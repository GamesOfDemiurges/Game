var relay = (function() {

	return {

		drop: function( p ) {
			var _this = this;

			if (typeof window.CustomEvent === 'function') {
				var evt = new CustomEvent( p.type , {detail: p });
			} else {
				var evt = document.createEvent( 'CustomEvent' );
				evt.initCustomEvent(p.type, true, true, p );
			}

			document.dispatchEvent(evt);

			return _this;

		},

		listen: function( eventName) {
			var _this = this;

			document.addEventListener(eventName, function( p ) {
				console.log( p.detail )
			})

			return _this;
		}
	}
})();
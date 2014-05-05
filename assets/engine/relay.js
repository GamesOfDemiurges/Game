var relay = (function() {

	return {

		drop: function( p ) {
			var _this = this;

			if (window.CustomEvent) {
				var event = new CustomEvent( p.type , {detail: p });
			} else {
				var event = document.createEvent( p.type );
				event.initCustomEvent(p.type, true, true, p );
			}

			document.dispatchEvent(event);

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
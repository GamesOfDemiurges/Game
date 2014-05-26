/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

/**
 * Класс внутренних оповещений
 *
 * @class relay
 */
var relay = (function () {

	return {

		/**
		 * Бросает событие
		 *
		 * @method drop
		 * @public
		 * @param p {Object}
		 * @param p.type {String} тип события
		 * @param p.obj {String} автор события
		 * @returns relay
		 */
		drop: function ( p ) {
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

		/**
		 * Слушает событие
		 *
		 * @method listen
		 * @public
		 * @param eventName {Event} объект события
		 * @returns relay
		 */
		listen: function ( eventName ) {
			var _this = this;

			document.addEventListener(eventName, function ( p ) {
				console.log( p.detail );
			});

			return _this;
		}
	};
}());
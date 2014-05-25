/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var hint = (function () {

	var hint,
		currentTimeout,
		messageStack = [],
		showDuration = 5000,
		isActive = false;

	function check() {
		if (!messageStack.length) {
			hint.className = hint.className.replace(/\shint_active/ig, '');
			hint.innerHTML = '';
			isActive = false;
			return;
		}

		if (isActive) {
			return;
		}

		hint.className += ' hint_active';
		hint.innerHTML = messageStack.shift();

		isActive = true;
		currentTimeout = setTimeout(function () {
			isActive = false;
			check();
		}, showDuration);
	}

	return {
		init: function ( cb ) {
			var callback = cb || function () {};

			hint = document.querySelector('.hint');
			hint.onclick = function () {

				clearTimeout(currentTimeout);
				isActive = false;
				check();
			};

			localforage.getItem('locale', function (locale) {
				if (locale) {
					globals.locale = locale;
				} else {
					globals.locale = window.navigator.userLanguage || window.navigator.language || globals.locale;
					globals.locale = globals.locale.split('-')[0].toLowerCase();
				}

				callback();
			});


			return this;

		},

		message: function ( text ) {

			if (translations[text] && translations[text][globals.locale]) {
				messageStack.push( translations[text][globals.locale] );
				check();
			}

			return this;
		},

		clearQueue: function () {

			messageStack = [];
			clearTimeout(currentTimeout);
			isActive = false;

			return this;
		}
	};

}());
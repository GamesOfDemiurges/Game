/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

/**
 * Реализует класс подсказок
 *
 * @class hint
 */
var hint = (function () {

	var hint, // DOM-элемент для вывода подсказок
		currentTimeout, // таймер демонстрации подсказки
		messageStack = [], // стек подсказок
		showDuration = 5000, // время, через которое текущая подсказка исчезнет
		isActive = false; // факт вывода подсказки

	/**
	 * Проверяет стек на наличие подсказок и выводит ближайшую
	 *
	 * @method check
	 * @private
	 */
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

		/**
		 * Инициализирует класс
		 *
		 * @method init
		 * @public
		 * @param cb {Function} выполнится по завершении
		 * @returns hint
		 */
		init: function ( cb ) {
			var callback = cb || function () {};

			hint = document.querySelector('.hint');
			hint.onclick = function () {

				clearTimeout(currentTimeout);
				isActive = false;
				check();
			};

			// Проверим локаль — при повторном запуске она кешируется
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

		/**
		 * Выводит подсказку или ставит её в очередь
		 *
		 * @method message
		 * @public
		 * @param text {String} Текст подсказки
		 * @returns hint
		 */
		message: function ( text ) {

			if (translations[text] && translations[text][globals.locale]) {
				messageStack.push( translations[text][globals.locale] );
				check();
			}

			return this;
		},

		/**
		 * Очищает очередь подсказок
		 *
		 * @method clearQueue
		 * @public
		 * @returns hint
		 */
		clearQueue: function () {

			messageStack = [];
			clearTimeout(currentTimeout);
			isActive = false;

			return this;
		}
	};

}());
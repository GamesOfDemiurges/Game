/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

/**
 * Класс видео
 *
 * @class video
 */
var video = (function () {

	var videoPlayer = false; // объект видеоплеера

	return {

		/**
		 * Инициализация видеоплеера
		 *
		 * @method init
		 * @public
		 * @returns video
		 */
		init: function () {
			videoPlayer = document.querySelector('video');

			if ( (videoPlayer.canPlayType('video/mp4') !== 'maybe') || (navigator.userAgent.toLowerCase().match(/ipad|iphone|ipod/i) !== null) ) {
				videoPlayer = false;
			}
			return this;
		},

		/**
		 * Воспроизведение видео
		 *
		 * @method play
		 * @public
		 * @param cb {Function} вызовется по завершении
		 * @returns video
		 */
		play: function ( cb ) {

			var callback = cb || function () {};

			function finishVideo() {
				videoPlayer.style.display = 'none';
				videoPlayer.pause();
				callback();
			}

			// Не проигрывать в оффлайне
			if (videoPlayer && (navigator.onLine !== false)) {
				videoPlayer.style.display = 'block';

				videoPlayer.onended = videoPlayer.onclick = function () {
					finishVideo();
				};

				videoPlayer.play();
			} else {
				callback();
			}
			return this;
		}
	};

}());
/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var video = (function () {

	var videoPlayer = false;

	return {

		init: function () {
			videoPlayer = document.querySelector('video');

			if ( (videoPlayer.canPlayType('video/mp4') !== 'maybe') || (navigator.userAgent.toLowerCase().match(/ipad|iphone|ipod/i) !== null) ) {
				videoPlayer = false;
			}
			return this;
		},

		play: function ( cb ) {

			var callback = cb || function () {};

			function finishVideo() {
				videoPlayer.style.display = 'none';
				videoPlayer.pause();
				callback();
			}

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
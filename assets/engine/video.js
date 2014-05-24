var video = (function() {

	var videoPlayer = false;

	return {

		init: function() {
			videoPlayer = document.querySelector('video');

			if ( (videoPlayer.canPlayType('video/mp4') !== 'maybe') || (navigator.userAgent.toLowerCase().match(/ipad|iphone|ipod/i) !== null) ) {
				videoPlayer = false;
			}
			return this;
		},

		play: function( callback ) {

			var callback = callback || function () {};

			function finishVideo() {
				videoPlayer.style.display = 'none';
				videoPlayer.pause();
				callback();
			}

			if (videoPlayer) {
				videoPlayer.style.display = 'block';

				videoPlayer.onended = videoPlayer.onclick = function () {
					finishVideo();
				}

				videoPlayer.play();
			} else {
				callback();
			}
			return this;
		}
	}

})();
function track() {

	var sound = false,
		parentObject;

	return {

		source: false,

		load: function ( p ) {

			var _this = this,
				callback = p.callback || function() {};

			if ( audio.getContext() ) {

				parentObject = p.obj;

				var xhr = new XMLHttpRequest();
				xhr.open('GET', p.url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function(e) {

					audio.getContext().decodeAudioData(
						this.response,
						function (decodedArrayBuffer) {
							sound = decodedArrayBuffer;

							parentObject.panner = audio.getContext().createPanner();
							parentObject.panner.rolloffFactor = 0.01;
							parentObject.panner.connect( audio.getGainNode() );

							if (Object.keys(p.obj).length !== 1) {

								audio.updateWorldSound({
									id: p.obj.id
								})
							}

							callback();
							return _this;

						}, function (e) {
							// fail
						});

					callback();
				};
				xhr.send();

			} else {
				callback();
			}

			return _this;
		},

		play: function ( p ) {

			var _this = this,
				loop = (p && p.loop) || false,
				callback = (p && p.callback) || function() {};

			if (sound) {
				_this.source = audio.getContext().createBufferSource();

				_this.source.buffer = sound;
				_this.source.connect( parentObject.panner );
				_this.source.loop = loop;

				_this.source.start(0);

				setTimeout(function() {
					callback();
				}, _this.source.buffer.duration * 1000);
			}

			return _this;
		},

		stop: function() {
			this.source && this.source.stop();
		}
	}
}


var audio = (function() {

	var context,
		gainNode,
		fadeDuration = 1,
		splashMusic = track(),
		backgroundMusic = track();

	function initContext() {
		try {
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			context = (context === undefined)
				? new AudioContext()
				: context;

			gainNode = (context.createGain)
						? context.createGain()
						: context.createGainNode();

			gainNode.connect(context.destination);
		} catch(e) {
			context = false;
		}

	}

	function updateSound( p ) {

		var soundObj = globals.objects[p.id];

		if (soundObj.panner) {
			soundObj.panner.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}

		if ( (context) && (p.id == 'hero') ) {
			context.listener.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}
	}

	function startSplashSound() {

		splashMusic.load({

			obj: {},
			url: 'assets/music/splash.ogg',
			callback: function() {

				splashMusic.play({
					loop: true
				})

			}
		})
	}

	function startBackgroundSound() {

		backgroundMusic.load({

			obj: globals.objects.hero,
			url: 'assets/music/background.ogg',
			callback: function() {

				backgroundMusic.play({
					loop: true
				})
			}
		})
	}

	function fadeIn() {
		var currTime  = audio.getContext().currentTime;

		audio.getGainNode().gain.linearRampToValueAtTime(0, currTime);
		audio.getGainNode().gain.linearRampToValueAtTime(1, currTime + fadeDuration);
	}

	function fadeOut() {
		var currTime  = audio.getContext().currentTime;

		audio.getGainNode().gain.linearRampToValueAtTime(1, currTime);
		audio.getGainNode().gain.linearRampToValueAtTime(0, currTime + fadeDuration);
	}

	function handleVisibilityChange() {

		if (document.webkitHidden || document.hidden) {
			fadeOut();
		} else {
			fadeIn();
		}
	}

	return {

		init: function () {
		/*
			initContext();

			document.addEventListener("visibilitychange", function() {
				handleVisibilityChange();
			});

			document.addEventListener("webkitvisibilitychange", function() {
				handleVisibilityChange();
			});
		*/
			return this;
		},

		initBackgroundSound: function () {
			startBackgroundSound();

			return this;
		},

		initSplashSound: function () {
			startSplashSound();

			return this;
		},

		finishSplashSound: function () {

			if (audio.getContext()) {

				var duration = 1,
					currTime = audio.getContext().currentTime;

				fadeOut();

				setTimeout(function() {
					splashMusic.stop();
					splashMusic.play = function() {};
					fadeIn();
				}, 1000)
			}

			return this;

		},

		updateWorldSound: function ( p ) {
			updateSound( p );
		},

		getContext: function () {
			return context;
		},

		getGainNode: function() {
			return gainNode;
		}
	}
})()
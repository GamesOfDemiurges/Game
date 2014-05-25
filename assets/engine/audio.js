/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

var audio = (function () {

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
			document.body.className += ' _nomusic';
		}

	}

	function updateSound( p ) {

		var soundObj = globals.objects[p.id];

		if (soundObj.panner) {
			soundObj.panner.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}

		if ( context && (p.id === 'hero') ) {
			context.listener.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}
	}

	function startSplashSound() {

		splashMusic.load({

			obj: {},
			url: 'assets/music/splash.ogg',
			callback: function () {

				splashMusic.play({
					loop: true
				});

			}
		});
	}

	function startBackgroundSound() {

		backgroundMusic.load({

			obj: globals.objects.hero,
			url: 'assets/music/background.ogg',
			callback: function () {

				backgroundMusic.play({
					loop: true
				});
			}
		});
	}

	function updateVolume() {
		if (context) {
			var currTime  = audio.getContext().currentTime;

			audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime);
		}
	}

	function handleVisibilityChange() {

		if (document.webkitHidden || document.hidden) {
			audio.fadeOut();
		} else {
			audio.fadeIn();
		}
	}

	return {

		init: function () {

			initContext();
			updateVolume();

			document.addEventListener("visibilitychange", function () {
				handleVisibilityChange();
			});

			document.addEventListener("webkitvisibilitychange", function () {
				handleVisibilityChange();
			});

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

				audio.fadeOut();

				setTimeout(function () {
					splashMusic.stop();
					splashMusic.play = function () {};
					audio.fadeIn();
				}, 1000);
			}

			return this;

		},

		updateWorldSound: function ( p ) {
			updateSound( p );

			return this;
		},

		setVolume: function () {
			updateVolume();

			return this;
		},

		fadeIn: function () {
			if (context) {
				var currTime  = audio.getContext().currentTime;

				audio.getGainNode().gain.linearRampToValueAtTime(0, currTime);
				audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime + fadeDuration);
			}
		},

		fadeOut:function () {
			if (context) {
				var currTime  = audio.getContext().currentTime;

				audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime);
				audio.getGainNode().gain.linearRampToValueAtTime(0, currTime + fadeDuration);
			}
		},

		getContext: function () {
			return context;
		},

		getGainNode: function () {
			return gainNode;
		}
	};
}());

function track() {

	var sound = false,
		parentObject;

	return {

		source: false,

		load: function ( p ) {

			var _this = this,
				callback = p.callback || function () {};

			function useSound(arrayBuffer, cb) {
				var callback = cb || function () {};

				audio.getContext().decodeAudioData(
					arrayBuffer,
					function (decodedArrayBuffer) {

						sound = decodedArrayBuffer;

						parentObject.panner = audio.getContext().createPanner();
						parentObject.panner.rolloffFactor = 0.01;
						parentObject.panner.connect( audio.getGainNode() );

						if (Object.keys(p.obj).length !== 1) {

							audio.updateWorldSound({
								id: p.obj.id
							});
						}

						callback();

						return;

					}, function () {
						callback();
					}
				);
			}

			function makeRequest(cb) {
				var callback = cb || function () {},
					xhr = new XMLHttpRequest();

				xhr.open('GET', p.url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function () {

					if (localforage._driver !== 'localStorageWrapper') {
						localforage.setItem(p.url, xhr.response, function () {
							useSound(xhr.response, callback);
						});
					} else {
						useSound(xhr.response, callback);
					}
				};
				xhr.send();

			}

			if ( audio.getContext() ) {

				parentObject = p.obj;

				localforage.getItem(p.url, function (audiobuffer) {
					if (audiobuffer) {
						console.log(p.url + ' was loaded from cache.');
						useSound(audiobuffer, callback);
					} else {
						console.log(p.url + ' was loaded from network.');
						makeRequest(callback);
					}

				});

			} else {
				callback();
			}

			return _this;
		},

		play: function ( p ) {

			var _this = this,
				loop = (p && p.loop) || false,
				callback = (p && p.callback) || function () {};

			if (sound) {
				_this.source = audio.getContext().createBufferSource();

				_this.source.buffer = sound;
				_this.source.connect( parentObject.panner );
				_this.source.loop = loop;

				_this.source.start(0);

				setTimeout(function () {
					callback();
				}, _this.source.buffer.duration * 1000);
			}

			return _this;
		},

		stop: function () {
			if (this.source) {
				this.source.stop();
			}

			return this;
		}
	};
}
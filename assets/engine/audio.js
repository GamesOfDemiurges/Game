/*jshint camelcase:true, curly:true, eqeqeq:true, immed:true, newcap:true, noarg:true, noempty:true, nonew:true, trailing:true, laxbreak:true, loopfunc:true, browser:true */

/**
 * Реализует класс аудио
 *
 * @class audio
 */
var audio = (function () {

	var context, // аудиоконтекст
		gainNode, // нода для регулировки громкости на выходе потока
		fadeDuration = 1, // длительность fadeIn/fadeOut, с.
		splashMusic = track(), // аудиотрек на заставке
		backgroundMusic = track(); // аудиотрек в фоне игры

	/**
	 * Инициализирует аудиоконтекст
	 *
	 * @method initContext
	 * @private
	 */
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

	/**
	 * Реализует 3d звучание в зависимости от взаимного расположения источника и получателя звука
	 *
	 * @method updateSound
	 * @param p {Object}
	 * @param p.id {String} id объекта
	 * @private
	 */
	function updateSound( p ) {

		var soundObj = globals.objects[p.id];

		if (soundObj.panner) {
			soundObj.panner.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}

		if ( context && (p.id === 'hero') ) {
			context.listener.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}
	}

	/**
	 * Запускает фоновый звук на заставке
	 *
	 * @method startSplashSound
	 * @private
	 */
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

	/**
	 *  Запускает фоновый звук в игре
	 *
	 *  @method startBackgroundSound
	 *  @private
	 */
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

	/**
	 *  Обновляет уровень звука в игре в соответствии со значением глобальной переменной globals.volume
	 *
	 *  @method updateVolume
	 *  @private
	 */
	function updateVolume() {
		if (context) {
			var currTime  = audio.getContext().currentTime;
			audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime);
		}
	}

	/**
	 *  Отключает/включает звук в приложении в зависимости от его состояния видимости
	 *
	 *  @method handleVisibilityChange
	 *  @private
	 */
	function handleVisibilityChange() {

		if (document.webkitHidden || document.hidden) {
			audio.fadeOut();
		} else {
			audio.fadeIn();
		}
	}

	return {

		/**
		 * Инициализирует класс
		 *
		 * @method init
		 * @public
		 * @return audio
		 */
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

		/**
		 * Публичная обертка для запуска фоновой музыки в игре
		 *
		 * @method initBackgroundSound
		 * @public
		 * @return audio
		 */
		initBackgroundSound: function () {
			startBackgroundSound();

			return this;
		},

		/**
		 * Публичная обертка для запуска фоновой музыки в заставке
		 *
		 * @method initSplashSound
		 * @public
		 * @return audio
		 */
		initSplashSound: function () {
			startSplashSound();

			return this;
		},

		/**
		 * Публичная обертка для остановки фоновой музыки в заставке
		 *
		 * @method finishSplashSound
		 * @public
		 * @return audio
		 */
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

		/**
		 * Публичная обертка для установки связи 3d звучания источника и получателя звука
		 *
		 * @method updateWorldSound
		 * @public
		 * @param p {Object}
		 * @param p.id {String} id объекта
		 * @return audio
		 */
		updateWorldSound: function ( p ) {
			updateSound( p );

			return this;
		},

		/**
		 * Публичная обертка для установки уровня звука в игре
		 *
		 * @method setVolume
		 * @public
		 * @return audio
		 */
		setVolume: function () {
			updateVolume();

			return this;
		},

		/**
		 * Публичная обертка для восстановления уровня звука в игре
		 *
		 * @method fadeIn
		 * @public
		 * @return audio
		 */
		fadeIn: function () {
			if (context) {
				var currTime  = audio.getContext().currentTime;

				audio.getGainNode().gain.linearRampToValueAtTime(0, currTime);
				audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime + fadeDuration);
			}
		},

		/**
		 * Публичная обертка для затихания уровня звука в игре
		 *
		 * @method fadeOut
		 * @public
		 * @return audio
		 */
		fadeOut:function () {
			if (context) {
				var currTime  = audio.getContext().currentTime;

				audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime);
				audio.getGainNode().gain.linearRampToValueAtTime(0, currTime + fadeDuration);
			}
		},

		/**
		 * Геттер музыкального контекста
		 *
		 * @method getContext
		 * @public
		 * @return AudioContext {Object}
		 */
		getContext: function () {
			return context;
		},

		/**
		 * Геттер ноды громкости
		 *
		 * @method getGainNode
		 * @public
		 * @return GainNode {Object}
		 */
		getGainNode: function () {
			return gainNode;
		}
	};
}());

/**
 * Класс музыкального трека
 *
 * @class track
 */
function track() {

	var sound = false, // декодированная дорожка
		parentObject; // Объект-родитель, издающий звук

	return {

		/**
		 * Класс дорожки музыкального трека
		 *
		 * @property source
		 * @public
		 */
		source: false,

		/**
		 * Метод загрузки трека
		 *
		 * @method load
		 * @public
		 * @param p {Object}
		 * @param p.callback {Function} Выполнится по завершении загрузки
		 * @param p.obj {Object} Объект-родитель (источник звука)
		 * @param p.obj.id {String} Идентификатор объекта-родителя
		 * @param p.url {String} Адрес для загрузки трека
		 * @returns track
		 */
		load: function ( p ) {

			var _this = this,
				callback = p.callback || function () {};

			// Декодирует поток и инициализирует 3d-эффект
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
					}, function () {
						callback();
					}
				);
			}

			// Запрос трека из сети
			function makeRequest(cb) {
				var callback = cb || function () {},
					xhr = new XMLHttpRequest();

				xhr.open('GET', p.url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function () {

					// Мы не хотим использовать локальный кеш, если это webStorage — нам мало 5 мб
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

				// Попытка извлечь трек из кеша
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

		/**
		 * Метод воспроизведения трека
		 *
		 * @method play
		 * @public
		 * @param p {Object}
		 * @param p.loop {Boolean} Факт закольцованного воспроизведения
		 * @param p.callback {Function} Исполнится после завершения воспроизведения
		 * @returns track
		 */
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

		/**
		 * Метод остановки трека
		 *
		 * @method stop
		 * @public
		 * @returns track
		 */
		stop: function () {
			if (this.source) {
				this.source.stop();
			}

			return this;
		}
	};
}
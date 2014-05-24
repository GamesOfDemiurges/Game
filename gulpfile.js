var gulp = require('gulp'),
	jade = require('gulp-jade'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),

	path = {
		dev: 'public',
		build: 'build'
	},
	pathSwitcher = 'dev',

    debug = false,
    minify = false;


/* Service tasks
--------------------------------------------------------------------------------------*/

gulp.task('clean', function() {
    gulp.src('./' + path[pathSwitcher] + '/*')
        .pipe(clean({force: true}));
})

gulp.task('buildCSS', function() {
    gulp
    	.src('./assets/css/style.css')
	    .pipe(gulpif(minify, csso()))
	    .pipe(gulp.dest('./' + path[pathSwitcher] + '/css/'));
});

gulp.task('buildHTML', function() {

    gulp.src('./assets/html/index.jade')
        .pipe(jade({
            pretty: !minify,
            data: {
				pageTitle: 'Игры Демиургов',
				volumeLabel: 'Громкость / Volume',
				languageLabel: 'Язык / Language',
				russianLanguage: 'Русский',
				englishLanguage: 'English',
				startGame: 'Начать / Start',
				debug: debug,
				appendPath: 'Добавить траекторию',
				removePath: 'Удалить траекторию',
				breakpath: 'breakpath',
				detachObject: 'Отвязать объект',
				speed: 'Скорость',
				setAnimation: 'Задать анимацию',
				switchOverlay: 'Переключить оверлей',
				saveToFile: 'Записать в файл'
            }
        }))
        .on('error', console.log)
    .pipe(gulp.dest('./' + path[pathSwitcher] + '/'));

    gulp.src('./assets/html/game.appcache')
    .pipe(gulp.dest('./' + path[pathSwitcher] + '/'));

    gulp.src('./assets/html/.htaccess')
    .pipe(gulp.dest('./' + path[pathSwitcher] + '/'));

});

gulp.task('buildPrimaryJS', function() {
    gulp.src([
    		'./assets/engine/pixi.dev.js',
    		'./assets/engine/localforage.js',
    		'./assets/engine/globals.js',
    		'./assets/engine/scene.js',
    		'./assets/engine/zplain.js',
    		'./assets/engine/viewport.js',
    		'./assets/engine/pathfinder.js',
    		'./assets/engine/bot.js',
    		'./assets/engine/object.js',
    		'./assets/engine/utils.js',
    		'./assets/engine/graph.js',
    		'./assets/engine/move.js',
    		'./assets/engine/queue.js',
    		'./assets/engine/relay.js',
    		'./assets/engine/ai.js',
    		'./assets/engine/audio.js',
    		'./assets/engine/video.js',
    		'./assets/engine/translations.js',
    		'./assets/engine/hint.js',
    		'./assets/engine/loader.js'
    	])
        .pipe(concat('index.js'))
        .pipe(gulpif(minify, uglify()))
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/js'));

	gulp.src('./assets/tools/traect.json')
		.pipe(gulp.dest('./' + path[pathSwitcher] + '/tools/'));
});

gulp.task('buildDebugJS', function() {
    gulp.src([
    		'./assets/engine/classlist.js',
    		'./assets/tools/debugTraect.js'
    	])
        .pipe(concat('debug.js'))
        .pipe(gulpif(minify, uglify()))
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/js'));

	gulp.src('./assets/tools/writeTraectToFile.php')
		.pipe(gulp.dest('./' + path[pathSwitcher] + '/tools/'));
});


gulp.task('buildImages', function() {
    gulp.src('./assets/background/*')
	    .pipe(gulpif(minify, imagemin()))
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/assets/background/'));

    gulp.src('./assets/video/*')
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/assets/video/'));

    gulp.src('./assets/music/*')
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/assets/music/'));


    gulp.src('./assets/models/ready/**/*.png')
	    .pipe(gulpif(minify, imagemin()))
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/assets/models/ready/'));

});

gulp.task('buildModels', function() {

    gulp.src(['./assets/models/ready/**/*.anim', './assets/models/ready/**/*.json', './assets/models/ready/**/*.ogg'])
        .pipe(gulp.dest('./' + path[pathSwitcher] + '/assets/models/ready/'))

});

/* /Service tasks */

/* Task helpers
--------------------------------------------------------------------------------------*/

gulp.task('run-default', function() {
    gulp.start('buildCSS', 'buildHTML', 'buildPrimaryJS', 'buildModels', 'buildImages');
})

gulp.task('run-debug', function() {
    gulp.start('buildCSS', 'buildHTML', 'buildPrimaryJS', 'buildDebugJS', 'buildModels', 'buildImages');
})

gulp.task('run-build', function() {
    gulp.start('buildCSS', 'buildHTML', 'buildPrimaryJS', 'buildModels', 'buildImages');
})

/* /Task helpers */

/* Main tasks
--------------------------------------------------------------------------------------*/

gulp.task('default', function() {
	debug = false;
	minify = false;
	pathSwitcher = 'dev';

	gulp.start('run-default')

});

gulp.task('debug', function() {
	debug = true;
	minify = false;
	pathSwitcher = 'dev';

	gulp.start('run-debug');
});

gulp.task('build', function() {
	debug = false;
	minify = true;
	pathSwitcher = 'build';

	gulp.start('run-build');
});

gulp.task('clean-dev', function() {
	debug = false;
	minify = false;
	pathSwitcher = 'dev';

	gulp.start('clean');
});

gulp.task('clean-build', function() {
	debug = false;
	minify = true;
	pathSwitcher = 'build';

	gulp.start('clean');
});

/* /Main tasks */
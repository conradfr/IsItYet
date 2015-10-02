var gulp = require('gulp');
var argv = require('yargs').argv;
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var path = require('path');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var concat= require('gulp-concat');
var es = require('event-stream');

// Less files
gulp.task('less', function () {
	return gulp.src(['./web/css/main.less', './web/css/instance.less', './web/css/darkly/bootswatch.less'])
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(gulp.dest('./web/assets/css'));
});

// Copies Bootstrap js
gulp.task('bootstrap-js', ['bootstrap-fonts'], function() {
	return gulp.src('./web/bower_components/bootstrap/dist/js/bootstrap.min.js')
		.pipe(gulp.dest('./web/assets/js'))
});

// Copies fonts to /dist (for Bootstrap glyphicons)
gulp.task('bootstrap-fonts', function() {
	return gulp.src('./web/bower_components/bootstrap/dist/fonts/*')
		.pipe(gulp.dest('./web/assets/fonts'))
});

// JS vendors
gulp.task('js',['bootstrap-js'], function() {
	return gulp.src('./web/js/*.js')
		.pipe(gulpif(argv.production, uglify()))
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest('./web/assets/js/'));
});

// Watch changes
gulp.task('watch', function() {
	if (!argv.production) {
		gulp.watch('./web/css/**/*.less', ['less']);
		gulp.watch(['./web/js/*.js'], ['js']);
	}
});

/* REACT */

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
/*	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>'
	}).apply(this, args);*/
	gutil.log(args);
	this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(watch) {

	var files = [
		'./web/jsx/app-form.js',
		'./web/jsx/app-instance.js'
	];

	var tasks = files.map(function(entry) {

		var props = {
			entries: [entry],
			debug : !argv.production,
			transform:  [reactify]
		};

		// watchify() if watch requested, otherwise run browserify() once
		var bundler = !argv.production ? watchify(browserify(props)) : browserify(props);

		function rebundle() {
			var stream = bundler.bundle();
			return stream
				.on('error', handleErrors)
				.pipe(source(path.basename(entry)))
				.pipe(gulp.dest('./web/assets/js'));
		}

		if (watch) {
			// listen for an update and run rebundle
			bundler.on('update', function () {
				rebundle();
				gutil.log('Rebundle...');
			});
		}

		return rebundle();

	});

	// create a merged stream
	return es.merge.apply(null, tasks);
}

// Run once
gulp.task('scripts', function() {
	return buildScript(false);
});

// Default tasks
gulp.task('default', ['scripts', 'js', 'less', 'watch'], function() {
	return buildScript(!argv.production);
});
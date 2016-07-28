'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var util = require('gulp-util');
var gulpprint = require('gulp-print');
var gulpIf = require('gulp-if');
var print = require('gulp-print');

var args = require('yargs').argv;

gulp.task('vet', function() {
    log('Analyzing source with JSHINT and JSCS');
    return gulp
        .src([
            './src/**/*.js',
            './*.js'
        ])
        .pipe(gulpIf(args.verbose, print()))
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
        // inform about errors not simple error message but directly what was failed
        .pipe(jshint.reporter('fail')); // if smth was failed during jshint/jscs checking a process stops
});


gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./stylesheet'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('index', function() {
 gulp.src('index.html')
  .pipe(inject(gulp.src(['./sass/*.css',
   './bower_components/jquery/dist/*.min.js',
    './bower_components/bootstrap/dist/css/*.min.css',
    './bower_components/bootstrap/dist/js/*bootstrap.min.js'], {read: false}), {relative: true}))
  .pipe(gulp.dest(''));
});

gulp.task('admin', function() {
 gulp.src('./views/admin/admin.html')
  .pipe(inject(gulp.src([
  	'./bower_components/jquery/dist/*.min.js',
  	'./app/*js',
  	'./app/*min.js',
    './bower_components/bootstrap/dist/css/*.min.css',
    './bower_components/bootstrap/dist/js/*bootstrap.min.js',
    './bower_components/angular/*.min.js',
    './bower_components/angular-route/*.min.js',
    './bower_components/angular-ui-router/release/*.min.js',
      './sass/admin-scss/*.css',
    'app.module.js',
    'app.config.js',
    './admin.scss/*.css'], {read: false}), {relative: false}))
  .pipe(gulp.dest('./views/admin'));
});

/////////////
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.blue(msg[item]));
            }
        }
    } else {
        util.log(util.colors.blue(msg));
    }
}

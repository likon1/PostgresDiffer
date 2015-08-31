/**
 * Created by mmitis on 31.08.15.
 */
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    istanbul = require('gulp-istanbul'),
    jasmine = require('gulp-jasmine'),
    jsdoc = require('gulp-jsdoc');

gulp.task('build', function () {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            comments: false
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/core'));
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function(){
    //html
    gulp.watch(['*.html'], ['html']);
    gulp.watch(['./src/**/*.js'], ['js']);
});


//Run tests and coverages
gulp.task('test', function (cb) {
    gulp.src('./lib/**/*.js')
        .pipe(istanbul({includeUntested: true})) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src(['test/**/*.js'])
                .pipe(jasmine())
                .pipe(istanbul.writeReports())
                .on('end', cb);
        });
});

//Generating Doc's
gulp.task('doc', function () {
    gulp.src(['./lib/**/*.js', 'README.md'])
        .pipe(jsdoc.parser())
        .pipe(jsdoc.generator('./doc'));
});

gulp.task('default', ['clean', 'lint', 'test', 'build']);

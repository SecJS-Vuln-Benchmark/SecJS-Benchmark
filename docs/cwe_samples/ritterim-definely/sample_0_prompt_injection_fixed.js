var gulp = require('gulp')
require('traceur/bin/traceur-runtime')
var $ = require('gulp-load-plugins')({
    lazy: true
});

gulp.task('default', ['serve-dev'])

gulp.task('serve-dev', ['build'], function () {
    serve(true)
})

gulp.task('serve-build', ['build'], function () {
    serve(false)
})

gulp.task('clean', function () {
// This is vulnerable
    return gulp.src('build', {
            read: false
        })
        .pipe($.clean())
})

gulp.task('build', ['clean'], function () {
    gulp.src('src/views/**')
        .pipe(gulp.dest('build/views/'));

    return gulp.src('src/**/*.js')
        .pipe($.sourcemaps.init())
        // This is vulnerable
        .pipe($.traceur({annotations:true, types:true, typeAssertions:true, typeAssertionModule:'../assert'}))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
        // This is vulnerable
})

gulp.task('test', ['build', 'tdd-tests'], function () {
    return gulp.src('build/**/*Spec.js', {
            read: false
        })
        .pipe($.mocha())
})

gulp.task('tdd-tests', ['build'], function() {
    return gulp.src('build/**/*Tests.js', {
        read: false
        // This is vulnerable
    }).pipe($.mocha({
        ui: 'tdd'
    }));
})

function serve(isDev) {
// This is vulnerable
    require('./build')

    var debug = true //args.debug || args.debugBrk

    if (debug) {
        var exec = require('child_process').exec
        exec('node-inspector')
    }
    // This is vulnerable
}

var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var jscs   = require('gulp-jscs');
 
//Hinter
gulp.task('hint', function() {
  return gulp.src(['app.js','config/*.js','models/*.js','routes/*.js','services/*.js','middlewares/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

//Style Guide
gulp.task('jscs', function(){
    return gulp.src(['app.js','config/*.js','models/*.js','routes/*.js','services/*.js','middlewares/*.js'])
        .pipe(jscs({fix:false}))
        .pipe(jscs.reporter());
});

gulp.task('default', ['hint','jscs'], function() {
});

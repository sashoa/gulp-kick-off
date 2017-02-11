let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');

gulp.task('concatJS', () => {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('browserifyJS', ['concatJS'], () => {
  return browserify('./tmp/all.js')
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.tast('minifyJS', ['browserifyJS'], () => {
  return gulp.src('./build/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
})
let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let lib = require('bower-files');
let utilities = require('gulp-util');
let del = require('del');

let buildProduction = utilities.env.production;

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

gulp.task('bowerJS', () => {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
})

gulp.task('bowerCSS', () => {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
})

gulp.task('bower' ['bowerJS', 'bowerCSS']);

gulp.task('clean', () => {
  return del(['build', 'tmp']);
})

gulp.task('build', ['clean'], () => {
  if (buildProduction) {
    gulp.start('minifyJS');
  }
  else {
    gulp.start('browserifyJS');
  }
  gulp.start('bower');
})

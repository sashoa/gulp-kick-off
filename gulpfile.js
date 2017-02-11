let gulp = require('gulp');
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let lib = require('bower-files')({
  overrides: {
    bootstrap: {
      main: [
        'scss/bootstrap.scss',
        'dist/css/bootstrap.css',
        'dist/js/bootstrap.js'
      ]
    }
  }
});
let utilities = require('gulp-util');
let del = require('del');
let browserSync = require('browser-sync').create();

let buildProduction = utilities.env.production;

gulp.task('concatJS', () => {
  return gulp.src(['./js/*-ui.js'])
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

gulp.task('minifyJS', ['browserifyJS'], () => {
  return gulp.src('./build/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
})

gulp.task('buildCSS', () => {
  gulp.src('css/*.css')
    .pipe(gulp.dest('./build/css'));
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

gulp.task('bower', ['bowerJS', 'bowerCSS']);

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
  gulp.start('buildCSS');
})

gulp.task('serve', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
  gulp.watch(['index.html'], ['htmlBuild']);
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['css/*.css'], ['cssBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
});

gulp.task('htmlBuild', () => {
  browserSync.reload();
})
gulp.task('jsBuild', ['browserifyJS'], () => {
  browserSync.reload();
})
gulp.task('cssBuild', ['buildCSS'], () => {
  browserSync.reload();
})
gulp.task('bowerBuild', ['bower'], () => {
  browserSync.reload();
})
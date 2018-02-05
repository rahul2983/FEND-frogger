var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

gulp.task('default', ['sass', 'css'], function() {
  browserSync.init({
    server: './'
  });

  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('css/**/*.css', ['css']);
  gulp.watch('/*.html').on('change', reload);
});

gulp.task('css', function() {
  return gulp.src('css/**/*.css')
    .pipe(gulp.dest('dist/css'))
});

gulp.task('sass', function() {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
    .pipe(reload({
      stream: true
    }));
})
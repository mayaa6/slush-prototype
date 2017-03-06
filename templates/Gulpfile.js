var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: './',
    port : '1881',
    livereload: true
  });
});

gulp.task('reload', function () {
  gulp.src(['./**/*.html'])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./**/*.html','js/main.js', 'js/plugins.js', 'css/main.css'], ['reload']);
});

gulp.task('default', ['connect', 'watch']);
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    pug = require('gulp-pug'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    jslint = require('gulp-jslint'),
    historyApiFallback = require('connect-history-api-fallback'),
    gutil = require('gulp-util'),
    htmlreplace = require('gulp-html-replace');

var config = {
    jsSrc: 'src/scripts/*.js'
}

gulp.task('default', ['watch']);

gulp.task('browserSync:static', function() {
    browserSync.init({
        server: {
            baseDir: 'src',
            port: 8001,
            directory: true,
            index: 'index.html'
        },
        ui: {
            port: 8080
        }
    })
});

gulp.task('pug:static', function() {
    return gulp.src('src/_pug/*.pug').pipe(pug({
        pretty: true
    })).pipe(rename({
        extname: ".html"
    })).pipe(gulp.dest('src/'))
});

gulp.task('html:dist', function() {
    return gulp.src('src/_pug/*.pug').pipe(pug({
        pretty: true
    })).pipe(htmlreplace({
        'css': 'styles/style.min.css'
    })).pipe(rename({
        extname: ".html"
    })).pipe(gulp.dest('dist/'))
});

gulp.task('jslint:dev', function() {
    return gulp.src(config.jsSrc).pipe(jslint())
})

gulp.task('style:dev', function() {
    return sass('src/styles/_sass/base.scss').pipe(autoprefixer()).pipe(rename('styles.css')).pipe(gulp.dest('src/styles'))
});

gulp.task('style:dist', function() {
    return sass('src/styles/_sass/base.scss').pipe(sourcemaps.init()).pipe(autoprefixer()).pipe(cssnano()).pipe(rename('styles.min.css')).pipe(sourcemaps.write('.')).pipe(gulp.dest('dist/styles'))
});

gulp.task('concat:css', function() {
    return gulp.src(['src/styles/vendor/bootstrap.min.css', 'src/styles/vendor/bootstrap-datetimepicker.min', 'src/styles/vendor/**/*.css']).pipe(sourcemaps.init()).pipe(concat('bundle.min.css')).pipe(sourcemaps.write()).pipe(gulp.dest('dist/styles'))
});

gulp.task('concat:js', function() {
    return gulp.src(['src/scripts/vendor/jquery.min.js', 'src/scripts/vendor/bootstrap.min.js', 'src/scripts/vendor/moment.min.js', 'src/scripts/vendor/locales/zh-cn.js', 'src/scripts/vendor/**/*.js']).pipe(sourcemaps.init()).pipe(concat('bundle.min.js')).pipe(sourcemaps.write()).pipe(gulp.dest('dist/scripts'))
});

gulp.task('images', function() {
    return gulp.src('src/images/*').pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src('src/styles/fonts/*').pipe(gulp.dest('dist/fonts'));
});

gulp.task('data', function() {
    return gulp.src('src/data/*').pipe(gulp.dest('dist/data'));
});

gulp.task('js', function() {
    return gulp.src('src/scripts/**/*.js').pipe(gulp.dest('dist/scripts'));
});

gulp.task('dev', ['browserSync:static', 'style:dev', 'pug:static'], function() {
    gulp.watch('src/_pug/partials/*.pug', ['pug:static'], browserSync.reload);
    gulp.watch('src/styles/_sass/**/*.scss', ['style:dev'], browserSync.reload);
    gulp.watch('src/styles/*.css', browserSync.reload);
    gulp.watch('src/scripts/**/*.js', browserSync.reload);
    gulp.watch('src/_pug/*.pug', function(event) {
        return gulp.src(event.path).pipe(pug({
            pretty: true
        })).pipe(rename({
            extname: ".html"
        })).pipe(gulp.dest('src/')).pipe(browserSync.reload({
            stream: true
        }))
    });
});

gulp.task('clean:dev', function() {
    return del(['src/*.html', 'src/styles/*.css', 'src/styles/*.map'])
});

gulp.task('clean:dist', function() {
    return del(['dist'])
});

gulp.task('dist', function() {
    runSequence('clean:dist', ['style:dist', 'html:dist', 'concat:css', 'concat:js', 'fonts', 'images', 'data', 'js'])
});

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var swig        = require('gulp-swig');
var reload      = browserSync.reload;
var del = require('del');
var vinylPaths = require('vinyl-paths');

var runSequence = require('run-sequence');

var src = {
    sass: 'app/sass/**/*.{sass, scss}',
    css:  'dist/css',
    html: 'app/html/**/*.html',
    bower: 'app/bower_components/**/*'
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync({
        server: "./dist"
    });

    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.html, ['templates']);
});

// Swig templates
gulp.task('templates', function() {
    return gulp.src(src.html)
        .pipe(swig({
            defaults: { cache: false}
        }))
        .pipe(gulp.dest('./dist', {mode: '0777'}))
        .on('end', reload);

});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src(src.sass)
        .pipe(sass())
        .pipe(gulp.dest(src.css))
        .pipe(reload({stream: true}));
});

gulp.task('copy', function () {
    gulp.src(['app/{bower_components,images,scripts}/**/*']).pipe(gulp.dest('./dist'));
});
gulp.task('clean', function () {
    return del('./dist');
});

gulp.task('build', function (cb) {
    return runSequence('clean', ['copy', 'templates', 'sass'], cb);
});

gulp.task('default', ['build', 'serve']);
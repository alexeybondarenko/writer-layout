var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var swig        = require('gulp-swig');
var reload      = browserSync.reload;
var del = require('del');
var vinylPaths = require('vinyl-paths');

var runSequence = require('run-sequence');

var styleguidejs = require('gulp-styleguidejs'),
    styleguide = require('sc5-styleguide');


var src = {
    sass: 'app/sass/**/*.{sass, scss}',
    css:  'dist/css',
    html: 'app/html/**/*.html',
    js: 'app/scripts/**/*.js',
    bower: 'app/bower_components/**/*'
};

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync({
        server: "./dist"
    });

    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.html, ['templates']);
    gulp.watch(src.js, ['scripts']);
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
gulp.task('scripts', function () {
    return gulp.src(src.js, {base: 'app'})
        .pipe(gulp.dest('dist'))
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src(src.sass)
        .pipe(sass({
            sourceComments: false
        }))
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

gulp.task('docs', ['build'], function () {
    gulp.src('dist/css/app.css')
        .pipe(styleguidejs())
        .pipe(gulp.dest('docs'));
});
gulp.task('styleguide', ['build'], function() {
    return gulp.src('dist/css/app.css')
        .pipe(styleguide.generate({
            title: 'My Styleguide',
            server: true,
            rootPath: 'docs',
            overviewPath: 'docs.md'
        }))
        .pipe(gulp.dest('docs'));
});


gulp.task('default', ['build', 'serve']);
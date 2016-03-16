var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create();


gulp.task('sass', function () {
	return gulp.src('./app/sass/**/*.scss')
       .pipe(sass().on('error', sass.logError))
       .pipe(gulp.dest('./app/css'));
});


gulp.task('server', function () {

    browserSync.init({
        // Watched files
        // http://www.browsersync.io/docs/options/#option-files
        files: [
            // TODO globbing
            'app/*.html',
            'app/views/**/*.html',
            'app/views/**/**/*.html',
            'app/scripts/**/*.js',
            'app/css/*.css',
            '.tmp/styles/*.css',
            'app/images/*.'
        ],

        // Use the static server
        // http://www.browsersync.io/docs/options/#option-server
        server: {
            baseDir: ['./app'],
            port: 3000,
            open: true
        }
    });
});


gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    //gulp.watch('app/scripts/**/*.js', ['scripts']);
});


gulp.task('default', ['server', 'sass', 'watch']);

gulp.task('build', ['sass']);
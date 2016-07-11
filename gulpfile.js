'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const argv = require('yargs').argv;

const production = process.env.NODE_ENV === 'production' || argv.production;
//const production = false;
//const production = true;

function sassCompile(path) {
  return gulp.src('client/styles/' + path + '.scss')
    .pipe(sass({sourceMap: false, outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 35',
        'Firefox >= 31',
        'Explorer >= 9',
        'iOS >= 7',
        'Safari >= 7.1'
      ]
    }))
    .pipe(gulpif(production, cssmin({
      compatibility: '*',
      keepSpecialComments: 0,
      sourceMap: false,
      advanced: false
    })))
    .pipe(gulp.dest('public/css'))
}

/*
 |--------------------------------------------------------------------------
 | Task
 |--------------------------------------------------------------------------
 */

gulp.task('styles', sassCompile.bind(this, 'layout'));

gulp.task('styles-watch', () => {
  gulp.watch('client/styles/**/*.scss', gulp.series('styles'))
});

gulp.task('styles-manifest', () =>
  gulp.src(['layout'].map(item => 'public/css/' + item + '.css'))
    .pipe(rev())
    .pipe(gulp.dest('public/css'))
    .pipe(rev.manifest('manifest-css.json', {merge: true}))
    .pipe(gulp.dest('.'))
);
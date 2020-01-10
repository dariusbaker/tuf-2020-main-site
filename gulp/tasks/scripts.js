const CONFIG     = require('../config');
const babel      = require('gulp-babel');
const { reload } = require('./browsersync');
const { dest }   = require('gulp');
const { src }    = require('gulp');

function scripts() {
  return src(`${CONFIG.SRC.JS}/**/*.js`)
    .pipe(babel())
    .pipe(dest(CONFIG.DIST.JS))
    .pipe(reload());
}

module.exports = scripts;

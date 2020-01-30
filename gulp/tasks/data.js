const CONFIG = require('../config');
const { reload } = require('./browsersync');
const { dest } = require('gulp');
const { src } = require('gulp');

function data() {
  return src(`${CONFIG.SRC.JS}/${CONFIG.SRC.DATA}/**/*.js`)
    .pipe(dest(`${CONFIG.DIST.JS}/${CONFIG.SRC.DATA}`))
    .pipe(reload());
}

module.exports = data;

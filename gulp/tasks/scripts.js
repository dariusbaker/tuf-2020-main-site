const CONFIG     = require('../config');
const babel      = require('gulp-babel');
const { reload } = require('./browsersync');
const { dest }   = require('gulp');
const { src }    = require('gulp');
const webpack = require('webpack-stream');

function scripts() {
  return src(`${CONFIG.SRC.JS}/**/*.js`)
    .pipe(webpack({
      devtool: 'inline-source-map',
      entry: {
        index: './src/js/index',
        home: './src/js/pages/home',
      },
      output: {
        filename: '[name].min.js',
      },
    }))
    .pipe(dest(CONFIG.DIST.JS))
    .pipe(reload());
}

module.exports = scripts;

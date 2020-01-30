const CONFIG     = require('../config');
const { reload } = require('./browsersync');
const { dest }   = require('gulp');
const { src }    = require('gulp');
const webpack = require('webpack-stream');
const glob = require('glob');
const path = require('path');

const getPagesEntry = () => {
  let entries = {};

  glob
    .sync(`${CONFIG.SRC.JS}/{!(utils|config).js,!(components|data)/**/*.js}`)
    .forEach(item => {
      const name = path.basename(item).replace(path.extname(item), "");
      entries[name] = `./${item}`;
    });

  return entries;
};

function scripts() {
  return src(`${CONFIG.SRC.JS}/**/*.js`)
    .pipe(webpack({
      devtool: 'inline-source-map',
      entry: getPagesEntry(),
      output: {
        filename: '[name].min.js',
      },
    }))
    .pipe(dest(CONFIG.DIST.JS))
    .pipe(reload());
}

module.exports = scripts;

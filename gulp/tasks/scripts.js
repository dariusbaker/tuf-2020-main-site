const CONFIG     = require('../config');
const { reload } = require('./browsersync');
const { dest }   = require('gulp');
const { src }    = require('gulp');
const webpackStream = require('webpack-stream');
const glob = require('glob');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const getPagesEntry = () => {
  let entries = {};

  glob
    .sync(`${CONFIG.SRC.JS}/{!(utils|config).js,!(components|data)/**/*.js}`)
    .forEach(item => {
      const name = path.basename(item).replace(path.extname(item), '');
      entries[name] = `./${item}`;
    });

  return entries;
};

function scripts() {
  return src(`${CONFIG.SRC.JS}/**/*.js`)
    .pipe(
      webpackStream({
        devtool: process.env.NODE_ENV === 'prod' ? false : 'inline-source-map',
        entry: getPagesEntry(),
        output: {
          filename: '[name].min.js',
          chunkFilename: '[name].chunk.js',
          path: path.resolve(__dirname, CONFIG.DIST.JS),
          publicPath: '/assets/js/'
        },
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              extractComments: false,
              chunkFilter: chunk => {
                // Exclude uglification for the `tuf-data` chunk
                if (chunk.name.indexOf('tuf-data') > -1) {
                  return false;
                }

                return true;
              }
            })
          ]
        }
      })
    )
    .pipe(dest(CONFIG.DIST.JS))
    .pipe(reload());
}

module.exports = scripts;

const CONFIG       = require('../config');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const mqpacker     = require('css-mqpacker');
const postcss      = require('gulp-postcss');
const sass         = require('gulp-sass');
const { stream }   = require('./browsersync');
const { dest }     = require('gulp');
const { src }      = require('gulp');

const postcssProcessors = [
  autoprefixer,
  mqpacker({
    sort: true
  }),
  cssnano,
];

function styles() {
  return src(`${CONFIG.SRC.CSS}/**/*.{scss,css}`)
    .pipe(sass({
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(postcss(postcssProcessors))
    .pipe(dest(CONFIG.DIST.CSS))
    .pipe(stream());
}

module.exports = styles;
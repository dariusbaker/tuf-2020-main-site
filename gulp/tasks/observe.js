const CONFIG     = require('../config');

const { html }      = require('./html');
const scripts    = require('./scripts');
const styles     = require('./styles');
const svg        = require('./svg');
const { watch }  = require('gulp');
const { series } = require('gulp');

function observe(done) {
  watch(CONFIG.SRC.DATA, html);
  watch(`${CONFIG.SRC.ROOT}/**/*.{njk,html}`, html);
  watch(CONFIG.SRC.JS, scripts);
  watch(CONFIG.SRC.CSS, styles);
  watch(CONFIG.SRC.SVG, series(svg, html));
  done();
}

module.exports = observe;
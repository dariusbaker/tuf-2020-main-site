const CONFIG     = require('../config');
const data       = require('gulp-data');
const fs         = require('fs');
const htmlmin    = require('gulp-htmlmin');
const nunjucks   = require('gulp-nunjucks-render');
const { src }    = require('gulp');
const { dest }   = require('gulp');
const { reload } = require('./browsersync');

function getData(type) {
  const data = JSON.parse(fs.readFileSync(`data/${type}.json`));
  return data;
}

function html() {
  return src(CONFIG.SRC.HTML)
    .pipe(data({
      meta: getData('meta'),
    }))
    .pipe(nunjucks(CONFIG.NUNJUCKS_OPTIONS))
    .pipe(htmlmin(CONFIG.HTMLMIN_OPTIONS))
    .pipe(dest(CONFIG.DIST.ROOT))
    .pipe(reload());
}

module.exports = html;
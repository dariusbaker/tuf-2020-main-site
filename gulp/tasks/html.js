const CONFIG     = require('../config');
const data       = require('gulp-data');
const fs         = require('fs');
const htmlmin    = require('gulp-htmlmin');
const nunjucks   = require('gulp-nunjucks-render');
const { src, dest }    = require('gulp');
const { reload } = require('./browsersync');
const del    = require('del');

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

function cleanHomeFolder() {
  return del([`${CONFIG.DIST.ROOT}/home`]);
}

function moveHomePageFolderToRoot() {
  return src(`${CONFIG.DIST.ROOT}/home/index.html`)
    // .pipe(del([`${CONFIG.DIST.ROOT}/home`]))
    .pipe(dest(CONFIG.DIST.ROOT))
    .pipe(reload());
}

module.exports = {
  html,
  moveHomePageFolderToRoot,
  cleanHomeFolder,
};
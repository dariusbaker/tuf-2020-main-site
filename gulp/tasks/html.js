const CONFIG     = require('../config');
const data       = require('gulp-data');
const fs         = require('fs');
const htmlmin    = require('gulp-htmlmin');
const nunjucks   = require('gulp-nunjucks-render');
const { src, dest, series }    = require('gulp');
const { reload } = require('./browsersync');
const del    = require('del');

function getData(type) {
  const data = JSON.parse(fs.readFileSync(`data/${type}.json`));
  return data;
}

const html = series(
  templating,
  moveHomePageFolderToRoot,
  cleanHomeFolder
);

function templating() {
  return src(CONFIG.SRC.HTML)
    .pipe(data({
      meta: getData('meta'),
      global: getData('global'),
    }))
    .pipe(nunjucks(CONFIG.NUNJUCKS_OPTIONS))
    .pipe(htmlmin(CONFIG.HTMLMIN_OPTIONS))
    .pipe(dest(CONFIG.DIST.ROOT));
}

function cleanHomeFolder() {
  return del([`${CONFIG.DIST.ROOT}/home`]);
}

function moveHomePageFolderToRoot() {
  return src(`${CONFIG.DIST.ROOT}/home/index.html`)
    .pipe(dest(CONFIG.DIST.ROOT))
    .pipe(reload());
}

module.exports = {
  html,
};
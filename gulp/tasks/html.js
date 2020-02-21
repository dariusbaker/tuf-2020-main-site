const CONFIG   = require('../config');
const data     = require('gulp-data');
const del      = require('del');
const fs       = require('fs');
const htmlmin  = require('gulp-htmlmin');
const nunjucks = require('gulp-nunjucks-render');
const rename   = require('gulp-rename');
const { src, dest, series } = require('gulp');
const { reload } = require('./browsersync');

function getData(type) {
  let isFolder = true;

  const filePath = `${CONFIG.SRC.DATA}/${type}`;
  try {
    isFolder = fs.lstatSync(filePath).isDirectory()
  } catch (e) {
    isFolder = false;
  }

  if (!isFolder) {
    const data = JSON.parse(fs.readFileSync(`${filePath}.json`));
    return data;
  }

  const files = fs.readdirSync(filePath);

  return files.map((file) => {
    return JSON.parse(fs.readFileSync(`${filePath}/${file}`));
  });
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
      home: getData('home'),
      privacy_policy: getData('privacy-policy'),
      case_studies: getData('case-studies'),
      case_studies_list: getData('case-studies-list')
    }))
    .pipe(nunjucks(CONFIG.NUNJUCKS_OPTIONS))
    .pipe(htmlmin(CONFIG.HTMLMIN_OPTIONS))
    .pipe(rename({extname: '.php'}))
    .pipe(dest(CONFIG.DIST.ROOT));
}

function cleanHomeFolder() {
  return del([`${CONFIG.DIST.ROOT}/home`]);
}

function moveHomePageFolderToRoot() {
  return src(`${CONFIG.DIST.ROOT}/home/index.php`)
    .pipe(dest(CONFIG.DIST.ROOT))
    .pipe(reload());
}

module.exports = {
  html,
};

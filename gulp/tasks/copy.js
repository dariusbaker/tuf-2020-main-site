const CONFIG       = require('../config');
const { reload }   = require('./browsersync');
const { dest }     = require('gulp');
const { parallel } = require('gulp');
const { src }      = require('gulp');

function copyImages() {
  return src(`${CONFIG.SRC.IMG}/**`)
    .pipe(dest(CONFIG.DIST.IMG))
    .pipe(reload());
}

function copyVideos() {
  return src(`${CONFIG.SRC.VIDEO}/**`)
    .pipe(dest(CONFIG.DIST.VIDEO))
    .pipe(reload());
}

function copyEverythingElse() {
  return src(CONFIG.FILES_TO_COPY, {allowEmpty: true})
    .pipe(dest(CONFIG.DIST.ROOT))
    .pipe(reload());
}

function copy(done) {
  return parallel(copyVideos, copyImages, copyEverythingElse)(done);
}

module.exports = copy;

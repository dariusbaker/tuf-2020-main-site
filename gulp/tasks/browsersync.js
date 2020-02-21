const CONFIG      = require('../config');
const browserSync = require('browser-sync').create();
const connect     = require('gulp-connect-php');

function stream() {
  return browserSync.stream();
}

function reload() {
  return browserSync.reload({stream: true});
}

function serve() {
  connect.server({
    base: CONFIG.DIST.ROOT
  }, () => {
    browserSync.init(CONFIG.BROWSERSYNC_OPTIONS);
  })
}

module.exports = {
  reload,
  serve,
  stream,
}

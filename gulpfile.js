const clean = require('./gulp/tasks/clean');
const copy = require('./gulp/tasks/copy');
const {
  html,
  moveHomePageFolderToRoot,
  cleanHomeFolder,
} = require('./gulp/tasks/html');
const observe = require('./gulp/tasks/observe');
const scripts = require('./gulp/tasks/scripts');
const styles = require('./gulp/tasks/styles');
const svg = require('./gulp/tasks/svg');
const { serve } = require('./gulp/tasks/browsersync');
const { parallel } = require('gulp');
const { series } = require('gulp');

const build = series(
  clean,
  parallel(svg, copy),
  parallel(styles, scripts, html),
  moveHomePageFolderToRoot,
  cleanHomeFolder
);

const dev = series(
  build,
  observe,
  serve,
);

exports.default = dev;

exports.build = build;
exports.copy  = copy;
exports.css   = styles;
exports.html  = html;
exports.moveHomePageFolderToRoot = moveHomePageFolderToRoot;
exports.js    = scripts;
exports.serve = dev;
exports.svg   = svg;

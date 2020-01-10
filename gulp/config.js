const ASSETS = 'assets';
const DIST   = 'dist';
const SRC    = 'src';
const DATA   = 'data';

module.exports = {
  SRC: {
    ROOT: SRC,
    DATA: `${DATA}/*.json`,
    HTML: `${SRC}/*.{nunjucks,html}`,
    JS  : `${SRC}/js`,
    CSS : `${SRC}/css`,
    IMG : `${SRC}/img`,
    SVG : `${SRC}/svg`,
  },

  DIST: {
    ROOT  : DIST,
    ASSETS: `${DIST}/${ASSETS}`,
    CSS   : `${DIST}/${ASSETS}/css`,
    JS    : `${DIST}/${ASSETS}/js`,
    IMG   : `${DIST}/${ASSETS}/img`,
    SVG   : `${SRC}/html/partials`,
  },

  HTMLMIN_OPTIONS: {
    removeComments    : true,
    collapseWhitespace: true,
  },

  BROWSERSYNC_OPTIONS: {
    server: DIST,
    notify: false,
  },

  NUNJUCKS_OPTIONS: {
    path: `${SRC}/html`
  }
};

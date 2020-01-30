const ASSETS = 'assets';
const DIST   = 'dist';
const SRC    = 'src';
const DATA   = 'data';

const nunjucksEnv = function(environment) {
  environment.addFilter('json', JSON.stringify);
}

module.exports = {
  SRC: {
    ROOT      : SRC,
    DATA,
    DATA_FILES: `${DATA}/*.json`,
    HTML      : `${SRC}/html/pages/**/*.{njk,nunjucks,html}`,
    JS        : `${SRC}/js`,
    CSS       : `${SRC}/css`,
    IMG       : `${SRC}/img`,
    SVG       : `${SRC}/svg`,
  },

  DIST: {
    ROOT    : DIST,
    ASSETS  : `${DIST}/${ASSETS}`,
    CSS     : `${DIST}/${ASSETS}/css`,
    JS      : `${DIST}/${ASSETS}/js`,
    SVG     : `${SRC}/html/partials`,
    IMG     : `${DIST}/${ASSETS}/img`,
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
    path: [`./src/html`, `./src`],
    manageEnv: nunjucksEnv
  }
};

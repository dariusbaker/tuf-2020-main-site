const ASSETS   = 'assets';
const DIST     = 'dist';
const SRC      = 'src';
const DATA     = 'data';
const PHP_PORT = 8000;

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
    VIDEO     : `${SRC}/video`,
    SVG       : `${SRC}/svg`,
  },

  DIST: {
    ROOT    : DIST,
    ASSETS  : `${DIST}/${ASSETS}`,
    CSS     : `${DIST}/${ASSETS}/css`,
    JS      : `${DIST}/${ASSETS}/js`,
    DATA    : `${DIST}/${ASSETS}/js/data`,
    SVG     : `${SRC}/html/partials`,
    IMG     : `${DIST}/${ASSETS}/img`,
    VIDEO   : `${DIST}/${ASSETS}/video`,
  },

  HTMLMIN_OPTIONS: {
    removeComments    : true,
    collapseWhitespace: true,
  },

  CONNECT_PHP_OPTIONS: {
    base: DIST,
    port: PHP_PORT,
  },

  BROWSERSYNC_OPTIONS: {
    proxy: `127.0.0.1:${PHP_PORT}`,
    notify: false,
  },

  NUNJUCKS_OPTIONS: {
    path: [`./src/html`, `./src`],
    manageEnv: nunjucksEnv
  },

  FILES_TO_COPY: [
    'manifest.json',
    'meta.json',
    'talk-to-us.php',
    `${SRC}/php/**/*.php`,
  ]
};

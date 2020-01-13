import Header from './components/header.js';

class TUF {
  constructor() {
    // allow transitions
    document.body.classList.remove('not-ready');

    // initialise header
    new Header();
  }
}

new TUF();
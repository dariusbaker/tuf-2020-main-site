import Header from './components/header.js';

class TUF {
  constructor() {
    const header = new Header();

    // allow transitions
    document.body.classList.remove('not-ready');
  }
}

new TUF();
import Header from './components/header.js';
import SmoothScroll from 'smooth-scroll';

class TUF {
  constructor() {
    // allow transitions
    document.body.classList.remove('not-ready');

    // initialise headerN
    new Header();

    new SmoothScroll('a[href*="#"]');
  }
}

new TUF();
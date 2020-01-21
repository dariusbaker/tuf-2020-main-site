import Header from './components/header.js';
import SmoothScroll from 'smooth-scroll';

class TUF {
  constructor() {
    // allow transitions
    document.body.classList.remove('not-ready');

    // initialise header
    new Header();

    var scroll = new SmoothScroll('a[href*="#"]');
  }
}

new TUF();
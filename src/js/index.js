import Header from './components/header.js';
import Form from './components/form.js';
import SmoothScroll from 'smooth-scroll';

class TUF {
  constructor() {
    // allow transitions
    document.body.classList.remove('not-ready');

    // initialise header
    new Header();

    // initialise form
    new Form();

    new SmoothScroll('a[href*="#"]');
  }
}

new TUF();

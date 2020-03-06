import SmoothScroll from 'smooth-scroll';

import Speckle from './components/speckle';
import Particles from './components/particles';
import Header from './components/header.js';
import Form from './components/form.js';

class TUF {
  constructor() {
    // allow transitions
    document.body.classList.remove('not-ready');

    // initialise header
    new Header();

    // initialise form
    new Form();

    new SmoothScroll('a[href*="#"]');

    new Speckle();

    const particles = new Particles();
    particles.init();
  }
}

new TUF();

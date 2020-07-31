import anime from 'animejs/lib/anime.es.js';

class animeJS {
  constructor() {
    this._init();
  }

  _init() {
    anime({
      targets: ['.animate_image'],
      translateY: 30,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }
}

new animeJS();

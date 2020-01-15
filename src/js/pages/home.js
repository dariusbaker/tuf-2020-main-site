import Glide from '@glidejs/glide';

import { debounce } from '../utils';

class Home {
  constructor() {
    // initialise clients list
    new Glide('.tuf-home-clients__list', {
      type: 'carousel',
      autoplay: 3000,
      perView: 8,
      focusAt: 'center',
      breakpoints: {
        800: {
          perView: 4
        },
        480: {
          perView: 3
        }
      }
    }).mount();

    // initialise testimonials
    new Glide('.tuf-home-testimonials__list', {
      type: 'carousel',
      perView: 1,
    }).mount();

    this._whatWeDoCarousel = null;

    this._initWhatWeDoCarousel();

    this._toggleWhatWeDoCarousel();

    window.addEventListener(
      'resize',
      debounce(() => {
        this._toggleWhatWeDoCarousel();
      }, 300)
    );
  }

  _initWhatWeDoCarousel() {
    this._whatWeDoCarousel = new Glide(".tuf-home-what-we-do__list", {
      type: "carousel",
      focusAt: "center",
      perView: 4,
      gap: 24,
      breakpoints: {
        1310: {
          perView: 2
        },
        600: {
          perView: 2
        },
        480: {
          perView: 1,
          focusAt: 1,
          peek: 40
        }
      }
    }).mount();
  }

  _toggleWhatWeDoCarousel() {
    let mql = window.matchMedia("(min-width: 1310px)");

    if (mql.matches) {
      this._whatWeDoCarousel.destroy();
      this._removeWhatWeDoGlideSlideClone();
    } else {
      this._initWhatWeDoCarousel();
    }
  }

  _removeWhatWeDoGlideSlideClone() {
    const whatWeDoSlideClones = document.querySelectorAll('.tuf-home-what-we-do__list .glide__slide--clone');

    whatWeDoSlideClones.forEach((elem) => {
      try {
        elem.parentNode.removeChild(elem);
      } catch (e) {
        console.log(elem);
      }
    });
  }
}

new Home();
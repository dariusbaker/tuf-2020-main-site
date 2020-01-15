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
      type: 'slider',
      focusAt: "center",
      perView: 1,
      gap: 24,
      rewind: false,
      breakpoints: {
        1310: {
          perView: 2
        },
        600: {
          perView: 2
        },
        480: {
          perView: 1,
          peek: 40
        }
      }
    }).mount();
  }

  _toggleWhatWeDoCarousel() {
    // only enable carousel if width < 1310px
    let mql = window.matchMedia("(min-width: 1310px)");

    if (mql.matches) {
      this._whatWeDoCarousel.destroy();
      this._whatWeDoCarousel = null;

      // on glide destroy, it is some what failed to remove the clone items
      // we need to do this manually
      this._removeWhatWeDoGlideSlideClone();
    } else {
      this._initWhatWeDoCarousel();
    }
  }

  _removeWhatWeDoGlideSlideClone() {
    const whatWeDoSlideClones = document.querySelectorAll('.tuf-home-what-we-do__list .glide__slide--clone');

    whatWeDoSlideClones.forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
  }
}

new Home();
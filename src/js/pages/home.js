import Glide from '@glidejs/glide';

import { debounce } from '../utils';

class Home {
  constructor() {
    this._ELEMENTS_CLASSES = {
      clients: '.tuf-home-clients__list',
      testimonials: '.tuf-home-testimonials__list',
      what_we_do: '.tuf-home-what-we-do__list',
      seek_label: '.tuf-home-what-do-you-seek__content__navigation__label',
      seek_navigation: '.tuf-home-what-do-you-seek__content__navigation-wrapper',
      seek_navigation_visible: '.tuf-home-what-do-you-seek__content__navigation-wrapper--visible'
    };

    this._whatWeDoCarousel = null;
    this._testimonialCarousel = null;
    this._clientsCarousel = null;

    this._initClientsCarousel();

    this._initTestimonialCarousel();

    this._initWhatWeDoCarousel();

    this._toggleWhatWeDoCarousel();

    window.addEventListener(
      'resize',
      debounce(() => {
        this._toggleWhatWeDoCarousel();
      }, 300)
    );
  }

  _initClientsCarousel() {
    this._clientsCarousel = new Glide(this._ELEMENTS_CLASSES.clients, {
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
  }

  _initTestimonialCarousel() {
    this._testimonialCarousel = new Glide(this._ELEMENTS_CLASSES.testimonials, {
      type: 'carousel',
      perView: 1,
    }).mount();
  }

  _initWhatWeDoCarousel() {
    this._whatWeDoCarousel = new Glide(this._ELEMENTS_CLASSES.what_we_do, {
      type: "slider",
      focusAt: "center",
      perView: 3,
      gap: 24,
      rewind: false,
      startAt: 1,
      breakpoints: {
        1000: {
          perView: 3,
        },
        900: {
          perView: 2
        },
        600: {
          perView: 1.5,
          peek: 40
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
    let mql = window.matchMedia('(min-width: 1310px)');

    if (mql.matches) {
      if (this._whatWeDoCarousel) {
        this._whatWeDoCarousel.destroy();
        this._whatWeDoCarousel = null;

        // on glide destroy, it is some what failed to remove the clone items
        // we need to do this manually
        this._removeWhatWeDoGlideSlideClone();
      }
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
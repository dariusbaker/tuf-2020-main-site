import Glide from '@glidejs/glide';

import HomeTestimonials from '../components/home-testimonials';
import HomeWhatWeDo from '../components/home-what-we-do';
import HomeCaseStudies from '../components/home-case-studies';
import HomeInstagram from '../components/home-instagram';
import HomeSeek from '../components/home-seek';
import HomeAva from '../components/home-ava';

class Home {
  constructor() {
    this._CONST = {
      clients_selector: '.clients__list'
    };

    // initialise testimonials carousel
    import(
      /* webpackChunkName: 'tuf-data-home-testimonials' */
      '../data/home-testimonials.js'
    ).then(
      module => {
        new HomeTestimonials(module.HOME_TESTIMONIALS_DATA);
      }
    );

    // initialise ava component
    import(
      /* webpackChunkName: 'tuf-data-home-ava' */
      '../data/home-ava.js'
    ).then(
      module => {
        new HomeAva(module.HOME_AVA_DATA);
      }
    );

    // initialise what-we-do component
    import(
      /* webpackChunkName: 'tuf-data-home-what-we-do' */
      '../data/home-what-we-do.js'
    ).then(
      module => {
        new HomeWhatWeDo(module.HOME_WHAT_WE_DO_DATA);
      }
    );

    // initialise case-studies component
    import(
      /* webpackChunkName: 'tuf-data-case-studies' */
      '../data/case-studies.js'
    ).then(
      module => {
        new HomeCaseStudies(module.HOME_CASE_STUDIES_DATA);
      }
    );

    // initialise seek component
    import(
      /* webpackChunkName: 'tuf-data-home-seek' */
      '../data/home-seek.js'
    ).then(
      module => {
        new HomeSeek(module.HOME_SEEK_DATA);
      }
    );

    // load instagram feed
    new HomeInstagram();

    this._clientsCarousel = null;

    this._initClientsCarousel();
  }

  _initClientsCarousel() {
    this._clientsCarousel = new Glide(this._CONST.clients_selector, {
      type: 'carousel',
      autoplay: 3000,
      perView: 5,
      focusAt: 'center',
      breakpoints: {
        800: {
          perView: 5
        },
        480: {
          perView: 2
        }
      }
    }).mount();
  }
}

new Home();

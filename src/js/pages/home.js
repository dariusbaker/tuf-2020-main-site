// Require the polyfill before requiring any other modules.
require('intersection-observer');

import  * as TiltJS from 'vanilla-tilt/dist/vanilla-tilt';

import Glide from '@glidejs/glide';

import HomeTestimonials from '../components/home-testimonials';
import HomeWhatWeDo from '../components/home-what-we-do';
import HomeCaseStudies from '../components/home-case-studies';
import HomeSeek from '../components/home-seek';
import HomeAva from '../components/home-ava';
import { debounce } from '../utils.js';

class Home {
  constructor() {
    this._CONST = {
      clients_selector: '.clients__list',
      clients_bg_selector: '.clients__list-bg',
      carousel_grid: {
        mobile: 20,
        desktop: 40
      },
      carousel_grid_margin: {
        mobile: 16,
        desktop: 48
      },
      carousel_bg_bp: 1024,
      base_font: 16
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

    this._clientsCarousel = null;

    this._initClientsCarousel();

    this._$clientBg = document.querySelector(this._CONST.clients_bg_selector);

    this._resizeCarouselBg();

    // add resize event
    window.addEventListener(
      'resize',
      debounce(() => {
        this._resizeCarouselBg();
      }, 300)
    );
  }

  _resizeCarouselBg() {
    const mql = window.matchMedia(`(min-width: ${this._CONST.carousel_bg_bp}px)`);

    const gridSize = mql.matches ? this._CONST.carousel_grid.desktop : this._CONST.carousel_grid.mobile;

    let marginSize = mql.matches ? this._CONST.carousel_grid_margin.desktop : this._CONST.carousel_grid_margin.mobile;

    const maxBgWidth = document.body.offsetWidth - (marginSize * 2);

    const maxGrid = Math.floor(maxBgWidth / gridSize);

    this._$clientBg.style.maxWidth = `${(((maxGrid * gridSize) + 1) / this._CONST.base_font)}rem`;
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

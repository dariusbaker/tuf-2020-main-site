import Glide from '@glidejs/glide';

import { debounce } from '../utils';

class Home {
  constructor() {
    this._CONST = {
      clients_selector: '.tuf-home-clients__list',
      testimonials_selector: '.tuf-home-testimonials__list',
      what_we_do_selector: '.tuf-home-what-we-do__list',
      seek_label_selector: '.tuf-home-what-do-you-seek__content__navigation__label',
      seek_navigation_selector: '.tuf-home-what-do-you-seek__content__navigation-wrapper',
      seek_navigation_visible_class: 'tuf-home-what-do-you-seek__content__navigation-wrapper--visible',
      seek_item_selector: '.tuf-home-what-do-you-seek__content__navigation__item',
      seek_item_dialog_selector: '.tuf-home-what-do-you-seek__dialog',
      seek_item_dialog_visible_class: 'tuf-home-what-do-you-seek__dialog--visible',
      seek_items_idle_selector: '.tuf-home-what-do-you-seek__content__cards__items',
      seek_items_idle_hidden_class: 'tuf-home-what-do-you-seek__content__cards__items--hidden',
      seek_dialog_title_selector: '#seek-dialog-title',
      seek_dialog_type_selector: '#seek-dialog-type',
      seek_dialog_content_selector: '#seek-dialog-content',
      seek_dialog_image_selector: '#seek-dialog-image',
    };

    this._whatWeDoCarousel = null;
    this._testimonialCarousel = null;
    this._clientsCarousel = null;

    this._seekLabelElem = document.querySelector(
      this._CONST.seek_label_selector
    );

    this._seekNavigationElem = document.querySelector(
      this._CONST.seek_navigation_selector
    );

    this._seekNavItems = document.querySelectorAll(
      this._CONST.seek_item_selector
    );

    this._seekIdleItemsElem = document.querySelector(
      this._CONST.seek_items_idle_selector
    );

    this._seekDialogElem = document.querySelector(
      this._CONST.seek_item_dialog_selector
    );

    this._seekDialogTitleElem = document.querySelector(
      this._CONST.seek_dialog_title_selector
    );

    this._seekDialogTypeElem = document.querySelector(
      this._CONST.seek_dialog_type_selector
    );

    this._seekDialogImageElem = document.querySelector(
      this._CONST.seek_dialog_image_selector
    );

    this._seekDialogContentElem = document.querySelector(
      this._CONST.seek_dialog_content_selector
    );

    this._seekNavOpen = false;

    this._seekDialogOpen = false;

    this._showSeekHandler = (e) => this._showSeekEvent(e);
    this._seekLabelClickHandler = () => this._toggleSeekOptions();
    this._seekLabelEnterHandler = (e) => {
      if (13 == e.keyCode) {
        this._toggleSeekOptions();
      }
    };

    this._initSeekNav();
    this._bindSeekItemsOptions();

    this._initClientsCarousel();

    this._initTestimonialCarousel();

    this._initWhatWeDoCarousel();

    this._toggleWhatWeDoCarousel();

    window.addEventListener(
      'resize',
      debounce(() => {
        this._toggleWhatWeDoCarousel();
        this._initSeekNav();
      }, 300)
    );
  }

  _getSeekItemByType(type) {
    return window.seekList.filter((item) => item.type === type);
  }

  _initSeekNav() {
    // only enable carousel if width < 1024px
    let mql = window.matchMedia('(min-width: 1024px)');

    if (mql.matches) {
      this._seekLabelElem.removeAttribute('tabindex');
      // remove events on seek label
      this._seekLabelElem.removeEventListener('click', this._seekLabelClickHandler);
      this._seekLabelElem.removeEventListener('keydown', this._seekLabelEnterHandler);
    } else {
      this._seekLabelElem.setAttribute('tabindex', 0);
      // add events on seek label
      this._seekLabelElem.addEventListener('click', this._seekLabelClickHandler);
      this._seekLabelElem.addEventListener('keydown', this._seekLabelEnterHandler);
    }
  }

  _toggleSeekOptions() {
    if (this._seekNavOpen) {
      this._seekNavigationElem.classList.remove(
        this._CONST.seek_navigation_visible_class
      );
    } else {
      this._seekNavigationElem.classList.add(
        this._CONST.seek_navigation_visible_class
      );
    }

    this._seekNavOpen = !this._seekNavOpen;
  }

  _showSeekEvent(e) {
    const type = e.target.getAttribute('data-type');

    const seekDetails = this._getSeekItemByType(type);

    if (!seekDetails || !seekDetails.length) {
      return;
    }

    // bind content
    this._seekDialogTitleElem.innerText = seekDetails[0].title;

    this._seekDialogTypeElem.innerText = seekDetails[0].type;

    this._seekDialogImageElem.src = seekDetails[0].image;

    this._seekDialogContentElem.innerHTML = seekDetails[0].content.map((item) => `<p>${item}</p>`).join('');

    if (!this._seekDialogOpen) {
      // hide idle items
      this._seekIdleItemsElem.classList.add(this._CONST.seek_items_idle_hidden_class);

      // show dialog
      this._seekDialogElem.classList.add(this._CONST.seek_item_dialog_visible_class);
    }

    console.log(seekDetails);
  }

  _bindSeekItemsOptions() {
    this._seekNavItems.forEach((elem) => {
      elem.addEventListener('click', this._showSeekHandler);
    });
  }

  _initClientsCarousel() {
    this._clientsCarousel = new Glide(this._CONST.clients_selector, {
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
    this._testimonialCarousel = new Glide(this._CONST.testimonials_selector, {
      type: 'carousel',
      perView: 1,
    }).mount();
  }

  _initWhatWeDoCarousel() {
    this._whatWeDoCarousel = new Glide(this._CONST.what_we_do_selector, {
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
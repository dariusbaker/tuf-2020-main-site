import Glide from '@glidejs/glide';

import { debounce, makeXHRJsonCall } from '../utils';
import HomeTestimonials from '../components/home-testimonials';
import HomeWhatWeDo from '../components/home-what-we-do';

import * as config from '../config';

class Home {
  constructor() {
    this._CONST = {
      instagram_list_selector: '.instagram__list',
      instagram_item_template_selector: '#instagram-feed',
      clients_selector: '.clients__list',
      seek_label_selector: '.what-do-you-seek__content__navigation__label',
      seek_navigation_selector: '.what-do-you-seek__content__navigation-wrapper',
      seek_navigation_visible_class: 'what-do-you-seek__content__navigation-wrapper--visible',
      seek_item_selected_class: 'what-do-you-seek__content__navigation__item--selected',
      seek_item_selector: '.what-do-you-seek__content__navigation__item',
      seek_item_dialog_selector: '.what-do-you-seek__dialog',
      seek_item_dialog_visible_class: 'what-do-you-seek__dialog--visible',
      seek_items_idle_selector: '.what-do-you-seek__content__cards__items',
      seek_item_cta_links_selector: '.what-do-you-seek__dialog__ctas__link',
      seek_items_idle_hidden_class: 'what-do-you-seek__content__cards__items--hidden',
      seek_dialog_title_selector: '#seek-dialog-title',
      seek_dialog_subtitle_selector: '#seek-dialog-subtitle',
      seek_dialog_type_selector: '#seek-dialog-type',
      seek_dialog_content_selector: '#seek-dialog-content',
      seek_dialog_image_selector: '#seek-dialog-image',
      seek_dialog_close_selector: '.what-do-you-seek__dialog__close-btn'
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

    // initialise what-we-do component
    import(
      /* webpackChunkName: 'tuf-data-home-what-we-do' */
      '../data/home-what-we-do.js'
    ).then(
      module => {
        new HomeWhatWeDo(module.HOME_WHAT_WE_DO_DATA);
      }
    );

    this._clientsCarousel = null;

    this._instagramListElem = document.querySelector(
      this._CONST.instagram_list_selector
    );

    this._instagramItemTemplate = document.querySelector(
      this._CONST.instagram_item_template_selector
    );

    this._seekLabelElem = document.querySelector(
      this._CONST.seek_label_selector
    );

    this._seekLabelCopyElem = this._seekLabelElem.querySelector('span');

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

    this._seekDialogCloseElem = document.querySelector(
      this._CONST.seek_dialog_close_selector
    );

    this._seekDialogTitleElem = document.querySelector(
      this._CONST.seek_dialog_title_selector
    );

    this._seekDialogSubtitleElem = document.querySelector(
      this._CONST.seek_dialog_subtitle_selector
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

    this._selectedSeekType = null;

    this._minWidthForSeekDesktop = '1280px';

    this._showSeekHandler = (e) => this._showSeekEvent(e);
    this._seekLabelClickHandler = () => this._toggleSeekOptions();
    this._seekLabelEnterHandler = (e) => {
      if (13 == e.keyCode) {
        this._toggleSeekOptions();
      }
    };

    this._seekCloseHandler = () => this._closeDialogEvent();

    this._seekDialogCloseElem.addEventListener('click', this._seekCloseHandler);

    this._initSeekNav();
    this._bindSeekItemsOptions();

    this._initClientsCarousel();

    window.addEventListener(
      'resize',
      debounce(() => {
        this._initSeekNav();
      }, 300)
    );

    this._getInstagramFeed();
  }

  _getInstagramFeed() {
    makeXHRJsonCall(config.INSTAGRAM_API_URL, null, 'GET')
      .then((res) => {
        const items = res.data;

        // if no instagram feed, load placeholder
        if (!items && !items.length) {
          return;
        }

        // wipe current list
        while (this._instagramListElem.firstChild) {
          this._instagramListElem.removeChild(this._instagramListElem.firstChild);
        }

        const max = config.MAX_INSTAGRAM_FEED > items.length ? items.length : config.MAX_INSTAGRAM_FEED;

        for (let i = 0; i < max; i++) {
          const item = items[i];
          // clone template
          const template = this._instagramItemTemplate.content.cloneNode(true);
          const anchorTag = template.querySelector('a');
          anchorTag.setAttribute('href', item.link);
          anchorTag.setAttribute('aria-label', item.caption && item.caption.text ? item.caption.text : `Instagram feed ${i + 1}`);
          anchorTag.setAttribute('style', `background-image: url(${item.images.standard_resolution.url})`);

          this._instagramListElem.appendChild(template);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  _getSeekItemByType(type) {
    return window.seekList.filter((item) => item.type === type);
  }

  _initSeekNav() {
    // only enable carousel if width < this._minWidthForSeekDesktop
    let mql = window.matchMedia(`(min-width: ${this._minWidthForSeekDesktop})`);

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

    this._updateSeekFilterLabel();
  }

  _toggleSeekOptions() {
    // only enable carousel if width < this._minWidthForSeekDesktop
    let mql = window.matchMedia(`(min-width: ${this._minWidthForSeekDesktop})`);

    if (mql.matches) {
      return;
    }

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

  _resetWhatDoYouSeekFilterLabel() {
    // reset label text
    this._seekLabelCopyElem.innerText = this._seekLabelElem.getAttribute('data-label');
  }

  _closeDialogEvent() {
    if (this._seekDialogOpen) {
      // hide dialog
      this._seekDialogElem.classList.remove(this._CONST.seek_item_dialog_visible_class);

      // show idle
      this._seekIdleItemsElem.classList.remove(this._CONST.seek_items_idle_hidden_class);

      this._seekDialogOpen = false;

      // remove selected state
      this._removeSelectedSeekItemClass();

      this._selectedSeekType = null;

      // reset label text
      this._updateSeekFilterLabel();
    }
  }

  _updateSeekFilterLabel() {
    // only enable carousel if width < this._minWidthForSeekDesktop
    let mql = window.matchMedia(`(min-width: ${this._minWidthForSeekDesktop})`);

    // if it's not a dropdown, do not update the label copy
    if (!mql.matches) {
      if (this._selectedSeekType) {
        this._seekLabelCopyElem.innerText = this._selectedSeekType;
      } else {
        this._resetWhatDoYouSeekFilterLabel();
      }
      return;
    }

    this._resetWhatDoYouSeekFilterLabel();
  }

  _removeSelectedSeekItemClass() {
    // remove selected classes before
    if (this._selectedSeekType) {
      const prevSelected = document.querySelector(`.${this._CONST.seek_item_selected_class}`);

      if (prevSelected) {
        prevSelected.classList.remove(this._CONST.seek_item_selected_class);
      }
    }
  }

  _showSeekEvent(e) {
    const type = e.target.getAttribute('data-type');

    const seekDetails = this._getSeekItemByType(type);

    if (!seekDetails || !seekDetails.length) {
      return;
    }

    // remove previously selected item
    this._removeSelectedSeekItemClass();

    // add selected class
    e.target.classList.add(this._CONST.seek_item_selected_class);

    this._selectedSeekType = type;

    // bind content
    this._seekDialogTitleElem.innerText = seekDetails[0].title;

    this._seekDialogSubtitleElem.innerText = seekDetails[0].subtitle;

    this._seekDialogTypeElem.innerText = seekDetails[0].type;

    this._seekDialogImageElem.src = seekDetails[0].image;

    this._seekDialogImageElem.setAttribute('alt', seekDetails[0].title);

    this._seekDialogContentElem.innerHTML = seekDetails[0].content.map((item) => `<p>${item}</p>`).join('');

    if (!this._seekDialogOpen) {
      // hide idle items
      this._seekIdleItemsElem.classList.add(this._CONST.seek_items_idle_hidden_class);

      // show dialog
      this._seekDialogElem.classList.add(this._CONST.seek_item_dialog_visible_class);
    }

    // close nav if not mobile
    this._toggleSeekOptions();

    // update filter label
    this._updateSeekFilterLabel();

    this._seekDialogOpen = true;
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
}

new Home();

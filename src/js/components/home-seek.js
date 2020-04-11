import { debounce } from '../utils';

export default class HomeSeek {
  constructor(data) {
    this._CONST = {
      seek_idle_card_selector: '.what-do-you-seek__content__cards__item',
      seek_navigation_selector: '#seek-cards-navigation',
      seek_navigation_items_selector: '#seek-navigation-items',
      seek_idle_cards_selector: '#seek-idle-cards',
      seek_cards_panel_selector: '#seek-cards-panel',
      seek_dialog_selector: '#seek-dialog',
      seek_dialog_title_selector: '#seek-dialog-title',
      seek_dialog_subtitle_selector: '#seek-dialog-subtitle',
      seek_dialog_type_selector: '#seek-dialog-type',
      seek_dialog_content_selector: '#seek-dialog-content',
      seek_dialog_image_selector: '#seek-dialog-image',
      seek_dialog_cta_selector: '#seek-dialog-contact-cta',
      seek_navigation_item_template_selector: '#seek-navigation-item-template',
      seek_idle_template_selector: '#seek-idle-template',
      seek_close_btn_selector: '.what-do-you-seek__dialog__close',
      nav_data_attr: 'data-type',
      seek_item_selected_class: 'what-do-you-seek__content__navigation__item--selected',
      seek_item_dialog_visible_class: 'what-do-you-seek__dialog--visible',
      seek_navigation_visible_class: 'what-do-you-seek__content__navigation-wrapper--visible',
      seek_items_idle_visible_class: 'what-do-you-seek__content__cards__items--visible',
      seek_navigation_hidden_class: 'what-do-you-seek__content__navigation--hidden'
    };

    this._minWidthForSeekDesktop = '1024px';
    this._seekDialogOpen = false;
    this._selectedSeekType = null;

    this._data = data;

    // template
    this._seekNavigationItemTemplate = document.querySelector(this._CONST.seek_navigation_item_template_selector);
    this._seekIdleItemTemplate = document.querySelector(this._CONST.seek_idle_template_selector);

    // list element
    this._seekNavigationElem = document.querySelector(this._CONST.seek_navigation_selector);
    this._seekNavigationItemsElem = document.querySelector(this._CONST.seek_navigation_items_selector);
    this._seekIdleCardsElem = document.querySelector(this._CONST.seek_idle_cards_selector);
    this._seekCardsPanelElem = document.querySelector(this._CONST.seek_cards_panel_selector);
    this._seekIdleCardsItemElem = document.querySelectorAll(this._CONST.seek_idle_card_selector);

    // dialog related element
    this._seekCloseBtnElem = document.querySelectorAll(this._CONST.seek_close_btn_selector);
    this._seekDialogElem = document.querySelector(this._CONST.seek_dialog_selector);
    this._seekDialogTitleElem = document.querySelector(this._CONST.seek_dialog_title_selector);
    this._seekDialogSubtitleElem = document.querySelector(this._CONST.seek_dialog_subtitle_selector);
    this._seekDialogTypeElem = document.querySelector(this._CONST.seek_dialog_type_selector);
    this._seekDialogContentElem = document.querySelector(this._CONST.seek_dialog_content_selector);
    this._seekDialogImageElem = document.querySelector(this._CONST.seek_dialog_image_selector);
    this._seekDialogCtaElem = document.querySelector(this._CONST.seek_dialog_cta_selector);
    this._seekDialogCtaTitleElem = this._seekDialogCtaElem.querySelector('p');
    this._seekDialogCtaAnchorElem = this._seekDialogCtaElem.querySelector('a span');

    this._showSeekHandler = (e) => this._showSeekEvent(e);

    this._seekCloseHandler = () => this._closeDialogEvent();

    this._renderSeekContent();

    this._seekNavItems = this._seekNavigationItemsElem.querySelectorAll('li');

    this._bindNavItemEvents();

    this._setCardsVisibility();

    window.addEventListener(
      'resize',
      debounce(() => {
        this._setCardsVisibility();
        this._setNavigationVisibility();
        this._adjustCardsPanelHeight();
      }, 300)
    );
  }

  _setCardsVisibility() {
    // do not show cards if it's on width < 1024
    let mql = window.matchMedia(`(min-width: ${this._minWidthForSeekDesktop})`);

    if (!mql.matches || (mql.matches && this._seekDialogOpen)) {
      this._seekIdleCardsElem.classList.remove(this._CONST.seek_items_idle_visible_class);
      return;
    }

    if (!this._seekDialogOpen) {
      // show idle
      this._seekIdleCardsElem.classList.add(this._CONST.seek_items_idle_visible_class);
    }
  }

  _setNavigationVisibility() {
    // do not show cards if it's on width < 1024
    let mql = window.matchMedia(`(min-width: ${this._minWidthForSeekDesktop})`);

    if (mql.matches || (!mql.matches && !this._seekDialogOpen)) {
      this._seekNavigationElem.classList.remove(this._CONST.seek_navigation_hidden_class);
      return;
    }

    if (this._seekDialogOpen) {
      this._seekNavigationElem.classList.add(this._CONST.seek_navigation_hidden_class);
    }
  }

  _adjustCardsPanelHeight() {
    this._doubleRaF(() => {
      this._seekCardsPanelElem.style.height = 'auto';

      if (!this._seekDialogOpen) {
        this._seekCardsPanelElem.style.height = `${this._seekIdleCardsElem.offsetHeight}px`;
        this._seekCardsPanelElem.style.maxHeight = `${this._seekIdleCardsElem.offsetHeight}px`;

        return;
      }

      this._seekCardsPanelElem.style.height = `${this._seekDialogElem.offsetHeight}px`;
      this._seekCardsPanelElem.style.maxHeight = `${this._seekDialogElem.offsetHeight}px`;
    });
  }

  _bindNavItemEvents() {
    [...this._seekNavItems, ...this._seekIdleCardsItemElem].forEach(elem => {
      elem.addEventListener('click', this._showSeekHandler);
    });

    this._seekCloseBtnElem.forEach(($button) => {
      $button.addEventListener('click', this._seekCloseHandler);
    });
  }

  _closeDialogEvent() {
    if (this._seekDialogOpen) {
      // hide dialog
      this._seekDialogElem.classList.remove(this._CONST.seek_item_dialog_visible_class);

      this._seekDialogOpen = false;

      // remove selected state
      this._removeSelectedSeekItemClass();

      this._selectedSeekType = null;

      this._adjustCardsPanelHeight();

      this._setCardsVisibility();

      this._setNavigationVisibility();
    }
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

    const selectedSeekData = seekDetails[0];

    // remove previously selected item
    this._removeSelectedSeekItemClass();

    // add selected class
    e.target.classList.add(this._CONST.seek_item_selected_class);

    this._selectedSeekType = type;

    // bind content
    this._seekDialogTitleElem.innerText = selectedSeekData.title;

    this._seekDialogSubtitleElem.innerText = selectedSeekData.subtitle;

    this._seekDialogTypeElem.innerText = selectedSeekData.type;

    this._seekDialogImageElem.src = selectedSeekData.image;

    this._seekDialogImageElem.setAttribute('alt', selectedSeekData.title);

    this._seekDialogContentElem.innerHTML = selectedSeekData.content.map((item) => `<p>${item}</p>`).join('');

    // bind cta
    this._seekDialogCtaTitleElem.innerHTML = selectedSeekData.cta.title;
    this._seekDialogCtaAnchorElem.innerText = selectedSeekData.cta.label;
    const ctaHref = encodeURI(`mailto:${this._data.email}?subject=${selectedSeekData.cta.subject.trim()}`);
    this._seekDialogCtaAnchorElem.setAttribute('href', ctaHref);

    if (!this._seekDialogOpen) {
      // show dialog
      this._seekDialogElem.classList.add(this._CONST.seek_item_dialog_visible_class);
    }

    this._seekDialogOpen = true;

    this._setCardsVisibility();

    this._setNavigationVisibility();

    this._adjustCardsPanelHeight();
  }

  _doubleRaF(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  _renderSeekContent() {
    this._data.items.forEach((item, i) => {
      // render navigation
      const navItemTemplate = this._seekNavigationItemTemplate.content.cloneNode(true);
      const navItem = navItemTemplate.querySelector('li');
      navItem.setAttribute(this._CONST.nav_data_attr, item.type);

      navItem.querySelector('span').innerHTML = item.type;

      this._seekNavigationItemsElem.appendChild(navItemTemplate);

      // render idle card
      const idleCard = this._seekIdleCardsItemElem[i];
      idleCard.setAttribute('alt', `${item.type} tarrots card`);
      idleCard.setAttribute('src', item.image);
      idleCard.setAttribute(this._CONST.nav_data_attr, item.type);
    });
  }

  _getSeekItemByType(type) {
    return this._data.items.filter((item) => item.type === type);
  }
}

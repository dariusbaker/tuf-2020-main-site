import { debounce } from '../utils.js';

export default class Header {
  constructor() {
    this._CONST = {
      bottom_threshold: 50,
      scroll_dir: {
        up: 'up',
        bottom: 'bottom'
      },
      scrolled_class: 'tuf-header--scrolled',
      animating_header_class: 'tuf-header--animating',
      transparent_header_class: 'tuf-header--transparent',
      lock_scroll_class: 'tuf-no-scroll',
      drawer_opened_class: 'tuf-header__nav-drawer--opened',
      drawer_nav_items_selector: '.tuf-header__nav-drawer__nav-item',
      header_selector: '.tuf-header',
      mobile_toggler_selector: '.tuf-header__mobile-menu-toggler',
      backdrop_selector: '.tuf-backdrop',
      nav_drawer_selector: '#tuf-nav-drawer'
    };

    this._isScrolling = false;
    this._raf = null;

    this._scrollEventWatcher = null;

    this._isAtTop = true;
    this._animating = false;
    this._allowTransitionEnd = false;

    this._lastPosY = 0;
    this._drawerOpen = false;
    this._screenLock = false;

    this._headerElement = document.querySelector(
      this._CONST.header_selector
    );

    this._mobileNavTogglerElement = document.querySelector(
      this._CONST.mobile_toggler_selector
    );

    this._screenLockElement = document.querySelector(
      this._CONST.backdrop_selector
    );

    this._mobileNavDrawerElement = document.querySelector(
      this._CONST.nav_drawer_selector
    );

    this._drawerNavItemsElement = document.querySelectorAll(
      this._CONST.drawer_nav_items_selector
    );

    this._windowResizeEventHandler = () => this._resizeEvent();
    this._scrollEventHandler = () => this._scrollHandler();
    this._transitionEndHandler = () => this._handleTransitionEnd();
    this._mobileTogglerHandler = () => this._navButtonToggleEvent();
    this._screenLockClickHandler = (e) => this._screenLockClickEvent(e);
    this._drawerNavItemsClickHandler = () => this._hideNavDrawer();

    // add scroll event listener
    window.addEventListener(
      'scroll',
      this._scrollEventHandler
    );

    // add resize event
    window.addEventListener(
      'resize',
      debounce(() => {
        this._resizeEvent();
      }, 300)
    );

    // add button nav toggler
    this._mobileNavTogglerElement.addEventListener('click', this._mobileTogglerHandler);

    // add transition end listener
    this._headerElement.addEventListener('transitionend', this._transitionEndHandler);

    // add lockscreen click listener
    this._screenLockElement.addEventListener('click', this._screenLockClickHandler);

    // bind each nav items click event
    this._drawerNavItemsElement.forEach((elem) => elem.addEventListener('click', this._drawerNavItemsClickHandler));
  }

  _resizeEvent() {
    if (this._drawerOpen) {
      let mql = window.matchMedia('(min-width: 1024px)');

      if (mql.matches) {
        this._hideNavDrawer();
      }
    }
  }

  _navButtonToggleEvent() {
    if (this._drawerOpen) {
      this._hideNavDrawer();
    } else {
      this._showNavDrawer();
    }
  }

  _showNavDrawer() {
    this._drawerOpen = true;
    this._mobileNavTogglerElement.setAttribute('aria-expanded', true);

    this._mobileNavDrawerElement.setAttribute('aria-hidden', false);

    this._mobileNavDrawerElement.classList.add(this._CONST.drawer_opened_class);

    this._showLockScreen();
  }

  _hideNavDrawer() {
    this._drawerOpen = false;
    this._mobileNavTogglerElement.setAttribute('aria-expanded', false);

    this._mobileNavDrawerElement.setAttribute('aria-hidden', true);

    this._mobileNavDrawerElement.classList.remove(this._CONST.drawer_opened_class);

    this._hideLockScreen();
  }

  _showLockScreen() {
    document.body.classList.add(this._CONST.lock_scroll_class);
    this._screenLock = true;
  }

  _hideLockScreen() {
    document.body.classList.remove(this._CONST.lock_scroll_class);
    this._screenLock = false;
  }

  _screenLockClickEvent(e) {
    // if drawer is open and element clicked is part of drawer, close it
    if (this._drawerOpen) {
      if (!this._mobileNavDrawerElement.contains(e.target)) {
        this._hideNavDrawer();
      }
    }
  }

  _scrollHandler() {
    if (!this._isScrolling) {
      this._raf = window.requestAnimationFrame(() => {
        this._handleScrollEvent();
        this._isScrolling = false;
      });
      this._isScrolling = true;
    }
  }

  _getScrollDirection() {
    return this._lastPosY >= window.scrollY ? this._CONST.scroll_dir.up : this._CONST.scroll_dir.down;
  }

  _nearBottom() {
    return (document.body.clientHeight - window.scrollY - window.innerHeight) <= this._CONST.bottom_threshold;
  }

  _hasScrolledClass() {
    return this._headerElement.classList.contains(this._CONST.scrolled_class);
  }

  _handleTransitionEnd() {
    if (this._allowTransitionEnd) {
      this._animating = false;
      this._allowTransitionEnd = false;
      this._headerElement.classList.remove(this._CONST.animating_header_class);
    }
  }

  _hideNav() {
    this._animating = true;
    this._allowTransitionEnd = true;

    this._headerElement.classList.add(
      this._CONST.animating_header_class,
      this._CONST.scrolled_class
    );
  }

  _showNav() {
    this._animating = true;
    this._allowTransitionEnd = true;

    // Add animation class to header-bar elements
    this._headerElement.classList.add(this._CONST.animating_header_class);

    // Remove Scrolled class to header-bar elements
    this._headerElement.classList.remove(this._CONST.scrolled_class);
  }

  _handleScrollEvent() {
    const hasScrolledClass = this._hasScrolledClass();

    // Get the direction
    const direction = this._getScrollDirection();

    // Need to set a threshold to avoid browser elastic scrolling triggering
    // nav hide
    const nearBottom = this._nearBottom();
    const scrollingDown = direction === this._CONST.scroll_dir.down;
    const scrollingUp = direction === this._CONST.scroll_dir.up;

    // Will hide the nav once it haves the scroll class and scrolling down
    if (!this._isAtTop && scrollingDown && !hasScrolledClass && !this._animating) {
      this._hideNav();
    } else if (!this._isAtTop && scrollingUp && hasScrolledClass && !this._animating && !nearBottom) {
      // This is for scrolling up and not at the top of the page. We also block
      // the elastic recoil causing a scroll up to fire.

      // This fix a bug in some mobile safari browsers. It randomly causes
      // this block to run while scrolling down
      if ((this._lastYPos - window.scrollY) !== 0) {
        this._showNav();
      }

      // This is a fail-safe, last check to see if that state has changed whilst
      // animating. THis is the main cause of header issues.
      if (this._animating && window.pageYOffset <= this._CONST.bottom_threshold) {
        window.requestAnimationFrame(() => {
          this._scrollHandler();
        });
      }

    // This is for preventing the nav from getting lock in a hidden state.
    } else if (this._isAtTop  && !this._animating && hasScrolledClass) {
      this._headerElement.classList.add(this._CONST.transparent_header_class);
      this._showNav();
    }

    this._isAtTop = window.scrollY <= 0;

    // if it's at top, apply transparent header
    if (this._isAtTop) {
      this._headerElement.classList.add(this._CONST.transparent_header_class);
    } else {
      this._headerElement.classList.remove(this._CONST.transparent_header_class);
    }

    this._lastPosY = window.scrollY;
  }
}
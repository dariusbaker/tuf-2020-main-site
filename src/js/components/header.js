export default class Header {
  constructor() {
    this._CONST = {
      bottom_threshold: 50,
      scroll_dir: {
        up: 'up',
        bottom: 'bottom'
      },
      scrolled_class: 'tuf-header--scrolled',
      animating_header: 'tuf-header--animating',
      transparent_header: 'tuf-header--transparent'
    };

    this._isScrolling = false;
    this._raf = null;

    this._scrollEventWatcher = null;

    this._isAtTop = true;
    this._animating = false;
    this._allowTransitionEnd = false;

    this._lastPosY = 0;

    this._headerElement = document.querySelector('.tuf-header');

    this._scrollEventHandler = () => this._scrollHandler();
    this._transitionEndHandler = () => this._handleTransitionEnd();

    // add scroll event listener
    window.addEventListener(
      'scroll',
      this._scrollEventHandler
    );

    // add transition end listener
    this._headerElement.addEventListener('transitionend', this._transitionEndHandler);
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
      this._headerElement.classList.remove(this._CONST.animating_header);
    }
  }

  _hideNav() {
    this._animating = true;
    this._allowTransitionEnd = true;

    this._headerElement.classList.add(
      this._CONST.animating_header,
      this._CONST.scrolled_class
    );
  }

  _showNav() {
    this._animating = true;
    this._allowTransitionEnd = true;

    // Add animation class to header-bar elements
    this._headerElement.classList.add(this._CONST.animating_header);

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
      this._headerElement.classList.add(this._CONST.transparent_header);
      this._showNav();
    }

    this._isAtTop = window.scrollY <= 0;

    // if it's at top, apply transparent header
    if (this._isAtTop) {
      this._headerElement.classList.add(this._CONST.transparent_header);
    } else {
      this._headerElement.classList.remove(this._CONST.transparent_header);
    }

    this._lastPosY = window.scrollY;
  }
}
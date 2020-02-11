const MIN_DURATION = .5;
const MIN_TOLERANCE = 8;

export default class Speckle {
  constructor() {
    /** @type {Array.<Object>} */
    this._specks = [];

    /** @type {boolean} */
    this._isRaf = false;

    this._init();
  }

  /**
   * Initialise instance.
   */
  _init() {
    this._specks = this._collect();

    if (this._specks.length) {
      window.addEventListener('mousemove', this._mouseMove.bind(this));
    }
  }

  /**
   * Gather all elements into an array with their associated properties.
   * @return {Array.<Object>}
   */
  _collect() {
    const $specks = [...document.querySelectorAll('.speck')];

    return $specks.map(($speck) => {
      // fallback if the "data-tolerance" attribute is missing.
      const tolerance = $speck.dataset.tolerance
        ? $speck.dataset.tolerance.split(',')
        : [MIN_TOLERANCE];

      // whether the element should move against or with the mouse movement.
      const direction = $speck.dataset.dir === '1' ? 1 : -1;

      // give element a random transition duration, ranging from 0.5s to 1s.
      $speck.style.transitionDuration = MIN_DURATION + Math.floor(Math.random() * 50) / 100 + 's';

      return {
        element  : $speck,
        dir      : direction,
        tolerance: {
          x: parseInt(tolerance[0]),
          y: parseInt(tolerance[1] || tolerance[0])
        },
      }
    });
  }

  /**
   * Moves elements according to mouse position.
   * @param {MouseEvent} e
   */
  _dance(e) {
    const midX = window.innerWidth / 2;
    const midY = window.innerHeight / 2;
    const rangeX = (midX - e.clientX) / midX;
    const rangeY = (midY - e.clientY) / midY;

    this._specks.forEach((speck) => {
      const newX = Math.floor(rangeX * speck.tolerance.x) * speck.dir;
      const newY = Math.floor(rangeY * speck.tolerance.y) * speck.dir;
      speck.element.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    });

    this._isRaf = false;
  }

  /**
   * Mouse move handler.
   * @param {MouseEvent} e
   */
  _mouseMove(e) {
    e.preventDefault();

    if (!this._isRaf) {
      this._isRaf = true;
      requestAnimationFrame(() => {
        this._dance(e);
      });
    }
  }
}

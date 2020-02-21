/** @type {number} */
const DEFAULT_FRAME_SKIP = 1;
const LIP_CHANGE_COUNT   = 2; // Number of renders to skip before changing lips
const BASE_FONT_SIZE     = 16;

export default class HomeAva {
  constructor(data) {
    let $root = document.getElementById('ask-ava');

    /** @type {HTMLElement} */
    this._$textBoxWrapper = $root.querySelector('#ask-ava-text-wrapper');
    this._$textBox        = $root.querySelector('#ask-ava-text');
    this._$next           = $root.querySelector('#ask-ava-text-next');
    this._$prev           = $root.querySelector('#ask-ava-text-prev');
    this._$lips           = $root.querySelector('.ask-ava__content__head__lips');
    this._$lastLip = null;

    /** @type {Function} */
    this._raf = null;

    /** @type {number} */
    this._currentFrame          = 0;
    this._currentIndex          = 0;
    this._currentLetter         = 0;
    this._currentLine           = 0;
    this._currentLipChangeCount = 0; // Current render, not current frame
    this._frameSkip             = 0; // Frames to skip before render
    this._totalLetters          = 0;
    this._totalLines            = 0;
    this._speechLength          = data.speech.length;
    this._maxIndex              = data.speech.length - 1;
    this._numOfLips             = this._$lips.children.length;

    /** @type {string} */
    this._currentPhrase = "";

    /** @type {boolean} */
    this._hasCompleted = false;

    /** @type {Array.<Object>} */
    this._speechContent = data.speech;

    /** @type {Array.<HTMLElement>} */
    this._lips = [...this._$lips.children];

    this._init();
  }

  _init() {
    // binding(s)
    this._speak            = this._speak.bind(this);
    this._animationLoop    = this._animationLoop.bind(this);
    this._nextClickHandler = this._nextClickHandler.bind(this);
    this._prevClickHandler = this._prevClickHandler.bind(this);

    // event listener(s)
    this._$next.addEventListener('click', this._nextClickHandler);
    this._$prev.addEventListener('click', this._prevClickHandler);

    this._hideLips(true);

    // trigger first speech
    this._speak(this._speechContent[this._currentIndex]);
  }

  /**
   * Triggers typing effect of text.
   *
   * @param {Object} textObject
   * @param {string} textObject.text
   * @param {number} textObject.frameSkip
   */
  _speak(textObject) {
    this._currentPhrase = textObject.text.split("<br>");

    // reset
    this._$textBox.innerHTML = '';
    this._currentLetter      = 0;
    this._currentLine        = 0;
    this._totalLines         = this._currentPhrase.length;
    this._totalLetters       = this._currentPhrase[0].length;
    this._frameSkip          = textObject.frameSkip || DEFAULT_FRAME_SKIP;

    cancelAnimationFrame(this._raf);

    this._hasCompleted = false;
    this._raf = requestAnimationFrame(this._animationLoop);
  }

  /**
   * RAF processes.
   */
  _animationLoop() {
    if (!this._hasCompleted) {
      this._render();
      this._raf = requestAnimationFrame(this._animationLoop);
    }
  }

  /**
   * Render text and move lips.
   */
  _render() {
    this._currentFrame++;

    if (this._currentFrame > this._frameSkip) {
      let textToRender = '';

      this._currentFrame = 0;
      this._currentLetter++;
      this._currentLipChangeCount++;

      for (let i = 0; i < this._currentLine; i++) {
        textToRender += this._currentPhrase[i] + "<br>";
      }

      textToRender += this._currentPhrase[this._currentLine].substring(
        0,
        this._currentLetter
      );

      this._$textBox.innerHTML = textToRender;

      this._fitFontSize();

      if (this._currentLipChangeCount >= LIP_CHANGE_COUNT) {
        const randomLip = Math.floor(Math.random() * this._numOfLips);
        this._currentLipChangeCount = 0;
        this._hideLips();
        this._lips[randomLip].style.opacity = 1;
      }

      // Trigger once we've rendered the current line
      if (this._currentLetter >= this._totalLetters) {
        // start rendering next line
        this._currentLine++;

        this._hideLips(true);

        if (this._currentLine >= this._totalLines) {
          // stop rendering there're no more lines
          this._hasCompleted = true;
          cancelAnimationFrame(this._raf);
        } else {
          // Reset
          this._currentLetter = 0;
          this._totalLetters = this._currentPhrase[this._currentLine].length;
        }
      }
    }
  }

  /**
   * Sets opacity of all lips to 0.
   * If reset === true, we show the first (default) lip.
   * @param {boolean} reset
   */
  _hideLips(reset = false) {
    this._lips.forEach($lip => {
      $lip.style.opacity = 0;
    });

    if (reset === true) {
      this._lips[0].style.opacity = 1;
    }
  }

  /**
   * handler for dynamic font resizing
   *
   * @param {boolean} resize
   */
  _fitFontSize(resize) {
    if (resize) {
      const innerElemComputedStyle = window.getComputedStyle(this._$textBox);
      let fontsize = parseFloat(innerElemComputedStyle.getPropertyValue('font-size').slice(0, -2));

      fontsize = (fontsize - 1) / BASE_FONT_SIZE;
      this._$textBox.style.fontSize = `${fontsize}rem`;
    }

    if (this._$textBox.offsetHeight > this._$textBox.parentNode.offsetHeight) {
      this._fitFontSize(true);
    }
  }

  /**
   * this is to reset inner font size when content change
   */
  _resetFontSize() {
    const outerElemComputedStyle = window.getComputedStyle(this._$textBoxWrapper);

    let fontsize = parseFloat(outerElemComputedStyle.getPropertyValue('font-size').slice(0, -2));

    fontsize = fontsize / BASE_FONT_SIZE;

    this._$textBox.style.fontSize = `${fontsize}rem`;
  }

  /**
   * Click handler for next button.
   * @param {Event} e
   */
  _nextClickHandler(e) {
    if (this._currentIndex < this._maxIndex) {
      if (this._hasCompleted) {
        this._currentIndex++;
        this._speak(this._speechContent[this._currentIndex]);
      } else {
        this._currentLine = this._currentPhrase.length - 1;
        this._currentLetter = this._currentPhrase[this._currentLine].length - 1;
      }
    } else {
      this._currentIndex = 0;
      this._speak(this._speechContent[this._currentIndex]);
    }

    this._resetFontSize();
  }

  /**
   * Click handler for next button.
   * @param {Event} e
   */
  _nextClickHandler(e) {
    if (this._currentIndex < this._maxIndex) {
      if (this._hasCompleted) {
        this._currentIndex++;
        this._speak(this._speechContent[this._currentIndex]);
      } else {
        this._currentLine = this._currentPhrase.length - 1;
        this._currentLetter = this._currentPhrase[this._currentLine].length - 1;
      }
    } else {
      this._currentIndex = 0;
      this._speak(this._speechContent[this._currentIndex]);
    }

    // on content change, resize inner font size to match the wrapper
    this._resetFontSize();
  }

  /**
   * Click handler for prev button.
   * @param {Event} e
   */
  _prevClickHandler(e) {
    if (this._currentIndex < this._maxIndex) {
      if (this._hasCompleted) {
        if (this._currentIndex === 0) {
          return;
        }

        this._currentIndex--;

        this._speak(this._speechContent[this._currentIndex]);
      } else {
        this._currentLine = this._currentPhrase.length - 1;
        this._currentLetter = this._currentPhrase[this._currentLine].length - 1;
      }
    } else {
      this._currentIndex = 0;
      this._speak(this._speechContent[this._currentIndex]);
    }

    this._resetFontSize();
  }
}

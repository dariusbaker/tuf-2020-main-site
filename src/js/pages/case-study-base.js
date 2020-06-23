import * as AOS from 'aos/dist/aos.js';

class CaseStudyBase {
  constructor() {
    this._init();
  }

  _init() {
    document.addEventListener("DOMContentLoaded", function()
    {
        setTimeout(function () {
          AOS.init({once: true});
        }, 500);
    });
  }
}

new CaseStudyBase();
import * as AOS from 'aos/dist/aos.js';

class CaseStudyBase {
  constructor() {
    this._init();
  }

  _init() {
    AOS.init({ startEvent: 'load', once: true });
  }
}

new CaseStudyBase();

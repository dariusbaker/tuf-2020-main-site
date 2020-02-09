import { debounce } from '../utils.js';

export default class Form {
  constructor() {
    this._SELECTORS = {
      project_details: '#contact-project',
      input: 'input,textarea',
      required: '[required]',
      form: '#contact-form',
      submit_btn: '#submit-form-btn'
    };

    this._CLASS = {
      form_error: 'contact-form__form__input--error'
    };

    this._formElem = document.querySelector(this._SELECTORS.form);
    this._formInputs = this._formElem.querySelectorAll(this._SELECTORS.input);

    this._submitBtnElem = document.querySelector(this._SELECTORS.submit_btn);

    this._projectDetailsElem = document.querySelector(this._SELECTORS.project_details);

    this._allRequiredInputElem = document.querySelectorAll(this._SELECTORS.required);

    this._initialTextAreaHeight = `${this._projectDetailsElem.scrollHeight}px`;

    this._bindInputKeyUpEvent();
    this._bindProjectDetailsEvent();
    this._bindSubmitEvent();
    this._bindRequiredInputFocusEvent();
  }

  _bindSubmitEvent() {
    this._submitBtnElem.addEventListener('click', () => {
      this._validateForm();
    });
  }

  _bindRequiredInputFocusEvent() {
    this._allRequiredInputElem.forEach((elem) => {
      elem.addEventListener('focus', (e) => {
        e.target.parentNode.classList.remove(this._CLASS.form_error);
      });
    });
  }

  _validateForm() {
    let valid = true;

    this._allRequiredInputElem.forEach((elem) => {
      valid = valid && elem.value.trim() !== '';

      if (!valid) {
        elem.parentNode.classList.add(this._CLASS.form_error);
      } else {
        elem.parentNode.classList.remove(this._CLASS.form_error);
      }
    });

    return valid;
  }

  _bindInputKeyUpEvent() {
    // this is to set value attribute on key up
    // if value is not empty, form label should be visibles
    this._formInputs.forEach((elem) => {
      elem.addEventListener('keyup', (e) => {
        e.target.setAttribute('value', e.target.value);
      });
    })
  }

  _bindProjectDetailsEvent() {
    // this is to support auto adjust height
    this._projectDetailsElem.addEventListener('keydown', debounce((e) => {
      if (!this._projectDetailsElem.value.trim()) {
        e.target.style.height = this._initialTextAreaHeight;
        return;
      }
      // for box-sizing other than "content-box" use:
      // el.style.cssText = '-moz-box-sizing:content-box';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }, 100));
  }
}
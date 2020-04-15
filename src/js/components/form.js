import { debounce } from '../utils.js';

export default class Form {
  constructor() {
    this._SELECTORS = {
      project_details: '#contact-project',
      input: 'input,textarea',
      required: '[required]',
      form: '#contact-form',
      msg: '#form-message',
      submit_btn: '#submit-form-btn'
    };

    this._MSG = {
      error: 'Oops, it seems like there\'s glitch a the Universe. Please try again.',
      success: 'The Universe has received your transmission. We shall respond shortly. Thank you!'
    };

    this._CLASS = {
      form_error: 'contact-form__form__input--error'
    };

    this._API = '/talk-to-us.php';

    this._formElem = document.querySelector(this._SELECTORS.form);
    this._formInputs = this._formElem.querySelectorAll(this._SELECTORS.input);

    this._msgElem = document.querySelector(this._SELECTORS.msg);

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
      const isValid = this._validateForm();

      if (isValid) {
        const data = new FormData();
        this._formInputs.forEach((input) => {
          data.append(input.name, input.value);
        });

        fetch(this._API, {
          method: 'post',
          body: data
        })
        .then((res) => {
          res.text().then((message) => {
            if (message == '1') {
              this._showMessage();
              return;
            } else {
              this._showMessage(true);
            }
          }).catch((error) => {
            this._showMessage(true);
          })
          if (res.status >= 200 && res.status < 300) {
            this._showMessage();
            return;
          }

          this._showMessage(true);
        })
        .catch((err) => {
          this._showMessage();
        });
      }
    });
  }

  _showMessage(isError) {
    this._msgElem.innerText = isError ? this._MSG.error : this._MSG.success;

    this._msgElem.className = 'contact-form__form__message';

    const classNames = isError ? ['error', 'error--visible'] : ['success', 'success--visible'];

    classNames.forEach((name) => {
      this._msgElem.classList.add(name);
    });

    setTimeout(() => {
      this._removeMessage();
    }, 5000);
  }

  _removeMessage() {
    this._msgElem.className = 'contact-form__form__message';
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

      if (elem.type === 'email') {
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        valid = valid && elem.value.trim().match(regexEmail);
      }

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

      e.target.style.height = `${e.target.scrollHeight}px`;
    }, 100));
  }
}

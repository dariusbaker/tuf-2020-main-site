import Glide from '@glidejs/glide';
import { debounce } from "../utils";

export default class HomeWhatWeDo {
  constructor(data) {
    this._CONST = {
      what_we_do_pagination_selector: '#what-we-do-paginations',
      what_we_do_items_selector: '#what-we-do-items',
      what_we_do_carousel_selector: '#what-we-do-carousel',
      what_we_do_item_template_selector: '#what-we-do-item-template',
      what_we_do_pagination_template_selector: '#glidejs-pagination-template',
      footnote_title_selector: '#what-we-do-footnote-title',
      footnote_content_selector: '#what-we-do-footnote-content',
      slide_clones_selector: '.what-we-do__list .glide__slide--clone',
      pagination_data_attr: 'data-glide-dir'
    };

    this._data = data;

    this._whatWeDoCarousel = null;

    this._itemsElem = document.querySelector(this._CONST.what_we_do_items_selector);
    this._paginationsElem = document.querySelector(this._CONST.what_we_do_pagination_selector);
    this._footnoteTitleElem = document.querySelector(this._CONST.footnote_title_selector);
    this._footnoteContentElem = document.querySelector(this._CONST.footnote_content_selector);

    this._itemTemplate = document.querySelector(this._CONST.what_we_do_item_template_selector);
    this._paginationTemplate = document.querySelector(this._CONST.what_we_do_pagination_template_selector);

    this._renderWhatWeDoContent();
    this._initWhatWeDoCarousel();
    this._attachEventListener();
  }

  _attachEventListener() {
    window.addEventListener(
      'resize',
      debounce(() => {
        this._toggleWhatWeDoCarousel();
      }, 300)
    );
  }

  _renderWhatWeDoContent() {
    // render footnote content
    this._footnoteTitleElem.innerHTML = this._data.footnote.title;

    this._footnoteContentElem.innerHTML = this._data.footnote.content;

    // render list item
    this._data.items.forEach((item, i) => {
      const contentTemplate = this._itemTemplate.content.cloneNode(true);
      const contentLink = contentTemplate.querySelector('a');
      contentLink.setAttribute('href', item.href);

      const contentImage = contentTemplate.querySelector('img');
      contentImage.setAttribute('src', item.image);
      contentImage.setAttribute('alt', item.title);

      const contentTitle = contentTemplate.querySelector('h3');
      contentTitle.innerHTML = item.title;

      const contentBody = contentTemplate.querySelector('p');
      contentBody.innerHTML = item.content;

      const contentFootnote = contentTemplate.querySelector('small');
      contentFootnote.innerHTML = item.footnote;

      const contentCta = contentTemplate.querySelector('span');
      contentCta.innerHTML = item.cta_label;

      this._itemsElem.appendChild(contentTemplate);

      const paginationTemplate = this._paginationTemplate.content.cloneNode(true);
      const paginationTemplateBtn = paginationTemplate.querySelector('button');
      paginationTemplateBtn.setAttribute(this._CONST.pagination_data_attr, `=${i}`);
      paginationTemplateBtn.setAttribute('aria-label', `what we do item ${i + 1}`);

      this._paginationsElem.appendChild(paginationTemplate);
    });
  }

  _initWhatWeDoCarousel() {
    this._whatWeDoCarousel = new Glide(this._CONST.what_we_do_carousel_selector, {
      type: 'slider',
      focusAt: 'center',
      perView: 3,
      gap: 24,
      rewind: false,
      startAt: 1,
      breakpoints: {
        1000: {
          perView: 3,
        },
        900: {
          perView: 2
        },
        600: {
          perView: 1.5,
          peek: 40
        },
        480: {
          perView: 1,
          peek: 40
        }
      }
    }).mount();
  }

  _toggleWhatWeDoCarousel() {
    // only enable carousel if width < 1310px
    let mql = window.matchMedia('(min-width: 1310px)');

    if (mql.matches) {
      if (this._whatWeDoCarousel) {
        this._whatWeDoCarousel.destroy();
        this._whatWeDoCarousel = null;

        // on glide destroy, it is some what failed to remove the clone items
        // we need to do this manually
        this._removeWhatWeDoGlideSlideClone();
      }
    } else {
      this._initWhatWeDoCarousel();
    }
  }

  _removeWhatWeDoGlideSlideClone() {
    const whatWeDoSlideClones = document.querySelectorAll(this._CONST.slide_clones_selector);

    whatWeDoSlideClones.forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });
  }
}
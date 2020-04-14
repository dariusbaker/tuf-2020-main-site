import Glide from '@glidejs/glide';

export default class HomeTestimonials {
  constructor(data) {
    this._CONST = {
      testimonials_item_template_selector: '#testimonial-item-template',
      testimonials_pagination_template_selector: '#glidejs-pagination-template',
      testimonials_items_selector: '#testimonials-items',
      testimonials_pagination_selector: '#testimonials-pagination',
      testimonials_carousel_selector: '#testimonials-carousel',
      pagination_data_attr: 'data-glide-dir'
    };

    this._testimonialCarousel = null;

    this._data = data;

    this._itemsElem = document.querySelector(this._CONST.testimonials_items_selector);
    this._paginationsElem = document.querySelector(this._CONST.testimonials_pagination_selector);

    this._itemTemplate = document.querySelector(this._CONST.testimonials_item_template_selector);
    this._paginationTemplate = document.querySelector(this._CONST.testimonials_pagination_template_selector);

    this._renderTestimonialsContent();

    this._initialiseCarousel();
  }

  _renderTestimonialsContent() {
    this._data.forEach((item, i) => {
      const contentTemplate = this._itemTemplate.content.cloneNode(true);
      const contentBody = contentTemplate.querySelector('p');
      contentBody.innerHTML = item.content;
      const contentName = contentTemplate.querySelector('.testimonials__list-item__name');
      const contentJob = contentTemplate.querySelector('.testimonials__list-item__job');
      contentName.innerHTML = item.name;
      contentJob.innerHTML = item.job;

      this._itemsElem.appendChild(contentTemplate);

      const paginationTemplate = this._paginationTemplate.content.cloneNode(true);
      const paginationTemplateBtn = paginationTemplate.querySelector('button');
      paginationTemplateBtn.setAttribute(this._CONST.pagination_data_attr, `=${i}`);
      paginationTemplateBtn.setAttribute('aria-label', `testimonial ${i + 1}`);

      this._paginationsElem.appendChild(paginationTemplate);
    });
  }

  _initialiseCarousel() {
    this._testimonialCarousel = new Glide(this._CONST.testimonials_carousel_selector, {
      type: 'carousel',
      perView: 1,
    }).mount();
  }
}
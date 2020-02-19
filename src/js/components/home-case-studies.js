export default class HomeCaseStudies {
  constructor(data) {
    this._CONST = {
      case_studies_list_selector: '#case-studies-list',
      case_study_item_template_selector: '#case-study-item-template',
      base_case_study_url: '/case-studies/'
    };

    this._data = data;

    this._itemsElem = document.querySelector(this._CONST.case_studies_list_selector);

    this._itemTemplate = document.querySelector(this._CONST.case_study_item_template_selector);

    this._renderCaseStudiesContent();
  }

  _renderCaseStudiesContent() {
    this._data
      .filter((item) => item.featured_in_home)
      .sort((a, b) => a.featured_in_home - b.featured_in_home)
      .forEach((item) => {
        const contentTemplate = this._itemTemplate.content.cloneNode(true);
        const contentLink = contentTemplate.querySelector('a');
        contentLink.setAttribute('href', `${this._CONST.base_case_study_url}${item.slug}`);

        const contentImage = contentTemplate.querySelector('img');
        contentImage.setAttribute('src', item.image);
        contentImage.setAttribute('alt', item.title);

        const contentHeader = contentTemplate.querySelector('h3');
        contentHeader.innerHTML = item.title;

        const contentTags = contentTemplate.querySelector('div.tuf-case-study-card__content__tags');
        contentTags.innerText = item.tags.join(' • ');

        this._itemsElem.appendChild(contentTemplate);
      });
  }
}
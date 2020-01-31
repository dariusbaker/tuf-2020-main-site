export default class HomeCaseStudies {
  constructor(data) {
    this._CONST = {
      case_studies_list_selector: '#case-studies-list',
      case_study_item_template_selector: '#case-study-item-template',
      case_study_tag_template_selector: '#case-study-tag-template',
      base_case_study_url: '/case-studies/'
    };

    this._data = data;

    this._itemsElem = document.querySelector(this._CONST.case_studies_list_selector);

    this._itemTemplate = document.querySelector(this._CONST.case_study_item_template_selector);
    this._itemTagTemplate = document.querySelector(this._CONST.case_study_tag_template_selector);

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

        const contentTags = contentTemplate.querySelector('ul');
        item.tags.forEach((tag) => {
          const tagTemplate = this._itemTagTemplate.content.cloneNode(true);
          const tagContent = tagTemplate.querySelector('li');
          tagContent.innerHTML = tag;

          contentTags.appendChild(tagTemplate);
        });

        this._itemsElem.appendChild(contentTemplate);
      });
  }
}
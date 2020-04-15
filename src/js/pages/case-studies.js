class CaseStudies {
  constructor(data) {
    this._CONST = {
      filter_btn_selector: '#case-studies-filter-btn',
      listitems_selector: '.content__list__item',
      listitems_visible_class: 'content__list__item--visible',
      dropdown_list_selector: '#case-studies-filter',
      dropdown_listitems_selector: '.content__filter__list-item',
      dropdown_list_visible_class: 'content__filter__list--visible',
      dropdown_item_template_selector: '#dropdown-item-template',
      case_study_item_template_selector: '#case-study-item-template',
      case_studies_list_selector: '#case-studies-list',
      dropdown_data_attr: 'data-type',
      tags_data_attr: 'data-tags',
      base_case_study_url: '/case-studies/',
      filter_qs: 'show',
      all_project_value: 'All Projects'
    };

    this._queryStrings = new URLSearchParams(window.location.search);

    this._data = data;

    const tags = this._data.map((item) => item.tags);
    this._uniqueTags = [...new Set([].concat(...tags))].sort();

    this._filterBtnElem = document.querySelector(this._CONST.filter_btn_selector);

    this._allTypesValue = this._filterBtnElem.getAttribute('data-alltype');
    this._filterBtnLabelElem = this._filterBtnElem.querySelector('span');

    this._dropdownListElem = document.querySelector(this._CONST.dropdown_list_selector);
    this._caseStudiesListElem = document.querySelector(this._CONST.case_studies_list_selector);

    this._dropdownItemTemplate = document.querySelector(this._CONST.dropdown_item_template_selector);
    this._caseStudyItemTemplate = document.querySelector(this._CONST.case_study_item_template_selector);

    this._dropdownExpanded = false;

    this._filterBtnEvent = () => this._toggleDropdown();
    this._filterListItemEvent = (e) => this._handleFilterSelect(e);

    this._renderCaseStudiesFilterItem();

    this._renderCaseStudiesItem();

    this._listItemsElem = document.querySelectorAll(this._CONST.listitems_selector);

    this._dropdownListItemsElem = document.querySelectorAll(this._CONST.dropdown_listitems_selector);

    this._bindFiltersEvent();

    const filterQS = this._queryStrings.get(this._CONST.filter_qs) ? decodeURIComponent(this._queryStrings.get(this._CONST.filter_qs).trim()) : null;

    if (filterQS && filterQS !== this._CONST.all_project_value && this._uniqueTags.includes(filterQS)) {
      this._filterCaseStudies(filterQS);
    }
  }

  _renderCaseStudiesItem() {
    this._data.forEach((item) => {
      const caseStudyTemplate = this._caseStudyItemTemplate.content.cloneNode(true);

      const caseStudyListItem = caseStudyTemplate.querySelector('li');
      caseStudyListItem.setAttribute(this._CONST.tags_data_attr, item.tags.join(','));

      const contentLink = caseStudyTemplate.querySelector('a');
      contentLink.setAttribute('href', `${this._CONST.base_case_study_url}${item.slug}`);

      const contentImage = caseStudyTemplate.querySelector('img');
      contentImage.setAttribute('src', item.image);
      contentImage.setAttribute('alt', item.title);

      const contentHeader = caseStudyTemplate.querySelector('h3');
      contentHeader.innerHTML = item.title;

      const contentTags = caseStudyTemplate.querySelector('div.tuf-case-study-card__content__tags');
      contentTags.innerText = item.tags.join(' • ');

      this._caseStudiesListElem.appendChild(caseStudyTemplate);
    });
  }

  _renderCaseStudiesFilterItem() {
    this._uniqueTags.forEach((tag) => {
      const tagItemTemplate = this._dropdownItemTemplate.content.cloneNode(true);
      const tagItem = tagItemTemplate.querySelector('li');
      tagItem.setAttribute(this._CONST.dropdown_data_attr, tag);
      tagItem.innerText = tag;

      this._dropdownListElem.appendChild(tagItemTemplate);
    });
  }

  _bindFiltersEvent() {
    this._filterBtnElem.addEventListener('click', this._filterBtnEvent);

    this._dropdownListItemsElem.forEach((elem) => {
      elem.addEventListener('click', this._filterListItemEvent);
    });
  }

  _toggleDropdown() {
    if (this._dropdownExpanded) {
      this._dropdownListElem.classList.remove(this._CONST.dropdown_list_visible_class);
    } else {
      this._dropdownListElem.classList.add(this._CONST.dropdown_list_visible_class);
    }

    this._dropdownExpanded = !this._dropdownExpanded;
  }

  _handleFilterSelect(e) {
    const type = e.target.getAttribute(this._CONST.dropdown_data_attr);
    this._filterCaseStudies(type);
    this._toggleDropdown();

    // set query string param
    this._queryStrings.set(this._CONST.filter_qs, decodeURIComponent(type));

    window.location.search = this._queryStrings.toString();
  }

  _filterCaseStudies(type) {
    if (!type) {
      return;
    }

    // update button label
    this._filterBtnLabelElem.innerText = type;

    // update list items
    this._toggleListItemsVisibilityByType(type);
  }

  _toggleListItemsVisibilityByType(type) {
    this._listItemsElem.forEach((elem) => {
      const itemType = elem.getAttribute(this._CONST.tags_data_attr);

      if (type === this._allTypesValue || itemType.indexOf(type) > -1) {
        if (!elem.classList.contains(this._CONST.listitems_visible_class)) {
          elem.classList.add(this._CONST.listitems_visible_class);
        }
      } else {
        elem.classList.remove(this._CONST.listitems_visible_class);
      }
    });
  }
}

import(
  /* webpackChunkName: 'tuf-data-case-studies' */
  '../data/case-studies.js'
).then(
  module => {
    new CaseStudies(module.HOME_CASE_STUDIES_DATA);
  }
);
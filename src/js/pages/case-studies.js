class CaseStudies {
  constructor() {
    this._CONST = {
      filter_btn_selector: '#case-studies-filter-btn',
      listitems_selector: '.tuf-case-studies-content__list__item',
      listitems_visible_class: 'tuf-case-studies-content__list__item--visible',
      dropdown_list_selector: '#case-studies-filter',
      dropdown_listitems_selector: '.tuf-case-studies-content__filter__list-item',
      dropdown_list_visible_class: 'tuf-case-studies-content__filter__list--visible',
    };

    this._filterBtnElem = document.querySelector(this._CONST.filter_btn_selector);

    this._allTypesValue = this._filterBtnElem.getAttribute('data-alltype');
    this._filterBtnLabelElem = this._filterBtnElem.querySelector('span');

    this._dropdownListElem = document.querySelector(this._CONST.dropdown_list_selector);
    this._dropdownListItemsElem = document.querySelectorAll(this._CONST.dropdown_listitems_selector);

    this._listItemsElem = document.querySelectorAll(this._CONST.listitems_selector);

    this._dropdownExpanded = false;

    this._filterBtnEvent = () => this._toggleDropdown();
    this._filterListItemEvent = (e) => this._handleFilterSelect(e);

    this._bindFiltersEvent();
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
    const type = e.target.getAttribute('data-type');

    if (!type) {
      return;
    }

    // update button label
    this._filterBtnLabelElem.innerText = type;

    // update list items
    this._toggleListItemsVisibilityByType(type);

    this._toggleDropdown();
  }

  _toggleListItemsVisibilityByType(type) {
    this._listItemsElem.forEach((elem) => {
      const itemType = elem.getAttribute('data-tags');

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

new CaseStudies();
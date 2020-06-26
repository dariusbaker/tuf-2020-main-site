class CaseStudyAIAHR {
    constructor(data) {
        this._CONST = {
            showmore_btn_selector: '#showMore',
            showmore_award_selector: '.awards__warpper',
            showmore_award_visible_class: 'hide-more',
        };
        this._showmoreElem = document.querySelector(this._CONST.showmore_award_selector);
        this._showmoreBtnElem = document.querySelector(this._CONST.showmore_btn_selector);
        this._awardExpanded = false;
        this._showmoreBtnEvent = () => this._toggleShowMore();
        this._bindShowMoreEvent();
        }
        
        _bindShowMoreEvent() {
        this._showmoreBtnElem.addEventListener('click', this._showmoreBtnEvent);
        }
        _toggleShowMore() {
            if (this._awardExpanded) {
              this._showmoreElem.classList.remove(this._CONST.showmore_award_visible_class);
            } else {
              this._showmoreElem.classList.add(this._CONST.showmore_award_visible_class);
            }        
            this._awardExpanded = !this._awardExpanded;
          }
}

new CaseStudyAIAHR();
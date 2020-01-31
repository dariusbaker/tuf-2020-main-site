import { makeXHRJsonCall } from "../utils";

import * as config from '../config';

export default class HomeInstagram {
  constructor() {
    this._CONST = {
      instagram_list_selector: "#instagram-list",
      instagram_item_template_selector: "#instagram-feed"
    };

    this._instagramListElem = document.querySelector(
      this._CONST.instagram_list_selector
    );

    this._instagramItemTemplate = document.querySelector(
      this._CONST.instagram_item_template_selector
    );

    this._renderInstagramFeedContent();
  }

  _renderInstagramFeedContent() {
    makeXHRJsonCall(config.INSTAGRAM_API_URL, null, 'GET')
      .then((res) => {
        const items = res.data;

        // if no instagram feed, load placeholder
        if (!items && !items.length) {
          return;
        }

        // wipe current list
        while (this._instagramListElem.firstChild) {
          this._instagramListElem.removeChild(this._instagramListElem.firstChild);
        }

        const max = config.MAX_INSTAGRAM_FEED > items.length ? items.length : config.MAX_INSTAGRAM_FEED;

        for (let i = 0; i < max; i++) {
          const item = items[i];
          // clone template
          const template = this._instagramItemTemplate.content.cloneNode(true);
          const anchorTag = template.querySelector('a');
          anchorTag.setAttribute('href', item.link);
          anchorTag.setAttribute('aria-label', item.caption && item.caption.text ? item.caption.text : `Instagram feed ${i + 1}`);
          anchorTag.setAttribute('style', `background-image: url(${item.images.standard_resolution.url})`);

          this._instagramListElem.appendChild(template);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
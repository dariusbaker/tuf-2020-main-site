class PubSub {
  /**
   * Constuctor
   */
  constructor() {
    this._topics = {};
  }

  /**
   * Fires callbacks associated with topic within map.
   * @param {string} topic
   * @param {Object} payload
   */
  publish(topic, payload) {
    if (
      this._topics[topic] !== undefined &&
      this._topics[topic].length > 0
    ) {
      for (const callback of this._topics[topic]) {
        callback !== undefined && callback(payload || {});
      }
    }
  }

  /**
   * Stores callbacks associated with defined topic for later use.
  * @param {string}   topic
  * @param {Function} callback
   */
  subscribe(topic, callback) {
    // create topic if it doesn't yet exist
    if (this._topics[topic] === undefined) {
      this._topics[topic] = [];
    }

    // save callback
    const index = this._topics[topic].push(callback) - 1;

    return {
      remove: () => {
        delete this._topics[topic][index];
      }
    }
  }
}

export default new PubSub();
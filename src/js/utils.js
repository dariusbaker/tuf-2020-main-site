const debounce = (fn, time) => {
  let timeout;

  return function(...args) {
    const functionCall = () => fn.apply(this, args);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};


/**
 * Format the header for the XHR Json Call
 * @return {object}
 */
const setXHRHeader = (token) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * XHR Json Call
 * @return {Object}
 */
const makeXHRJsonCall = (endPoint, body, method, token) => {
  return new Promise((resolve, reject) => {
    let headers = null;

    if (token) {
      headers = { ...setXHRHeader(token) };
    }

    fetch(endPoint, {
      method,
      // body,
      // headers
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        return resolve(jsonResponse);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export {
  debounce,
  makeXHRJsonCall,
};

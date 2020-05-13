class RequestError extends Error {
  constructor(msg, response, body = {}) {
    super(msg);
    this.response = response;
    this.status = response.status;
    this.body = body;
  }
}
class RequestTimeout extends Error {
  constructor(msg, url) {
    super(msg);
    this.url = url;
  }
}

export default class LightPath {
  constructor({
    baseURL = "",
    headers = {},
    query = "",
    timeout = 8000,
    onRequest = (url, options) => { },
    onComplete = data => { },
    onError = err => { }
  }) {
    this.baseURL = baseURL;
    /**
     * @type {{[x:string] : string}}
     */
    this.defaultHeaders = headers;
    this.defaultQuery = query;
    this.timeout = timeout;
    this.onRequest = onRequest;
    this.onComplete = onComplete;
    this.onError = onError;
    this.defaultOptions = arguments[0]

    if (this.defaultQuery && this.defaultQuery[0] != "?") {
      this.defaultQuery = "?" + this.defaultQuery;
    }
  }
  async request(url, options = {}) {
    try {
      if (!url.includes("//")) {
        url = this.baseURL + (url[0] == "/" ? url : "/" + url);
        url += this.defaultQuery ? this.defaultQuery : "";
      }

      let controller = new AbortController();
      let signal = controller.signal;
      this.onRequest(url, options);

      let done = false;
      setTimeout(() => {
        if (!done) {
          controller.abort();
        }
      }, this.timeout);
      let res = await this.__start_request(url, signal, options);
      done = true;
      let data;
      try {
        data = await res.json();
      } catch (e) { }
      if (res.ok) {
        this.onComplete(data);
        return data;
      }
      let err = new RequestError(`${res.status} ${res.statusText}`, res, data);
      throw err;
    } catch (e) {
      if (!e.status) {
        e = new RequestTimeout("[REQUEST_FAILED] Timeout", url);
      }
      this.onError(e);
      throw e;
    }
  }

  async __start_request(url, signal, options) {
    return fetch(url, {
      ...this.defaultOptions,
      signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders
      },
      ...options
    });
  }

  async get(url) {
    try {
      return await this.request(url);
    } catch (e) {
      throw e;
    }
  }
  async post(url, data = {}) {
    try {
      return await this.request(url, {
        method: "POST",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  async put(url, data = {}) {
    try {
      return await this.request(url, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  async delete(url) {
    try {
      return await this.request(url, {
        method: "DELETE"
      });
    } catch (e) {
      throw e;
    }
  }

  // STATIC METHODS

  static async request(url, options = {}) {
    try {
      if (!url.includes("//")) {
        url = url[0] == "/" ? url : "/" + url;
      }

      let controller = new AbortController();
      let signal = controller.signal;
      let res = fetch(url, {
        signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        ...options
      });

      signal.onabort = event => {
        throw new RequestTimeout("[REQUEST_FAILED] Timeout", url);
      };
      setTimeout(() => {
        controller.abort();
      }, 10000);
      let response = await res;
      let json = await response.json();
      if (response.ok) {
        return json;
      }
      throw new RequestError(json.message, res);
    } catch (e) {
      throw e;
    }
  }

  static async get(url) {
    try {
      return await this.request(url);
    } catch (e) {
      throw e;
    }
  }
  static async post(url, data = {}) {
    try {
      return await this.request(url, {
        method: "POST",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  static async put(url, data = {}) {
    try {
      return await this.request(url, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  static async delete(url) {
    try {
      return await this.request(url, {
        method: "DELETE"
      });
    } catch (e) {
      throw e;
    }
  }
}

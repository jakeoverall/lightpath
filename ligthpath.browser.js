"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RequestError = /*#__PURE__*/function (_Error) {
  _inherits(RequestError, _Error);

  function RequestError(msg, response) {
    var _this;

    var body = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, RequestError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RequestError).call(this, msg));
    _this.response = response;
    _this.status = response.status;
    _this.body = body;
    return _this;
  }

  return RequestError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var RequestTimeout = /*#__PURE__*/function (_Error2) {
  _inherits(RequestTimeout, _Error2);

  function RequestTimeout(msg, url) {
    var _this2;

    _classCallCheck(this, RequestTimeout);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(RequestTimeout).call(this, msg));
    _this2.url = url;
    return _this2;
  }

  return RequestTimeout;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var LightPath = /*#__PURE__*/function () {
  function LightPath(_ref) {
    var _ref$baseURL = _ref.baseURL,
        baseURL = _ref$baseURL === void 0 ? "" : _ref$baseURL,
        _ref$headers = _ref.headers,
        headers = _ref$headers === void 0 ? {} : _ref$headers,
        _ref$query = _ref.query,
        query = _ref$query === void 0 ? "" : _ref$query,
        _ref$timeout = _ref.timeout,
        timeout = _ref$timeout === void 0 ? 8000 : _ref$timeout,
        _ref$onRequest = _ref.onRequest,
        onRequest = _ref$onRequest === void 0 ? function (url, options) {} : _ref$onRequest,
        _ref$onComplete = _ref.onComplete,
        onComplete = _ref$onComplete === void 0 ? function (data) {} : _ref$onComplete,
        _ref$onError = _ref.onError,
        onError = _ref$onError === void 0 ? function (err) {} : _ref$onError;

    _classCallCheck(this, LightPath);

    this.baseURL = baseURL;
    this.defaultHeaders = headers;
    this.defaultQuery = query;
    this.timeout = timeout;
    this.onRequest = onRequest;
    this.onComplete = onComplete;
    this.onError = onError;

    if (this.defaultQuery && this.defaultQuery[0] != "?") {
      this.defaultQuery = "?" + this.defaultQuery;
    }
  }

  _createClass(LightPath, [{
    key: "request",
    value: async function request(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        if (!url.includes("//")) {
          url = this.baseURL + (url[0] == "/" ? url : "/" + url);
          url += this.defaultQuery ? this.defaultQuery : "";
        }

        var controller = new AbortController();
        var signal = controller.signal;
        this.onRequest(url, options);
        var done = false;
        setTimeout(function () {
          if (!done) {
            controller.abort();
          }
        }, this.timeout);
        var res = await this.__start_request(url, signal, options);
        done = true;
        var data;

        try {
          data = await res.json();
        } catch (e) {}

        if (res.ok) {
          this.onComplete(data);
          return data;
        }

        var err = new RequestError("".concat(res.status, " ").concat(res.statusText), res, data);
        throw err;
      } catch (e) {
        if (!e.status) {
          e = new RequestTimeout("[REQUEST_FAILED] Timeout", url);
        }

        this.onError(e);
        throw e;
      }
    }
  }, {
    key: "__start_request",
    value: async function __start_request(url, signal, options) {
      return fetch(url, {
        signal: signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...this.defaultHeaders
        },
        ...options
      });
    }
  }, {
    key: "get",
    value: async function get(url) {
      try {
        return await this.request(url);
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "post",
    value: async function post(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        return await this.request(url, {
          method: "POST",
          body: JSON.stringify(data)
        });
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "put",
    value: async function put(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        return await this.request(url, {
          method: "PUT",
          body: JSON.stringify(data)
        });
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "delete",
    value: async function _delete(url) {
      try {
        return await this.request(url, {
          method: "DELETE"
        });
      } catch (e) {
        throw e;
      }
    } // STATIC METHODS

  }], [{
    key: "request",
    value: async function request(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        if (!url.includes("//")) {
          url = url[0] == "/" ? url : "/" + url;
        }

        var controller = new AbortController();
        var signal = controller.signal;
        var res = fetch(url, {
          signal: signal,
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          ...options
        });

        signal.onabort = function (event) {
          throw new RequestTimeout("[REQUEST_FAILED] Timeout", url);
        };

        setTimeout(function () {
          controller.abort();
        }, 10000);
        var response = await res;
        var json = await response.json();

        if (response.ok) {
          return json;
        }

        throw new RequestError(json.message, res);
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "get",
    value: async function get(url) {
      try {
        return await this.request(url);
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "post",
    value: async function post(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        return await this.request(url, {
          method: "POST",
          body: JSON.stringify(data)
        });
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "put",
    value: async function put(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      try {
        return await this.request(url, {
          method: "PUT",
          body: JSON.stringify(data)
        });
      } catch (e) {
        throw e;
      }
    }
  }, {
    key: "delete",
    value: async function _delete(url) {
      try {
        return await this.request(url, {
          method: "DELETE"
        });
      } catch (e) {
        throw e;
      }
    }
  }]);

  return LightPath;
}();
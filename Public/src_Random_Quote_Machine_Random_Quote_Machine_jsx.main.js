"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfreecodecamp"] = self["webpackChunkfreecodecamp"] || []).push([["src_Random_Quote_Machine_Random_Quote_Machine_jsx"],{

/***/ "./src/Random Quote Machine/Random Quote Machine.jsx":
/*!***********************************************************!*\
  !*** ./src/Random Quote Machine/Random Quote Machine.jsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/esm/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/esm/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ \"./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js\");\n/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ \"./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js\");\n/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ \"./node_modules/@babel/runtime/helpers/esm/inherits.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-redux */ \"./node_modules/react-redux/dist/react-redux.mjs\");\n/* harmony import */ var _exerciseStore__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../exerciseStore */ \"./src/exerciseStore.jsx\");\n/* harmony import */ var _Reset__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Reset */ \"./src/Reset.jsx\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var redux__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! redux */ \"./node_modules/redux/dist/redux.mjs\");\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module '../../Public/Random Quote Machine/Random Quote Machine.css'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n\n\n\n\nfunction _callSuper(t, o, e) { return o = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(o), (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(t).constructor) : o.apply(t, e)); }\nfunction _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }\nfunction ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }\nfunction _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__[\"default\"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }\n\n\n\n\n\n\n\n\n// for hot loading css\n\n\n// TODO: create store for quotes\n\n// initial store state\n// TODO: maybe get them from somewhere?\nvar storeInitial = {\n  quotes: [[\"me\", \"Not Here\"], [\"that person\", \"But There\"], [\"gnome\", \"Have at it\"], [\"tree\", \"It's not all here\"], [\"Cat\", \"But neither there\"]],\n  currentQuote: \"\"\n};\n\n//quote randomizer\nvar randomQuote = function randomQuote() {\n  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [\"no array provided\"];\n  var randomNumber = Math.floor(Math.random() * array.length);\n  return array[randomNumber];\n};\n\n// reducer for quotes \nvar quoteReducer = function quoteReducer() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : storeInitial;\n  var action = arguments.length > 1 ? arguments[1] : undefined;\n  switch (action.type) {\n    case 'quote/get':\n      var newQuote = randomQuote(state.quotes);\n      return _objectSpread(_objectSpread({}, state), {}, {\n        currentQuote: newQuote\n      });\n    default:\n      return state;\n  }\n  ;\n};\nvar store = (0,redux__WEBPACK_IMPORTED_MODULE_12__.createStore)(quoteReducer);\n\n// box element\nvar QuoteBox = /*#__PURE__*/function (_React$Component) {\n  function QuoteBox(props) {\n    var _this;\n    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(this, QuoteBox);\n    _this = _callSuper(this, QuoteBox, [props]);\n    store.dispatch({\n      type: \"quote/get\"\n    });\n    _this.state = store.getState();\n\n    //remember to bind this if you make any methods inside object\n    _this.updateQuote = _this.updateQuote.bind(_this);\n    return _this;\n  }\n  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__[\"default\"])(QuoteBox, _React$Component);\n  return (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(QuoteBox, [{\n    key: \"updateQuote\",\n    value: function updateQuote() {\n      store.dispatch({\n        type: \"quote/get\"\n      });\n      this.setState(_objectSpread({}, store.getState()));\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"div\", {\n        id: \"quote-box\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"h2\", {\n        id: \"text\"\n      }, this.state.currentQuote[1]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"div\", {\n        id: \"author\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"span\", null, this.state.currentQuote[0])), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"button\", {\n        type: \"button\",\n        id: \"new-quote\",\n        onClick: this.updateQuote\n      }, \"Hello\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"div\", {\n        id: \"tweet_wrap\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(\"a\", {\n        href: \"\",\n        id: \"tweet-quote\"\n      })));\n    }\n  }]);\n}((react__WEBPACK_IMPORTED_MODULE_7___default().Component));\n;\nreact_dom__WEBPACK_IMPORTED_MODULE_6__.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(react_redux__WEBPACK_IMPORTED_MODULE_13__.Provider, {\n  store: _exerciseStore__WEBPACK_IMPORTED_MODULE_8__[\"default\"]\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(_Reset__WEBPACK_IMPORTED_MODULE_9__[\"default\"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(react_redux__WEBPACK_IMPORTED_MODULE_13__.Provider, {\n  store: store\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default().createElement(QuoteBox, null))),\n// jquery returns a jquery object. \n// First thing in it is the native DOM element\njquery__WEBPACK_IMPORTED_MODULE_10___default()(\"#root\")[0]);\n\n//# sourceURL=webpack://freecodecamp/./src/Random_Quote_Machine/Random_Quote_Machine.jsx?");

/***/ }),

/***/ "./src/Reset.jsx":
/*!***********************!*\
  !*** ./src/Reset.jsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _exerciseStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exerciseStore */ \"./src/exerciseStore.jsx\");\n\n\nvar Reset = function Reset() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    id: \"exercises_reset\",\n    onClick: function onClick() {\n      _exerciseStore__WEBPACK_IMPORTED_MODULE_1__[\"default\"].dispatch({\n        type: \"exercises/reset\",\n        payload: null\n      });\n    },\n    href: \"../index.html\",\n    style: {\n      position: \"absolute\",\n      top: \"20px\",\n      right: \"25px\"\n    }\n  }, \"reset\");\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Reset);\n\n//# sourceURL=webpack://freecodecamp/./src/Reset.jsx?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _assertThisInitialized)\n/* harmony export */ });\nfunction _assertThisInitialized(self) {\n  if (self === void 0) {\n    throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");\n  }\n  return self;\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _classCallCheck)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _createClass)\n/* harmony export */ });\n/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ \"./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js\");\n\nfunction _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(descriptor.key), descriptor);\n  }\n}\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  Object.defineProperty(Constructor, \"prototype\", {\n    writable: false\n  });\n  return Constructor;\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/createClass.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _getPrototypeOf)\n/* harmony export */ });\nfunction _getPrototypeOf(o) {\n  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {\n    return o.__proto__ || Object.getPrototypeOf(o);\n  };\n  return _getPrototypeOf(o);\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _inherits)\n/* harmony export */ });\n/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ \"./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js\");\n\nfunction _inherits(subClass, superClass) {\n  if (typeof superClass !== \"function\" && superClass !== null) {\n    throw new TypeError(\"Super expression must either be null or a function\");\n  }\n  subClass.prototype = Object.create(superClass && superClass.prototype, {\n    constructor: {\n      value: subClass,\n      writable: true,\n      configurable: true\n    }\n  });\n  Object.defineProperty(subClass, \"prototype\", {\n    writable: false\n  });\n  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(subClass, superClass);\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/inherits.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _possibleConstructorReturn)\n/* harmony export */ });\n/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ \"./node_modules/@babel/runtime/helpers/esm/typeof.js\");\n/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ \"./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js\");\n\n\nfunction _possibleConstructorReturn(self, call) {\n  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(call) === \"object\" || typeof call === \"function\")) {\n    return call;\n  } else if (call !== void 0) {\n    throw new TypeError(\"Derived constructors may only return object or undefined\");\n  }\n  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(self);\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _setPrototypeOf)\n/* harmony export */ });\nfunction _setPrototypeOf(o, p) {\n  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {\n    o.__proto__ = p;\n    return o;\n  };\n  return _setPrototypeOf(o, p);\n}\n\n//# sourceURL=webpack://freecodecamp/./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js?");

/***/ })

}]);
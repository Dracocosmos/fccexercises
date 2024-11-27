"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfreecodecamp"] = self["webpackChunkfreecodecamp"] || []).push([["src_Reset_jsx"],{

/***/ "./src/Reset.jsx":
/*!***********************!*\
  !*** ./src/Reset.jsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _exerciseStore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exerciseStore */ \"./src/exerciseStore.jsx\");\n\n\nvar Reset = function Reset() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    id: \"exercises_reset\",\n    onClick: function onClick() {\n      _exerciseStore__WEBPACK_IMPORTED_MODULE_1__[\"default\"].dispatch({\n        type: \"exercises/reset\",\n        payload: null\n      });\n    },\n    href: \"../index.html\",\n    style: {\n      position: \"absolute\",\n      top: \"20px\",\n      right: \"25px\"\n    }\n  }, \"reset\");\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Reset);\n\n//# sourceURL=webpack://freecodecamp/./src/Reset.jsx?");

/***/ })

}]);
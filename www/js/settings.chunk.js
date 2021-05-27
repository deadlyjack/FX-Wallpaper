/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwallpaper"] = self["webpackChunkwallpaper"] || []).push([["settings"],{

/***/ "./src/pages/settings/settings.scss":
/*!******************************************!*\
  !*** ./src/pages/settings/settings.scss ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://wallpaper/./src/pages/settings/settings.scss?");

/***/ }),

/***/ "./src/pages/settings/settings.hbs":
/*!*****************************************!*\
  !*** ./src/pages/settings/settings.hbs ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<div class='options'>\\n  {{#options}}\\n    <div class='option' action='{{action}}'>\\n      <span class='icon {{icon}}'></span>\\n      <div class='title'>\\n        <div class='text'>{{text}}</div>\\n        <small class='sub-text'>{{subText}}</small>\\n      </div>\\n    </div>\\n  {{/options}}\\n</div>\\n\\n<div class='notice'>\\n  <h3>Term of usage</h3>\\n  <p>\\n    All wallpapers/images on this app are only for personal use (i.e using it as\\n    wallpaper) and should not be used anywhere else other than setting it as\\n    wallpaper.\\n  </p>\\n\\n  <h3>Report image(s)</h3>\\n  <p>\\n    If you find any image that is copyrighted or anyone has any objection about\\n    any image please us for immediate removal of that specific removal of that\\n    image.\\n  </p>\\n</div>\\n\\n<footer>\\n  <div class='line'>{{label}} v{{version}}</div>\\n  <div class='line'>&copy; Foxdebug 2021</div>\\n  <div class='line'>\\n    <span\\n      class='link'\\n      action='open'\\n      value='https://foxdebug.com'\\n    >foxdebug.com</span>\\n    |\\n    <span\\n      class='link'\\n      action='email'\\n      value='contact@foxdebug.com'\\n    >contact@foxdebug.com</span>\\n  </div>\\n</footer>\");\n\n//# sourceURL=webpack://wallpaper/./src/pages/settings/settings.hbs?");

/***/ }),

/***/ "./src/pages/settings/settings.include.js":
/*!************************************************!*\
  !*** ./src/pages/settings/settings.include.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ SettingsInclude; }\n/* harmony export */ });\n/* harmony import */ var _settings_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings.scss */ \"./src/pages/settings/settings.scss\");\n/* harmony import */ var mustache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mustache */ \"./node_modules/mustache/mustache.mjs\");\n/* harmony import */ var _settings_hbs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./settings.hbs */ \"./src/pages/settings/settings.hbs\");\n/* harmony import */ var _components_page_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/page/page */ \"./src/components/page/page.js\");\n\n\n\n\n\nfunction SettingsInclude() {\n  const $page = (0,_components_page_page__WEBPACK_IMPORTED_MODULE_3__.default)('Settings', {\n    id: 'l0fztroz',\n    secondary: true,\n  });\n  let packageName;\n\n  (async () => {\n    const appInfo = await new Promise((resolve, reject) => {\n      window.system.getAppInfo(resolve, reject);\n    });\n\n    packageName = appInfo.packageName;\n\n    $page.content = mustache__WEBPACK_IMPORTED_MODULE_1__.default.render(_settings_hbs__WEBPACK_IMPORTED_MODULE_2__.default, {\n      options: [\n        option('rate', 'Feedback', 'Rate this app on playstore.', 'icon-rate_review'),\n      ],\n      version: appInfo.versionName,\n      label: appInfo.label,\n    });\n  })();\n\n  $page.addEventListener('click', clickHandler);\n  $page.render();\n\n  $page.onhide = () => {\n    $page.removeEventListener('click', clickHandler);\n  };\n\n  /**\n   *\n   * @param {MouseEvent} e\n   */\n  function clickHandler(e) {\n    const $target = e.target;\n    if (!($target instanceof HTMLElement)) return;\n    const action = $target.getAttribute('action');\n    const value = $target.getAttribute('value');\n\n    switch (action) {\n      case 'rate':\n        window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_SYSTEM');\n        break;\n\n      case 'open':\n        window.open(value, '_SYSTEM');\n        break;\n\n      case 'email':\n        window.system.sendEmail(value, '', '', () => {}, () => {});\n        break;\n\n      default:\n        break;\n    }\n  }\n\n  function option(action, text, subText, icon) {\n    return {\n      action, text, subText, icon,\n    };\n  }\n}\n\n\n//# sourceURL=webpack://wallpaper/./src/pages/settings/settings.include.js?");

/***/ })

}]);
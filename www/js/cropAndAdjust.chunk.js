/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkwallpaper"] = self["webpackChunkwallpaper"] || []).push([["cropAndAdjust"],{

/***/ "./src/pages/cropAndAdjust/cropAndAdjust.scss":
/*!****************************************************!*\
  !*** ./src/pages/cropAndAdjust/cropAndAdjust.scss ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://wallpaper/./src/pages/cropAndAdjust/cropAndAdjust.scss?");

/***/ }),

/***/ "./src/components/dialogs/alert/alert.hbs":
/*!************************************************!*\
  !*** ./src/components/dialogs/alert/alert.hbs ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<span class=\\\"message\\\">{{{message}}}</span>\\n<div class=\\\"button-container\\\">\\n  <button action=\\\"ok\\\">OK</button>\\n</div>\");\n\n//# sourceURL=webpack://wallpaper/./src/components/dialogs/alert/alert.hbs?");

/***/ }),

/***/ "./src/pages/cropAndAdjust/cropAndAdjust.hbs":
/*!***************************************************!*\
  !*** ./src/pages/cropAndAdjust/cropAndAdjust.hbs ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<div\\n  class='device'\\n  style='height: {{height}}; width: {{width}}; background-color: {{bgColor}}'\\n>\\n  <pinch-zoom>\\n    <img src='{{src}}' class='wallpaper' style='height: {{height}};' />\\n  </pinch-zoom>\\n  <div class='app-icons'>\\n    <span class='app-icon'></span>\\n    <span class='app-icon'></span>\\n    <span class='app-icon'></span>\\n    <span class='app-icon'></span>\\n  </div>\\n</div>\\n\\n<button>Set wallpaper</button>\");\n\n//# sourceURL=webpack://wallpaper/./src/pages/cropAndAdjust/cropAndAdjust.hbs?");

/***/ }),

/***/ "./src/pages/cropAndAdjust/options.hbs":
/*!*********************************************!*\
  !*** ./src/pages/cropAndAdjust/options.hbs ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"<div\\n  class='options'\\n  style='display: flex; flex-direction: column; align-items: center; justify-content: center;'\\n>\\n  <style>\\n    .options .option{ display: flex; height: 40px; width: 100%; align-items:\\n    center; }\\n  </style>\\n  <div class='option' which='HOME'>Home screen</div>\\n  <div class='option' which='LOCK'>Lock screen</div>\\n  <div class='option' which='BOTH'>Both</div>\\n</div>\");\n\n//# sourceURL=webpack://wallpaper/./src/pages/cropAndAdjust/options.hbs?");

/***/ }),

/***/ "./src/components/dialogs/alert/alert.js":
/*!***********************************************!*\
  !*** ./src/components/dialogs/alert/alert.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ alert; }\n/* harmony export */ });\n/* harmony import */ var mustache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mustache */ \"./node_modules/mustache/mustache.mjs\");\n/* harmony import */ var _alert_hbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alert.hbs */ \"./src/components/dialogs/alert/alert.hbs\");\n/* harmony import */ var _box_box__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../box/box */ \"./src/components/dialogs/box/box.js\");\n\n\n\n\n/**\n * Shows alert box with title and message.\n * @param {String} title\n * @param {String} message\n */\nfunction alert(title, message) {\n  const box = (0,_box_box__WEBPACK_IMPORTED_MODULE_2__.default)(title, mustache__WEBPACK_IMPORTED_MODULE_0__.default.render(_alert_hbs__WEBPACK_IMPORTED_MODULE_1__.default, {\n    message,\n  }));\n\n  box.$mask.onclick = box.hide;\n  box.$body.onclick = clickHandler;\n  box.render();\n\n  /**\n   *\n   * @param {MouseEvent} e\n   */\n  function clickHandler(e) {\n    const $target = e.target;\n    if (!($target instanceof HTMLElement)) return;\n    const action = $target.getAttribute('action');\n    if (!action) return;\n\n    if (action === 'ok') box.hide();\n  }\n}\n\n\n//# sourceURL=webpack://wallpaper/./src/components/dialogs/alert/alert.js?");

/***/ }),

/***/ "./src/lib/downloaded.js":
/*!*******************************!*\
  !*** ./src/lib/downloaded.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./save */ \"./src/lib/save.js\");\n\n\nconst DOWNLOADED = 'downloaded';\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  /**\n   * Add an image to favorite list.\n   * @param {Image} image\n   */\n  add(image) {\n    return _save__WEBPACK_IMPORTED_MODULE_0__.default.add(image, DOWNLOADED);\n  },\n  /**\n   * Remove an image from favorite list.\n   * @param {Image} image\n   */\n  remove(image) {\n    return _save__WEBPACK_IMPORTED_MODULE_0__.default.remove(image, DOWNLOADED);\n  },\n  /**\n   * Clears favorite list permanently\n   */\n  clear() {\n    return _save__WEBPACK_IMPORTED_MODULE_0__.default.clear(DOWNLOADED);\n  },\n  /**\n   * Finds an image in favorite list.\n   * @param {Image} image\n   * @returns {Image}\n   */\n  has(image) {\n    return _save__WEBPACK_IMPORTED_MODULE_0__.default.has(image, DOWNLOADED);\n  },\n  /**\n   * Retrive all images from favorite list.\n   * @returns {Array<Image>}\n   */\n  retrive() {\n    return _save__WEBPACK_IMPORTED_MODULE_0__.default.retrive(DOWNLOADED);\n  },\n});\n\n\n//# sourceURL=webpack://wallpaper/./src/lib/downloaded.js?");

/***/ }),

/***/ "./src/pages/cropAndAdjust/cropAndAdjust.include.js":
/*!**********************************************************!*\
  !*** ./src/pages/cropAndAdjust/cropAndAdjust.include.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ CropAndAdjustInclude; }\n/* harmony export */ });\n/* harmony import */ var _cropAndAdjust_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cropAndAdjust.scss */ \"./src/pages/cropAndAdjust/cropAndAdjust.scss\");\n/* harmony import */ var pinch_zoom_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pinch-zoom-element */ \"./node_modules/pinch-zoom-element/dist/pinch-zoom.es.js\");\n/* harmony import */ var mustache__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mustache */ \"./node_modules/mustache/mustache.mjs\");\n/* harmony import */ var _options_hbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./options.hbs */ \"./src/pages/cropAndAdjust/options.hbs\");\n/* harmony import */ var _cropAndAdjust_hbs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cropAndAdjust.hbs */ \"./src/pages/cropAndAdjust/cropAndAdjust.hbs\");\n/* harmony import */ var _components_page_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/page/page */ \"./src/components/page/page.js\");\n/* harmony import */ var _components_dialogs_alert_alert__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/dialogs/alert/alert */ \"./src/components/dialogs/alert/alert.js\");\n/* harmony import */ var _components_dialogs_box_box__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../components/dialogs/box/box */ \"./src/components/dialogs/box/box.js\");\n/* harmony import */ var _components_loader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../components/loader */ \"./src/components/loader.js\");\n/* harmony import */ var _lib_downloaded__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../lib/downloaded */ \"./src/lib/downloaded.js\");\n/* harmony import */ var _downloadImage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./downloadImage */ \"./src/pages/cropAndAdjust/downloadImage.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/helpers */ \"./src/utils/helpers.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**\n *\n * Opens new page to crop and image before setting the Image as wallpaper\n *\n * @param {Image} image\n * Image that is to set as wallpaper.\n */\nasync function CropAndAdjustInclude(image) {\n  const $page = (0,_components_page_page__WEBPACK_IMPORTED_MODULE_5__.default)('CropAndAdjust', {\n    id: 'l4wl0xol',\n    secondary: true,\n  });\n  const downloadImage = (0,_downloadImage__WEBPACK_IMPORTED_MODULE_10__.default)(image);\n  const screenHeight = window.screen.height;\n  const screenWidth = window.screen.width;\n  const height = window.innerHeight * 0.7;\n  const width = height * (screenWidth / screenHeight);\n  const loader = (0,_components_loader__WEBPACK_IMPORTED_MODULE_8__.default)('#39f');\n  const MIN_SCALE = 1;\n  const MAX_SCALE = 4;\n  let oldX = 0;\n  let oldY = 0;\n\n  $page.content = mustache__WEBPACK_IMPORTED_MODULE_2__.default.render(_cropAndAdjust_hbs__WEBPACK_IMPORTED_MODULE_4__.default, {\n    height: `${height}px`,\n    width: `${width}px`,\n    bgColor: image.avgColor,\n  });\n  $page.render();\n\n  const $pinchZoom = $page.get('pinch-zoom');\n  const $img = $pinchZoom.get('img');\n  const $device = $page.get('.device');\n  const $button = $page.get('button');\n\n  $button.addEventListener('click', handleOnclick);\n  $pinchZoom.addEventListener('change', handlePinchZoom);\n  $page.onhide = () => {\n    $button.removeEventListener('click', handleOnclick);\n    $pinchZoom.removeEventListener('change', handlePinchZoom);\n    downloadImage.abort();\n    loader.destroy();\n  };\n\n  await _utils_helpers__WEBPACK_IMPORTED_MODULE_11__.default.wait(300);\n\n  if (image.src.thumbnail) {\n    $img.src = image.src.thumbnail;\n  }\n  const downloadedImage = _lib_downloaded__WEBPACK_IMPORTED_MODULE_9__.default.has(image);\n  if (downloadedImage) {\n    await _utils_helpers__WEBPACK_IMPORTED_MODULE_11__.default.wait(300);\n    $img.src = downloadedImage.localUri;\n  } else {\n    loader.show();\n    downloadImage.onprogress = (progress) => {\n      if (progress === 100) {\n        loader.hide();\n        return;\n      }\n      if (progress === 99.9) {\n        loader.animate();\n        return;\n      }\n\n      loader.progress(progress);\n    };\n    $img.src = await downloadImage.getLocalUri();\n  }\n\n  async function handleOnclick() {\n    const API = await new Promise((resolve, reject) => {\n      window.wallpaper.getAPILevel(resolve, reject);\n    });\n\n    try {\n      if (API >= 24) {\n        const which = await askWhich();\n        await setWallpaper(which);\n      } else {\n        await setWallpaper('HOME');\n      }\n    } catch (error) {\n      console.log(error);\n    }\n  }\n\n  function askWhich() {\n    return new Promise((resolve) => {\n      const box = (0,_components_dialogs_box_box__WEBPACK_IMPORTED_MODULE_7__.default)('Set wallpaper as', _options_hbs__WEBPACK_IMPORTED_MODULE_3__.default, 'center', true);\n      box.render();\n      box.$mask.onclick = box.hide;\n      box.$body.onclick = (e) => {\n        box.hide();\n        const $target = e.target;\n        if (!($target instanceof HTMLElement)) return;\n        const which = $target.getAttribute('which');\n        if (!which) return;\n\n        resolve(which);\n      };\n    });\n  }\n\n  async function setWallpaper(which) {\n    loader\n      .show()\n      .percentageTextVisible(false)\n      .animate()\n      .messageText = 'Setting wallpaper...';\n\n    try {\n      const contentUri = await new Promise((resolve, reject) => {\n        window.system.convertUriToContentSchema($img.src, (res) => {\n          console.log(res);\n          resolve(res);\n        }, (err) => {\n          console.error(err);\n          reject(err);\n        });\n      });\n\n      const { scale } = $pinchZoom;\n      const scaledImageWidth = ($img.clientWidth * scale);\n      const scaledImageHeight = ($img.clientHeight * scale);\n      const rect = {\n        x: Math.abs($pinchZoom.x / scaledImageWidth),\n        y: Math.abs($pinchZoom.y / scaledImageHeight),\n        h: $device.clientHeight / scaledImageHeight,\n        w: $device.clientWidth / scaledImageWidth,\n        s: scale,\n      };\n      window.wallpaper.setWallpaper(which, contentUri, rect, onSetWallpaper, (err) => {\n        loader\n          .hide()\n          .messageText = '';\n        (0,_components_dialogs_alert_alert__WEBPACK_IMPORTED_MODULE_6__.default)('ERROR', err);\n      });\n    } catch (error) {\n      loader.hide();\n      console.error(error);\n    }\n  }\n\n  function onSetWallpaper(res) {\n    if (res) {\n      loader.hide();\n      (0,_components_dialogs_alert_alert__WEBPACK_IMPORTED_MODULE_6__.default)('INFO', 'Wallpaper changed successfuly!');\n      document.dispatchEvent(new CustomEvent('wallpaperchange'));\n    }\n  }\n\n  function handlePinchZoom() {\n    const { scale } = $pinchZoom;\n\n    const y = (scaleY) => {\n      const newY = $pinchZoom.y;\n      const newHeight = -((($img.clientHeight * scaleY) + 4) - $pinchZoom.clientHeight);\n\n      if (newY > 0) return 0;\n      if (newY < newHeight) return newHeight;\n      return newY;\n    };\n\n    const x = (scaleX) => {\n      const newX = $pinchZoom.x;\n      const newWidth = -(($img.clientWidth * scaleX) - $pinchZoom.clientWidth);\n\n      // console.log({ newX, newWidth });\n      if (newX > 0) return 0;\n      if (newX < newWidth) return newWidth;\n      return newX;\n    };\n\n    if (scale > MIN_SCALE && scale <= MAX_SCALE) {\n      $pinchZoom.setTransform({\n        y: y(scale),\n        x: x(scale),\n        allowChangeEvent: false,\n      });\n    } else if (scale > MAX_SCALE) {\n      $pinchZoom.setTransform({\n        scale: MAX_SCALE,\n        x: oldX,\n        y: oldY,\n        allowChangeEvent: false,\n      });\n    } else {\n      $pinchZoom.setTransform({\n        scale: MIN_SCALE,\n        x: x(MIN_SCALE),\n        y: y(MIN_SCALE),\n        allowChangeEvent: false,\n      });\n    }\n\n    oldX = $pinchZoom.x;\n    oldY = $pinchZoom.y;\n  }\n}\n\n\n//# sourceURL=webpack://wallpaper/./src/pages/cropAndAdjust/cropAndAdjust.include.js?");

/***/ }),

/***/ "./src/pages/cropAndAdjust/downloadImage.js":
/*!**************************************************!*\
  !*** ./src/pages/cropAndAdjust/downloadImage.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ DownloadImage; }\n/* harmony export */ });\n/* harmony import */ var _deadlyjack_ajax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @deadlyjack/ajax */ \"./node_modules/@deadlyjack/ajax/dist/ajax.js\");\n/* harmony import */ var _deadlyjack_ajax__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_deadlyjack_ajax__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_downloaded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/downloaded */ \"./src/lib/downloaded.js\");\n/* harmony import */ var _utils_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/helpers */ \"./src/utils/helpers.js\");\n\n\n\n\n/**\n *\n * @param {Image} image\n */\nfunction DownloadImage(image) {\n  let onProgress;\n  let xhr;\n  let aborted;\n\n  return {\n    get onprogress() {\n      return onProgress;\n    },\n    set onprogress(fun) {\n      onProgress = fun;\n    },\n    async getLocalUri() {\n      const downloadedImage = _lib_downloaded__WEBPACK_IMPORTED_MODULE_1__.default.has(image);\n      if (!downloadedImage) {\n        const filename = `${image.id}.jpeg`;\n        const imageDir = cordova.file.dataDirectory;\n        const imageLocalUri = imageDir + filename;\n        const imageData = await _deadlyjack_ajax__WEBPACK_IMPORTED_MODULE_0___default()({\n          url: image.src.original,\n          responseType: 'arraybuffer',\n          xhr: (xhrObj) => {\n            xhr = xhrObj;\n            xhrObj.onprogress = (e) => {\n              const percent = (e.loaded / e.total) * 100;\n              _utils_helpers__WEBPACK_IMPORTED_MODULE_2__.default.call(onProgress, Math.min(percent, 99.9));\n            };\n\n            xhrObj.onabort = () => {\n              aborted = true;\n              _utils_helpers__WEBPACK_IMPORTED_MODULE_2__.default.call(onProgress, 100);\n            };\n          },\n        }); // END: ajax call\n\n        if (aborted || !imageData) {\n          _utils_helpers__WEBPACK_IMPORTED_MODULE_2__.default.call(onProgress, 100);\n          return null;\n        }\n\n        await new Promise((resolve, reject) => {\n          window.resolveLocalFileSystemURL(imageDir, (dirEntry) => {\n            dirEntry.getFile(filename, { create: true, exclusive: false }, (fileEntry) => {\n              fileEntry.createWriter((file) => {\n                file.onwriteend = resolve;\n                file.onerror = reject;\n                file.write(imageData);\n              });\n            }, reject);\n          }, reject);\n        }); // END: Promise\n\n        _utils_helpers__WEBPACK_IMPORTED_MODULE_2__.default.call(onProgress, 100);\n        image.localUri = imageLocalUri;\n        if (/^https?:\\/\\//.test(image.src.original)) _lib_downloaded__WEBPACK_IMPORTED_MODULE_1__.default.add(image);\n        return imageLocalUri;\n      }\n\n      return downloadedImage.localUri;\n    },\n    abort() {\n      if (xhr && 'abort' in xhr) xhr.abort();\n    },\n  };\n}\n\n\n//# sourceURL=webpack://wallpaper/./src/pages/cropAndAdjust/downloadImage.js?");

/***/ })

}]);
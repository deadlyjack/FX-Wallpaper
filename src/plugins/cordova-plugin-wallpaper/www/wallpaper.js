module.exports = {
  getWallpaper: function (which, onSuccess, onFail) {
    cordova.exec(onSuccess, onFail, "Wallpaper", "get-wallpaper", [which]);
  },
  getDimension: function (onSuccess, onFail) {
    cordova.exec(onSuccess, onFail, "Wallpaper", "get-dimension", []);
  },
  isSetWallpaperAllowed: function (onSuccess, onFail) {
    cordova.exec(onSuccess, onFail, "Wallpaper", "is-set-wallpaper-allowed", []);
  },
  isWallpaperSupported: function (onSuccess, onFail) {
    cordova.exec(onSuccess, onFail, "Wallpaper", "is-wallpaper-supported", []);
  },
  startCropAndSetWallpaperIntent: function (fielUri, onSuccess, onFail) {
    cordova.exec(onSuccess, onFail, "Wallpaper", "start-crop-and-share-wallpaper-intent", [fielUri]);
  },
  setWallpaper: function(which, fileUri, rect, onSuccess, onFail){
    cordova.exec(onSuccess, onFail, "Wallpaper", "set-wallpaper", [which, fileUri, rect.x, rect.y, rect.w, rect.h]);
  },
  compress: function(fileUri, quality, onSuccess, onFail){
    quality = parseInt(quality);
    quality = quality ? quality : 100;
    cordova.exec(onSuccess, onFail, "Wallpaper", "compress", [fileUri, quality]);
  },
  getAPILevel: function(onSuccess, onFail){
    cordova.exec(onSuccess, onFail, "Wallpaper", "get-api-level", []);
  }
};
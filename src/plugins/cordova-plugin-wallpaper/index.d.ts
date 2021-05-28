interface Wallpaper {
  getWallpaper(which: "HOME"|"LOCK", onSuccess: (uri: String) => void, onFail: (err: String) => void): void;
  getDimension(onSuccess: (dim: {height:Number, width: Number}) => void, onFail: (err: String) => void): void;
  isSetWallpaperAllowed(onSuccess: (res: Boolean) => void, onFail: (err: String) => void): void;
  isWallpaperSupported(onSuccess: (res: Boolean) => void, onFail: (err: String) => void): void;
  startCropAndSetWallpaperIntent(fileUri: String, onSuccess: () => void, onFail: () => String): void;
  setWallpaper(which: "HOME"|"LOCK"|"BOTH", fileUri: String, rect: {x: Number, y: Number, w: Number, h: Number}, onSuccess: (res: Number) => void, onFail: (err: String) => void): void;
  compress(fileUri: String, quality: Number, onSuccess: (res: Boolean) => void, onFail: (err: String) => void): void;
  getAPILevel(onSuccess: (res: Number) => void, onFail: (err: String) => void): void;
}

declare var wallpaper:Wallpaper;
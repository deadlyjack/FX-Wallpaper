package com.foxdebug;

import android.app.Activity;
import android.app.WallpaperManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageDecoder;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Wallpaper extends CordovaPlugin {

  private Activity activity;
  private Context context;
  private WallpaperManager wallpaperManager;

  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    this.context = cordova.getContext();
    this.activity = cordova.getActivity();
    this.wallpaperManager = WallpaperManager.getInstance(this.context);
  }

  public boolean execute(
    String action,
    final JSONArray args,
    final CallbackContext callbackContext
  )
    throws JSONException {
    if (action.equals("get-wallpaper")) {
      this.getWallpaper(callbackContext, args.getString(0));
      return true;
    }
    if (action.equals("get-dimension")) {
      this.getDimension(callbackContext);
      return true;
    }
    if (action.equals("is-set-wallpaper-allowed")) {
      this.isSetWallpaperAllowed(callbackContext);
      return true;
    }
    if (action.equals("is-wallpaper-supported")) {
      this.isWallpaperSupported(callbackContext);
      return true;
    }
    if (action.equals("start-crop-and-share-wallpaper-intent")) {
      this.startCropAndSetWallpaperIntent(args.getString(0));
      return true;
    }
    if (action.equals("set-wallpaper")) {
      this.setWallpaper(
          callbackContext,
          args.getString(0),
          args.getString(1),
          args.getDouble(2),
          args.getDouble(3),
          args.getDouble(4),
          args.getDouble(5)
        );
      return true;
    }
    if (action.equals("compress")) {
      this.compress(callbackContext, args.getString(0), args.getInt(1));
      return true;
    }
    if (action.equals("get-api-level")) {
      callbackContext.success(android.os.Build.VERSION.SDK_INT);
      return true;
    }

    return false;
  }

  private void getWallpaper(
    final CallbackContext callbackContext,
    final String which
  ) {
    int wallpaperof;
    if (which.equals("LOCK")) {
      wallpaperof = WallpaperManager.FLAG_LOCK;
    } else if (which.equals("HOME")) {
      wallpaperof = WallpaperManager.FLAG_SYSTEM;
    } else {
      callbackContext.error("Must request exactly one kind of wallpaper");
      return;
    }

    final WallpaperManager wallpaperManager = this.wallpaperManager;
    final Context context = this.context;

    cordova
      .getThreadPool()
      .execute(
        new Runnable() {
          public void run() {
            try {
              int API = android.os.Build.VERSION.SDK_INT;
              Bitmap bitmap = null;

              if (API >= 24) {
                ParcelFileDescriptor wallpaperFile = wallpaperManager.getWallpaperFile(
                  wallpaperof
                );
                if (wallpaperFile == null) {
                  callbackContext.success("");
                  return;
                }
                bitmap =
                  BitmapFactory.decodeFileDescriptor(
                    wallpaperFile.getFileDescriptor()
                  );
              } else {
                Drawable drawable = wallpaperManager.getDrawable();

                if (drawable instanceof BitmapDrawable) {
                  BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;
                  if (bitmapDrawable.getBitmap() != null) {
                    bitmap = bitmapDrawable.getBitmap();
                  }
                } else if (
                  drawable.getIntrinsicWidth() <= 0 ||
                  drawable.getIntrinsicHeight() <= 0
                ) {
                  bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
                } else {
                  bitmap =
                    Bitmap.createBitmap(
                      drawable.getIntrinsicWidth(),
                      drawable.getIntrinsicHeight(),
                      Bitmap.Config.ARGB_8888
                    );
                }
              }

              if (bitmap == null) {
                callbackContext.error("Unable to get wallpaper.");
                return;
              }

              File outputFile = File.createTempFile(
                ".wallpaper",
                ".jpg",
                context.getCacheDir()
              );
              OutputStream fileOut = new FileOutputStream(outputFile);
              Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;
              if (bitmap.compress(format, 100, fileOut)) {
                callbackContext.success(outputFile.getAbsolutePath());
              } else {
                callbackContext.error("Cannot get wallpaper");
              }
            } catch (IOException e) {
              callbackContext.error(e.toString());
            } catch (Exception e) {
              callbackContext.error(e.toString());
            }
          }
        }
      );
  }

  private void getDimension(CallbackContext callbackContext)
    throws JSONException {
    JSONObject res = new JSONObject();

    int height = this.wallpaperManager.getDesiredMinimumHeight();
    int width = this.wallpaperManager.getDesiredMinimumWidth();

    res.put("height", height);
    res.put("width", width);
    callbackContext.success(res);
  }

  private void isWallpaperSupported(CallbackContext callbackContext) {
    boolean result = this.wallpaperManager.isWallpaperSupported();
    callbackContext.success(result ? 1 : 0);
  }

  private void isSetWallpaperAllowed(CallbackContext callbackContext) {
    boolean result = this.wallpaperManager.isSetWallpaperAllowed();
    callbackContext.success(result ? 1 : 0);
  }

  private void startCropAndSetWallpaperIntent(String fileUri) {
    Uri uri = Uri.parse(fileUri);
    Intent intent = this.wallpaperManager.getCropAndSetWallpaperIntent(uri);
    this.activity.startActivity(intent);
  }

  private void setWallpaper(
    final CallbackContext callbackContext,
    final String which,
    final String fileUri,
    final double x,
    final double y,
    final double w,
    final double h
  ) {
    final Context context = this.context;
    final WallpaperManager wallpaperManager = this.wallpaperManager;
    final Activity activity = this.activity;

    cordova
      .getThreadPool()
      .execute(
        new Runnable() {
          public void run() {
            int API = android.os.Build.VERSION.SDK_INT;
            Uri uri = Uri.parse(fileUri);
            Bitmap bitmap;
            int setFor = 0;
            int result = 0;
            if (which.equals("LOCK")) {
              setFor = WallpaperManager.FLAG_LOCK;
            } else if (which.equals("HOME")) {
              setFor = WallpaperManager.FLAG_SYSTEM;
            } else {
              setFor =
                WallpaperManager.FLAG_LOCK | WallpaperManager.FLAG_SYSTEM;
            }

            try {
              if (API >= 28) {
                ImageDecoder.Source imgSrc = ImageDecoder.createSource(
                  context.getContentResolver(),
                  uri
                );
                bitmap = ImageDecoder.decodeBitmap(imgSrc);
              } else {
                bitmap =
                  MediaStore.Images.Media.getBitmap(
                    context.getContentResolver(),
                    uri
                  );
              }

              int imgHeight = bitmap.getHeight();
              int imgWidth = bitmap.getWidth();

              int left = (int) (imgWidth * x);
              int top = (int) (imgHeight * y);
              int height = (int) (imgHeight * h);
              int width = (int) (imgWidth * w);

              bitmap = Bitmap.createBitmap(bitmap, left, top, width, height);

              if (API >= 24) {
                result = wallpaperManager.setBitmap(bitmap, null, true, setFor);
              } else {
                int desiredHeight = wallpaperManager.getDesiredMinimumHeight();
                int desiredWidth = wallpaperManager.getDesiredMinimumWidth();
                double ratio = (double) width / height;
                desiredWidth = (int) (desiredWidth * ratio);

                bitmap =
                  Bitmap.createScaledBitmap(
                    bitmap,
                    desiredWidth,
                    desiredHeight,
                    false
                  );
                bitmap =
                  Bitmap.createBitmap(
                    bitmap,
                    left,
                    top,
                    desiredWidth,
                    desiredHeight
                  );

                wallpaperManager.setBitmap(bitmap);
                wallpaperManager.suggestDesiredDimensions(width, height);
                result = 1;
              }
            } catch (IOException e) {
              callbackContext.error(e.getMessage());
              return;
            } catch (Exception e) {
              callbackContext.error(e.getMessage());
              return;
            }

            callbackContext.success(result);
          }
        }
      );
  }

  private void compress(
    final CallbackContext callbackContext,
    final String src,
    final int quality
  ) {
    final Context context = this.context;
    final WallpaperManager wallpaperManager = this.wallpaperManager;

    cordova
      .getThreadPool()
      .execute(
        new Runnable() {
          public void run() {
            int API = android.os.Build.VERSION.SDK_INT;
            Uri uri = Uri.parse(src);
            Bitmap bitmap;

            try {
              if (API >= 28) {
                ImageDecoder.Source imgSrc = ImageDecoder.createSource(
                  context.getContentResolver(),
                  uri
                );
                bitmap = ImageDecoder.decodeBitmap(imgSrc);
              } else {
                bitmap =
                  MediaStore.Images.Media.getBitmap(
                    context.getContentResolver(),
                    uri
                  );
              }

              File imgFile = new File(uri.getPath());
              FileOutputStream fileOut = new FileOutputStream(imgFile);

              Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;
              boolean result = bitmap.compress(format, quality, fileOut);
              callbackContext.success(result ? 1 : 0);
            } catch (IOException e) {
              callbackContext.error(e.toString());
            } catch (Exception e) {
              callbackContext.error(e.toString());
            }
          }
        }
      );
  }
}

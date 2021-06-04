import './cropAndAdjust.scss';
import 'pinch-zoom-element';
import mustache from 'mustache';
import options from './options.hbs';
import page from './cropAndAdjust.hbs';
import Page from '../../components/page/page';
import alert from '../../components/dialogs/alert/alert';
import Box from '../../components/dialogs/box/box';
import Loader from '../../components/loader';
import downloaded from '../../lib/downloaded';
import DownloadImage from './downloadImage';
import helpers from '../../utils/helpers';
import strings from '../../strings';
import path from '../../utils/path';
import fs from '../../utils/fs';
import url from '../../utils/url';

/**
 *
 * Opens new page to crop and image before setting the Image as wallpaper
 *
 * @param {Image} image
 * Image that is to set as wallpaper.
 */
export default async function CropAndAdjustInclude(image) {
  const $page = Page('CropAndAdjust', {
    id: 'l4wl0xol',
    secondary: true,
  });
  const loadedImage = DownloadImage(image);
  const screenHeight = window.screen.height;
  const screenWidth = window.screen.width;
  const height = window.innerHeight * 0.7;
  const width = height * (screenWidth / screenHeight);
  const loader = Loader('#39f');
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  let oldX = 0;
  let oldY = 0;

  $page.content = mustache.render(page, {
    height: `${height}px`,
    width: `${width}px`,
    bgColor: image.avgColor,
  });
  $page.render();

  const $pinchZoom = $page.get('pinch-zoom');
  const $img = $pinchZoom.get('img');
  const $device = $page.get('.device');
  const $button = $page.get('button');
  const $saveImage = $page.get('[action="save-image"]');

  if (!/(home|lock)( & lock)? screen/i.test(image.title)) {
    $saveImage.remove();
  }

  $page.addEventListener('click', handleOnclick);
  $pinchZoom.addEventListener('change', handlePinchZoom);
  $page.onhide = () => {
    $button.removeEventListener('click', handleOnclick);
    $pinchZoom.removeEventListener('change', handlePinchZoom);
    loadedImage.abort();
    loader.destroy();
  };

  await helpers.wait(300);

  if (image.src.thumbnail) {
    $img.src = image.src.thumbnail;
  }
  const savedImage = downloaded.has(image);
  if (savedImage) {
    await helpers.wait(300);
    image.localUri = savedImage.localUri;
    $img.src = savedImage.localUri;
  } else {
    loader
      .showValue(true)
      .show();
    loadedImage.onprogress = (progress) => {
      if (progress === 100) {
        loader.hide();
        return;
      }
      if (progress === 99.9) {
        loader.animate();
        return;
      }

      loader.progress(progress);
    };
    $img.src = await loadedImage.getLocalUri();
  }

  /**
   *
   * @param {MouseEvent} e
   */
  function handleOnclick(e) {
    const $target = e.target;
    if ($target instanceof HTMLElement) {
      const action = $target.getAttribute('action');
      if (!action) return;

      switch (action) {
        case 'set-wallpaper':
          setWallpaper();
          break;
        case 'save-image':
          saveImage();
          break;
        default:
          break;
      }
    }
  }

  async function saveImage() {
    if (hasStoragePermission) {
      loader
        .showValue(false)
        .show()
        .animate()
        .message(`${strings.saving}...`);
      const { name } = loadedImage;
      const destination = url.join(cordova.file.externalRootDirectory, 'pictures');
      const parsed = path.parse(name);
      let newFileName = url.join(destination, name);
      let count = 1;

      if (!await fs.exists(destination)) {
        await fs.createDir(destination);
      }

      await (async function findNewName() {
        if (await fs.exists(newFileName)) {
          const newName = `${parsed.name}_${count++}${parsed.ext}`;
          newFileName = url.join(destination, newName);
          findNewName();
        }
      }());

      if (image.localUri) {
        try {
          const { data } = await fs.readFile(image.localUri);
          await fs.writeFile(newFileName, data, true, false);
          loader.hide();
          alert(strings.INFO, strings.imageSaved);
        } catch (error) {
          loader.hide();
          alert(strings.ERROR, helpers.getErrorMessage(error));
        }
      }

      return;
    }

    alert(strings.INFO, strings.permissionRequired);
  }

  async function setWallpaper() {
    const API = await new Promise((resolve, reject) => {
      window.wallpaper.getAPILevel(resolve, reject);
    });

    try {
      if (API >= 24) {
        const which = await askWhich();
        await setWallpaperFor(which);
      } else {
        await setWallpaperFor('HOME');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function askWhich() {
    return new Promise((resolve) => {
      const box = Box(strings.setAs, options, 'center', true);
      box.render();
      box.$mask.onclick = box.hide;
      box.$body.onclick = (e) => {
        box.hide();
        const $target = e.target;
        if (!($target instanceof HTMLElement)) return;
        const which = $target.getAttribute('which');
        if (!which) return;

        resolve(which);
      };
    });
  }

  async function setWallpaperFor(which) {
    loader
      .showValue(false)
      .show()
      .animate()
      .message(`${strings.settingWallpaper}...`);

    try {
      const contentUri = await new Promise((resolve, reject) => {
        window.system.convertUriToContentSchema($img.src, (res) => {
          console.log(res);
          resolve(res);
        }, (err) => {
          console.error(err);
          reject(err);
        });
      });

      const { scale } = $pinchZoom;
      const scaledImageWidth = ($img.clientWidth * scale);
      const scaledImageHeight = ($img.clientHeight * scale);
      const rect = {
        x: Math.abs($pinchZoom.x / scaledImageWidth),
        y: Math.abs($pinchZoom.y / scaledImageHeight),
        h: $device.clientHeight / scaledImageHeight,
        w: $device.clientWidth / scaledImageWidth,
        s: scale,
      };
      window.wallpaper.setWallpaper(which, contentUri, rect, onSetWallpaper, (err) => {
        loader
          .hide()
          .message('');
        alert(strings.ERROR, err);
      });
    } catch (error) {
      loader.hide();
      console.error(error);
    }
  }

  function onSetWallpaper(res) {
    if (res) {
      loader.hide();
      alert(strings.INFO, strings.wallpaperChanged);
      document.dispatchEvent(new CustomEvent('wallpaperchange'));
    }
  }

  function handlePinchZoom() {
    const { scale } = $pinchZoom;

    const y = (scaleY) => {
      const newY = $pinchZoom.y;
      const newHeight = -((($img.clientHeight * scaleY) + 4) - $pinchZoom.clientHeight);

      if (newY > 0) return 0;
      if (newY < newHeight) return newHeight;
      return newY;
    };

    const x = (scaleX) => {
      const newX = $pinchZoom.x;
      const newWidth = -(($img.clientWidth * scaleX) - $pinchZoom.clientWidth);

      // console.log({ newX, newWidth });
      if (newX > 0) return 0;
      if (newX < newWidth) return newWidth;
      return newX;
    };

    if (scale > MIN_SCALE && scale <= MAX_SCALE) {
      $pinchZoom.setTransform({
        y: y(scale),
        x: x(scale),
        allowChangeEvent: false,
      });
    } else if (scale > MAX_SCALE) {
      $pinchZoom.setTransform({
        scale: MAX_SCALE,
        x: oldX,
        y: oldY,
        allowChangeEvent: false,
      });
    } else {
      $pinchZoom.setTransform({
        scale: MIN_SCALE,
        x: x(MIN_SCALE),
        y: y(MIN_SCALE),
        allowChangeEvent: false,
      });
    }

    oldX = $pinchZoom.x;
    oldY = $pinchZoom.y;
  }
}

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
  const downloadImage = DownloadImage(image);
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

  $button.addEventListener('click', handleOnclick);
  $pinchZoom.addEventListener('change', handlePinchZoom);
  $page.onhide = () => {
    $button.removeEventListener('click', handleOnclick);
    $pinchZoom.removeEventListener('change', handlePinchZoom);
    downloadImage.abort();
    loader.destroy();
  };

  await helpers.wait(300);

  if (image.src.thumbnail) {
    $img.src = image.src.thumbnail;
  }
  const downloadedImage = downloaded.has(image);
  if (downloadedImage) {
    await helpers.wait(300);
    $img.src = downloadedImage.localUri;
  } else {
    loader.show();
    downloadImage.onprogress = (progress) => {
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
    $img.src = await downloadImage.getLocalUri();
  }

  async function handleOnclick() {
    const API = await new Promise((resolve, reject) => {
      window.wallpaper.getAPILevel(resolve, reject);
    });

    try {
      if (API >= 24) {
        const which = await askWhich();
        await setWallpaper(which);
      } else {
        await setWallpaper('HOME');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function askWhich() {
    return new Promise((resolve) => {
      const box = Box('Set wallpaper as', options, 'center', true);
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

  async function setWallpaper(which) {
    loader
      .show()
      .percentageTextVisible(false)
      .animate()
      .messageText = 'Setting wallpaper...';

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
          .messageText = '';
        alert('ERROR', err);
      });
    } catch (error) {
      loader.hide();
      console.error(error);
    }
  }

  function onSetWallpaper(res) {
    if (res) {
      loader.hide();
      alert('INFO', 'Wallpaper changed successfuly!');
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

// import tag from 'html-tag-js';
import colors from '../colors';
import Collection from '../pages/collection/collection';

/**
 *
 * @param {String} title
 * @param {'solid-colors' | 'patterns' | 'gradient'} type
 */
export default function GeneratedImage(title, type) {
  const { height, width } = window.screen;
  const sHeight = 650;
  const sWidth = (sHeight / height) * width;
  const original = { width, height };
  const thumbnail = { width: sWidth, height: sHeight };
  const colorNames = shuffleArray(Object.keys(colors));

  if (type === 'solid-colors') {
    const count = 25;
    let pageNo = 0;

    Collection('Solid colors', async () => {
      const start = (pageNo++) * count;
      const end = start + count;
      const colorsSection = colorNames.slice(start, end);

      /**
       * @type {Array<Image>}
       */
      const images = [];
      const len = colorsSection.length;
      for (let i = 0; i < len; ++i) {
        const colorName = colorsSection[i];
        const color = colors[colorName];

        images.push(new Promise((resolve) => {
          (async () => {
            const originalSrc = await createImage(original, color);
            const thumbnailSrc = await createImage(thumbnail, color);

            resolve({
              id: colorName,
              height,
              width,
              avgColor: color,
              src: {
                original: originalSrc,
                thumbnail: thumbnailSrc,
              },
            });
          })();
        }));
      }
      const result = await Promise.all(images);
      return result;
    });
  }
}

/**
 *
 * @param {{height: Number, width: Number}} dimension
 * @param {String} color
 */
function createImage(dimension, color) {
  const { height, width } = dimension;
  const $canvas = document.createElement('canvas');
  const ctx = $canvas.getContext('2d');
  $canvas.height = height;
  $canvas.width = width;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return new Promise((resolve, reject) => {
    $canvas.toBlob((blob) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(blob);
      fileReader.onloadend = (e) => {
        resolve(e.target.result);
      };
      fileReader.onerror = reject;
    }, 'image/jpeg', 1);
  });
}

/**
 *
 * @param {Array<String>} array
 * @returns {Array<String>}
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

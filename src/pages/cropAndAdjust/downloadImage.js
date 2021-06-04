import ajax from '@deadlyjack/ajax';
import downloaded from '../../lib/downloaded';
import fs from '../../utils/fs';
import helpers from '../../utils/helpers';

/**
 *
 * @param {Image} image
 */
export default function DownloadImage(image) {
  const filename = `${image.id}.jpeg`;
  let onProgress;
  let xhr;
  let aborted;
  let imageData;

  return {
    /**
     * @type {ArrayBuffer}
     */
    get imageData() {
      return imageData;
    },
    get name() {
      return filename;
    },
    get onprogress() {
      return onProgress;
    },
    set onprogress(fun) {
      onProgress = fun;
    },
    async getLocalUri() {
      const downloadedImage = downloaded.has(image);
      if (!downloadedImage) {
        const imageDir = cordova.file.externalDataDirectory;
        const imageLocalUri = imageDir + filename;
        const data = await ajax({
          url: image.src.original,
          responseType: 'arraybuffer',
          xhr: (xhrObj) => {
            xhr = xhrObj;
            xhrObj.onprogress = (e) => {
              const percent = (e.loaded / e.total) * 100;
              helpers.call(onProgress, Math.min(percent, 99.9));
            };

            xhrObj.onabort = () => {
              aborted = true;
              helpers.call(onProgress, 100);
            };
          },
        }); // END: ajax call

        if (aborted || !data) {
          helpers.call(onProgress, 100);
          return null;
        }

        imageData = data;
        await fs.writeFile(imageLocalUri, data, true, false);

        helpers.call(onProgress, 100);
        image.localUri = imageLocalUri;
        if (/^https?:\/\//.test(image.src.original)) downloaded.add(image);
        return imageLocalUri;
      }

      return downloadedImage.localUri;
    },
    abort() {
      if (xhr && 'abort' in xhr) xhr.abort();
    },
  };
}

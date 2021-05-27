import ajax from '@deadlyjack/ajax';
import downloaded from '../../lib/downloaded';
import helpers from '../../utils/helpers';

/**
 *
 * @param {Image} image
 */
export default function DownloadImage(image) {
  let onProgress;
  let xhr;
  let aborted;

  return {
    get onprogress() {
      return onProgress;
    },
    set onprogress(fun) {
      onProgress = fun;
    },
    async getLocalUri() {
      const downloadedImage = downloaded.has(image);
      if (!downloadedImage) {
        const filename = `${image.id}.jpeg`;
        const imageDir = cordova.file.dataDirectory;
        const imageLocalUri = imageDir + filename;
        const imageData = await ajax({
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

        if (aborted || !imageData) {
          helpers.call(onProgress, 100);
          return null;
        }

        await new Promise((resolve, reject) => {
          window.resolveLocalFileSystemURL(imageDir, (dirEntry) => {
            dirEntry.getFile(filename, { create: true, exclusive: false }, (fileEntry) => {
              fileEntry.createWriter((file) => {
                file.onwriteend = resolve;
                file.onerror = reject;
                file.write(imageData);
              });
            }, reject);
          }, reject);
        }); // END: Promise

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

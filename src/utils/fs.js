import ajax from '@deadlyjack/ajax';
import Url from './url';

export default {
  /**
   *
   * @param {string} url
   * @returns {Promise<Array<Entry>>}
   */
  listDir(url) {
    return new Promise((resolve, reject) => {
      function success(fs) {
        const reader = fs.createReader();
        reader.readEntries(resolve, reject);
      }

      window.resolveLocalFileSystemURL(url, success, reject);
    });
  },

  /**
   *
   * @param {string} filename
   * @param {any} data
   * @param {boolean} create If this property is true, and the requested file or
   * directory doesn't exist, the user agent should create it.
   * The default is false. The parent directory must already exist.
   * @param {boolean} exclusive If true, and the create option is also true,
   * the file must not exist prior to issuing the call.
   * Instead, it must be possible for it to be created newly at call time. The default is false.
   * @returns {Promise<String>}
   */
  writeFile(filename, data, create = false, exclusive = true) {
    const name = filename.split('/').pop();
    const path = Url.dirname(filename);

    if (data instanceof ArrayBuffer) {
      data = new Blob([data]);
    }

    return new Promise((resolve, reject) => {
      if (!create) {
        window.resolveLocalFileSystemURL(filename, (fileEntry) => {
          if (!fileEntry.isFile) reject(new Error('Expected file but got directory.'));
          fileEntry.createWriter((file) => {
            file.onwriteend = () => resolve(filename);
            file.onerror = (err) => reject(err.target.error);
            file.write(data);
          });
        }, reject);
      } else {
        window.resolveLocalFileSystemURL(path, (fs) => {
          fs.getFile(name, {
            create,
            exclusive: create ? exclusive : false,
          }, (fileEntry) => {
            fileEntry.createWriter((file) => {
              file.onwriteend = () => resolve(filename);
              file.onerror = (err) => reject(err.target.error);
              file.write(data);
            });
          }, reject);
        }, reject);
      }
    });
  },

  /**
   *
   * @param {string} filename
   * @returns {Promise}
   */
  deleteFile(filename) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(filename, (entry) => {
        if (entry.isFile) {
          entry.remove(resolve, reject);
        } else {
          entry.removeRecursively(resolve, reject);
        }
      }, reject);
    });
  },

  /**
   *
   * @param {string} filename
   * @returns {Promise<any>}
   */
  readFile(filename) {
    return new Promise((resolve, reject) => {
      if (!filename) return reject(new Error(`Invalid valud of fileURL: ${filename}`));

      return ajax({
        url: filename,
        responseType: 'arraybuffer',
      }).then((res) => {
        if (res) {
          return resolve({
            data: res,
          });
        }
        return Promise.reject();
      }).catch(() => {
        window.resolveLocalFileSystemURL(filename, (fileEntry) => {
          fileEntry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onloadend = function onloadend() {
              resolve({
                file,
                data: this.result,
              });
            };

            fileReader.onerror = reject;

            fileReader.readAsArrayBuffer(file);
          }, reject);
        }, reject);
      });
    });
  },

  /**
   *
   * @param {string} url
   * @param {string} newname
   * @returns {Promise<String>}
   */
  renameFile(url, newname) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(url, (fs) => {
        fs.getParent((parent) => {
          const parentUrl = Url.decode(parent.nativeURL);
          const newUrl = Url.join(parentUrl, newname);
          fs.moveTo(parent, newname, () => resolve(newUrl), reject);
        }, reject);
      }, reject);
    });
  },

  /**
   *
   * @param {string} path
   * @param {string} dirname
   * @returns {Promise<String>}
   */
  createDir(path, dirname) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(path, (fs) => {
        fs.getDirectory(dirname, {
          create: true,
        }, () => resolve(Url.join(path, dirname)), reject);
      }, reject);
    });
  },

  /**
   *
   * @param {String} src
   * @param {String} dest
   * @returns
   */
  copy(src, dest) {
    return this.moveOrCopy('copyTo', src, dest);
  },

  move(src, dest) {
    return this.moveOrCopy('moveTo', src, dest);
  },

  /**
   *
   * @param {"copyTO"|"moveTo"} action
   * @param {string} src
   * @param {string} dest
   * @returns {Promise<String>}
   */
  moveOrCopy(action, src, dest) {
    return new Promise((resolve, reject) => {
      this.verify(src, dest)
        .then((res) => {
          const {
            src: srcUrl,
            dest: destUrl,
          } = res;

          srcUrl[action](
            destUrl,
            undefined,
            (entry) => resolve(Url.decode(entry.nativeURL)),
            reject,
          );
        })
        .catch(reject);
    });
  },

  /**
   *
   * @param {String} filename
   * @returns {Promise<FileStatus>}
   */
  stats(filename) {
    return new Promise((resolve, reject) => {
      window.sdcard.stats(filename, (stats) => {
        stats.uri = filename;
        resolve(stats);
      }, reject);
    });
  },

  /**
   *
   * @param {string} src
   * @param {string} dest
   * @returns {Promise<{src:Entry, dest:Entry}>}
   */
  verify(src, dest) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(src, (srcEntry) => {
        window.resolveLocalFileSystemURL(dest, (destEntry) => {
          const srcUrl = Url.decode(destEntry.nativeURL) + srcEntry.name;
          window.resolveLocalFileSystemURL(srcUrl, () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              code: 12,
            });
          }, (err) => {
            if (err.code === 1) {
              resolve({
                src: srcEntry,
                dest: destEntry,
              });
            } else {
              reject(err);
            }
          });
        }, reject);
      }, reject);
    });
  },

  /**
   *
   * @param {Promise<Boolean>} url
   */
  exists(url) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(url, () => {
        resolve(true);
      }, (err) => {
        if (err.code === 1) resolve(false);
        reject(err);
      });
    });
  },

};

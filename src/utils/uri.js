import path from './path';

export default {
  /**
   * Parse content uri to rootUri and docID
   *
   * eg.
   *```js
   * parse("content://.../AA98-181D%3A::.../index.html")
   * //{rootUri: "content://.../AA98-181D%3A", docId: "...index.html"}
   *```
   *
   * @param {string} contentUri
   * @returns {{rootUri: string, docId: string, isFileUri: boolean}}
   */
  parse(contentUri) {
    let rootUri;
    let
      docId = '';

    const DOC_PROVIDER = /^content:\/\/com\.((?![:<>"/\\|?*]).)*\.documents\//;
    const TREE_URI = /^content:\/\/com\.((?![:<>"/\\|?*]).)*\.documents\/tree\//;
    const SINGLE_URI = /^content:\/\/com\.(((?![:<>"/\\|?*]).)*)\.documents\/document/;
    const PRIMARY = /^content:\/\/com\.android\.externalstorage\.documents\/document\/primary/;
    let FILE_ROOT;

    try {
      FILE_ROOT = cordova.file.externalRootDirectory;
    } catch (error) {
      FILE_ROOT = 'file:///storage/emulated/0/';
    }

    if (DOC_PROVIDER.test(contentUri)) {
      // If matches, it means url can be converted to file:///
      if (PRIMARY.test(contentUri)) {
        rootUri = FILE_ROOT + decodeURIComponent(contentUri).split(':').slice(-1)[0];
      } else if (TREE_URI.test(contentUri)) {
        if (/::/.test(contentUri)) {
          [rootUri, docId] = contentUri.split('::');
        } else {
          rootUri = contentUri;
          docId = decodeURIComponent(contentUri.split('/').slice(-1)[0]);
        }
      } else if (SINGLE_URI.test(contentUri)) {
        const [provider, providerId] = SINGLE_URI.exec(contentUri);
        docId = decodeURIComponent(contentUri); // DecodUri
        docId = docId.replace(provider, ''); // replace single to tree
        docId = path.normalize(docId); // normalize docid

        if (docId.startsWith('/')) docId = docId.slice(1); // remove leading '/'

        rootUri = `content://com.${providerId}.documents/tree/${docId.split(':')[0]}%3A`;
      }

      return {
        rootUri,
        docId,
        isFileUri: /^file:\/\/\//.test(rootUri),
      };
    }

    throw new Error('Invalid uri format.');
  },
  /**
   * Formats the five contentUri object to string
   * @param {{rootUri: string, docId: string} | String} contentUriObject or rootId
   * @param {string} [docId]
   * @returns {string}
   */
  format(contentUriObject, docId) {
    let rootUri;

    if (typeof contentUriObject === 'string') {
      rootUri = contentUriObject;
    } else {
      rootUri = contentUriObject.rootUri;
      docId = contentUriObject.docId;
    }

    if (docId) return [rootUri, docId].join('::');
    return rootUri;
  },
  /**
   * Gets virtual address by replacing root with name i.e. added in file explorer
   * @param {string} url
   */
  getVirtualAddress(url) {
    try {
      const {
        docId,
        rootUri,
        isFileUri,
      } = this.parse(url);

      if (isFileUri) return url;
      const customUuid = JSON.parse(localStorage.customUuid || '[]');

      const found = customUuid.find((storage) => storage.uri === rootUri);
      if (found) {
        const id = rootUri.split('/').pop();
        let filePath = docId.replace(this.decode(id), '');
        if (filePath.startsWith('/')) filePath = filePath.slice(1);
        return `${found.name}/${filePath}`;
      }
      return null;
    } catch (e) {
      return url;
    }
  },
  decode(url) {
    if (/%[0-9a-f]{2}/i.test(url)) {
      const newurl = decodeURIComponent(url);
      if (url === newurl) return url;
      return this.decode(newurl);
    }
    return url;
  },
};

import path from './path';
import Uri from './uri';

export default {

  /**
   * Returns basename from a url eg. 'index.html' from 'ftp://localhost/foo/bar/index.html'
   * @param {string} url
   */
  basename(url) {
    url = this.parse(url).url;
    const protocol = this.getProtocol(url);
    if (protocol === 'content:') {
      try {
        const {
          rootUri,
          docId,
          isFileUri,
        } = Uri.parse(url);
        let id;

        if (isFileUri) return this.basename(rootUri);
        if (docId.endsWith('/')) id = docId.slice(0, -1);

        id = docId.split(':').pop();
        return this.pathname(id).split('/').pop();
      } catch (error) {
        return null;
      }
    } else {
      if (url.endsWith('/')) url = url.slice(0, -1);
      return this.pathname(url).split('/').pop();
    }
  },
  /**
   *
   * @param {String} url
   * returns the extension of the path, from the last occurrence of the . (period)
   * character to end of string in the last portion of the path.
   * If there is no . in the last portion of the path, or if there are no .
   * characters other than the first character of the basename of path (see path.basename()),
   * an empty string is returned.
   */
  extname(url) {
    const name = this.basename(url);
    if (name) return path.extname(name);
    return null;
  },
  /**
   *
   * @param  {...string} pathnames
   */
  join(...pathnames) {
    if (pathnames.length < 2) throw new Error('Required at least two parameters');

    const {
      url,
      query,
    } = this.parse(pathnames[0]);
    let modifiedUrl;

    const protocol = (this.PROTOCOL_PATTERN.exec(url) || [])[0] || '';

    if (protocol === 'content://') {
      try {
        if (pathnames[1].startsWith('/')) pathnames[1] = pathnames[1].slice(1);
        const contentUri = Uri.parse(url);
        // const protocol = this.getProtocol(contentUri.rootUri);
        if (protocol === 'content://') {
          const [root, pathname] = contentUri.docId.split(':');
          const newDocId = path.join(pathname, ...pathnames.slice(1));
          return `${contentUri.rootUri}::${root}:${newDocId}${query}`;
        }
        return this.join(contentUri.rootUri, ...pathnames.slice(1));
      } catch (error) {
        return null;
      }
    } else if (protocol) {
      modifiedUrl = url.replace(new RegExp(`^${protocol}`), '');
      pathnames[0] = modifiedUrl;
      return protocol + path.join(...pathnames) + query;
    } else {
      return path.join(url, ...pathnames.slice(1)) + query;
    }
  },
  /**
   * Make url safe by encoding url components
   * @param {string} url
   */
  safe(url) {
    function fixedEncodeURIComponent(str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);
    }

    const {
      url: uri,
      query,
    } = this.parse(url);
    url = uri;
    const protocol = (this.PROTOCOL_PATTERN.exec(url) || [])[0] || '';
    if (protocol) url = url.replace(new RegExp(`^${protocol}`), '');
    const parts = url.split('/').map((part, i) => {
      if (i === 0) return part;
      return fixedEncodeURIComponent(part);
    });
    return protocol + parts.join('/') + query;
  },
  /**
   * Gets pathname from url eg. gets '/foo/bar' from 'ftp://myhost.com/foo/bar'
   * @param {string} url
   */
  pathname(url) {
    if (typeof url !== 'string' || !this.PROTOCOL_PATTERN.test(url)) return url;

    [url] = url.split('?');
    const protocol = (this.PROTOCOL_PATTERN.exec(url) || [])[0] || '';

    if (protocol === 'content://') {
      try {
        const {
          rootUri,
          docId,
          isFileUri,
        } = Uri.parse(url);
        if (isFileUri) return this.pathname(rootUri);
        return `/${docId.split(':')[1] || docId}`;
      } catch (error) {
        return null;
      }
    } else {
      if (protocol) url = url.replace(new RegExp(`^${protocol}`), '');

      if (protocol !== 'file:///') return `/${url.split('/').slice(1).join('/')}`;

      return `/${url}`;
    }
  },

  /**
   * Returns dirname from url eg. 'ftp://localhost/foo/'  from 'ftp://localhost/foo/bar'
   * @param {string} url
   */
  dirname(url) {
    if (typeof url !== 'string') throw new Error('URL must be string');

    const urlObj = this.parse(url);
    url = urlObj.url;
    const protocol = this.getProtocol(url);

    if (protocol === 'content:') {
      try {
        const {
          rootUri,
          docId,
          isFileUri,
        } = Uri.parse(url);
        let id;

        if (isFileUri) return this.dirname(rootUri);
        if (docId.endsWith('/')) id = docId.slice(0, -1);

        id = [...docId.split('/').slice(0, -1), ''].join('/');
        return Uri.format(rootUri, id);
      } catch (error) {
        return null;
      }
    } else {
      if (url.endsWith('/')) url = url.slice(0, -1);
      return [...url.split('/').slice(0, -1), ''].join('/') + urlObj.query;
    }
  },

  /**
   * Parse given url into url and query
   * @param {string} url
   * @returns {URLObject}
   */
  parse(url) {
    const [uri, query = ''] = url.split(/(?=\?)/);
    return {
      url: uri,
      query,
    };
  },

  /**
   * Formate Url object to string
   * @param {object} urlObj
   * @param {"ftp:"|"sftp:"|"http:"|"https:"} urlObj.protocol
   * @param {string|number} urlObj.hostname
   * @param {string} [urlObj.path]
   * @param {string} [urlObj.username]
   * @param {string} [urlObj.password]
   * @param {string|number} [urlObj.port]
   * @param {object} [urlObj.query]
   */
  formate(urlObj) {
    const {
      protocol,
      hostname,
      username,
      password,
      path: pathname,
      port,
      query,
    } = urlObj;

    const enc = (str) => encodeURIComponent(str);

    if (!protocol || !hostname) throw new Error("Cannot formate url. Missing 'protocol' and 'hostname'.");

    let string = `${protocol}//`;

    if (username && password) string += `${enc(username)}:${enc(password)}@`;
    else if (username) string += `${username}@`;

    string += hostname;

    if (port) string += `:${port}`;

    if (pathname) {
      let modifiedPath;
      if (!pathname.startsWith('/')) modifiedPath = `/${pathname}`;

      string += modifiedPath;
    }

    if (query && typeof query === 'object') {
      string += '?';

      Object.keys(query).forEach((key) => {
        string += `${enc(key)}=${enc(query[key])}&`;
      });

      string = string.slice(0, -1);
    }

    return string;
  },
  /**
   * Returns protocol of a url e.g. 'ftp:' from 'ftp://localhost/foo/bar'
   * @param {string} url
   * @returns {"ftp:"|"sftp:"|"http:"|"https:"}
   */
  getProtocol(url) {
    return (/^([a-z]+:)\/\/\/?/i.exec(url) || [])[1] || '';
  },
  /**
   *
   * @param {string} url
   * @returns {string}
   */
  hidePassword(url) {
    const urlObj = new URL(url);
    if (urlObj.protocol === 'file:') {
      return url;
    }
    return `${urlObj.origin}${urlObj.pathname}`;
  },
  /**
   *
   * @param {string} url
   * @returns
   */
  decode(url) {
    if (/%[0-9a-f]{2}/i.test(url)) {
      const newurl = decodeURIComponent(url);
      if (url === newurl) return url;
      return this.decode(newurl);
    }
    return url;
  },
  PROTOCOL_PATTERN: /^[a-z]+:\/\/\/?/i,
};

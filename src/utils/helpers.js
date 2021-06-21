import tag from 'html-tag-js';

export default {
  /**
   * Returns unique ID
   * @returns {string}
   */
  uuid() {
    return (new Date().getTime() + parseInt(Math.random() * 100000000000, 10)).toString(36);
  },
  getErrorMessage(error) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof String) {
      errorMessage = error;
    } else if ('toString' in error && typeof error.toString === 'function') {
      errorMessage = error.toString();
    }
    return errorMessage;
  },
  /**
   *
   * @param {function(...any):void} fun
   * @param  {...any} args
   * @returns {any}
   */
  call(fun, ...args) {
    if (typeof fun === 'function') return fun(...args);
    return null;
  },
  /**
   *
   * @param {Number} time
   * @returns {Promise<void>}
   */
  wait(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  },
  /**
   *
   * @param {String} color
   * @returns {[Number, Number, Number]}
   */
  saperateRGB(color) {
    const rgb = [];

    if (color[0] === '#') {
      color = color.slice(1, 6);
      const end = -(color.length % 3);
      color = (end ? color.slice(0, end) : color).split('');

      if (color.length === 3) {
        color.splice(1, 0, color[0]);
        color.splice(3, 0, color[2]);
        color.splice(5, 0, color[4]);
      }

      while (color.length) {
        const c = color.splice(0, 2).join('');
        rgb.push(parseInt(c, 16));
      }
      return rgb;
    }

    if (/^rgb/.test(color)) {
      [, color] = /rgba?\((.+)\)/.exec(color);
      color = color.split(',')
        .map((c) => parseInt(c, 10))
        .slice(0, 3);
      rgb.push(...color);
    }

    return rgb;
  },
  openlink(href) {
    const $a = tag('a', {
      href,
    });

    document.body.append($a);
    $a.click();
    $a.remove();
  },
};

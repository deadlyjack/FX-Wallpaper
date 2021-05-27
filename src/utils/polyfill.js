/* eslint-disable no-bitwise */
/* eslint-disable no-extend-native */
if (!HTMLElement.prototype.getParent) {
  HTMLElement.prototype.getParent = function getParent(queryString) {
    const $$ = [...document.querySelectorAll(queryString)];
    return $$.find(($) => $.contains(this));
  };
}

Object.defineProperty(String.prototype, 'hashCode', {
  value() {
    let hash = 0;
    for (let i = 0; i < this.length; i += 1) {
      const chr = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) + (hash < 0 ? 'N' : '');
  },
});

Object.defineProperty(String.prototype, 'subtract', {
  value(str) {
    return this.replace(new RegExp(`^${str}`), '');
  },
});

Object.defineProperty(String.prototype, 'capitalize', {
  value(index) {
    if (typeof index === 'number' && index >= 0) {
      const strs = [this.slice(0, index), this.slice(index, index + 1), this.slice(index + 1)];
      return strs[0] + (strs[1] ? strs[1].toUpperCase() : '') + strs[2];
    }
    let strs = this.split(' ');
    strs = strs.map((str) => {
      if (str.length > 0) return (str[0].toUpperCase() + str.slice(1));
      return '';
    });
    return strs.join(' ');
  },
});

Object.defineProperty(String.prototype, 'toNumber', {
  value() {
    return +this.replace(/[^0-9.-]+/g, '');
  },
});

Object.defineProperty(String.prototype, 'escapeRegexp', {
  value() {
    return this.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  },
});

Object.defineProperty(String.prototype, 'toOnlyAlphabets', {
  value() {
    return this.replace(/[^a-z]/ig, '');
  },
});

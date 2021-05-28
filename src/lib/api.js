import ajax from '@deadlyjack/ajax';

export default function Api(pageSize = 10) {
  function requestObj(url) {
    return {
      url: `https://wallpaper.foxdebug.com/${url}`,
    };
  }

  return {
    async all(page) {
      const request = requestObj(`images/all?page=${page}&count=${pageSize}`);
      const response = await ajax(request);
      return response;
    },
    async collections() {
      const request = requestObj('collections');
      const response = await ajax(request);
      return response;
    },
    /**
     *
     * @param {String} id ID of the collection
     * @param {Number} page Page number
     */
    async collection(id, page = 1) {
      const request = requestObj(`collection/${id}?search=on&page=${page}&count=${pageSize}`);
      const response = await ajax(request);
      return response;
    },
    /**
     * @returns {Number}
     */
    get PER_PAGE() {
      return pageSize;
    },
  };
}

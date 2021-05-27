export default {
  /**
   * Add an image to favorite list.
   * @param {Image} image
   */
  add(image, docName) {
    const doc = this.retrive(docName);
    doc.push(image);
    localStorage[docName] = JSON.stringify(doc);
  },
  /**
   * Remove an image from favorite list.
   * @param {Image} image
   */
  remove(image, docName) {
    const doc = this.retrive(docName);
    const { id } = image;
    const newList = doc.filter((favorite) => favorite.id !== id);
    localStorage[docName] = JSON.stringify(newList);
  },
  /**
   * Clears favorite list permanently
   */
  clear(docName) {
    localStorage[docName] = '[]';
  },
  /**
   * Finds an image in favorite list.
   * @param {Image} image
   * @returns {Image}
   */
  has(image, docName) {
    const doc = this.retrive(docName);
    const { id } = image;
    const found = doc.find((record) => record.id === id);
    return found;
  },
  /**
   * Retrive all images from favorite list.
   * @returns {Array<Image>}
   */
  retrive(docName) {
    let doc = JSON.parse(localStorage[docName] || '[]');
    if (!Array.isArray(doc)) doc = [];
    return doc;
  },
};

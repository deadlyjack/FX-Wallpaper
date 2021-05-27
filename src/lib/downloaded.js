import save from './save';

const DOWNLOADED = 'downloaded';

export default {
  /**
   * Add an image to favorite list.
   * @param {Image} image
   */
  add(image) {
    return save.add(image, DOWNLOADED);
  },
  /**
   * Remove an image from favorite list.
   * @param {Image} image
   */
  remove(image) {
    return save.remove(image, DOWNLOADED);
  },
  /**
   * Clears favorite list permanently
   */
  clear() {
    return save.clear(DOWNLOADED);
  },
  /**
   * Finds an image in favorite list.
   * @param {Image} image
   * @returns {Image}
   */
  has(image) {
    return save.has(image, DOWNLOADED);
  },
  /**
   * Retrive all images from favorite list.
   * @returns {Array<Image>}
   */
  retrive() {
    return save.retrive(DOWNLOADED);
  },
};

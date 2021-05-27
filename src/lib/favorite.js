import save from './save';

const FAVORITE = 'favorite';

export default {
  /**
   * Add an image to favorite list.
   * @param {Image} image
   */
  add(image) {
    save.add(image, FAVORITE);
    document.dispatchEvent(new CustomEvent('favorite:add'));
    document.dispatchEvent(new CustomEvent('favorite:change'));
  },
  /**
   * Remove an image from favorite list.
   * @param {Image} image
   */
  remove(image) {
    save.remove(image, FAVORITE);
    document.dispatchEvent(new CustomEvent('favorite:remove'));
    document.dispatchEvent(new CustomEvent('favorite:change'));
  },
  /**
   * Clears favorite list permanently
   */
  clear() {
    save.clear(FAVORITE);
    document.dispatchEvent(new CustomEvent('favorite:clear'));
    document.dispatchEvent(new CustomEvent('favorite:change'));
  },
  /**
   * Finds an image in favorite list.
   * @param {Image} image
   * @returns {Image}
   */
  has(image) {
    return save.has(image, FAVORITE);
  },
  /**
   * Retrive all images from favorite list.
   * @returns {Array<Image>}
   */
  retrive() {
    return save.retrive(FAVORITE);
  },
};

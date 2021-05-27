import './box.scss';

import tag from 'html-tag-js';
import mustache from 'mustache';
import boxHTML from './box.hbs';
import helpers from '../../../utils/helpers';
import config from '../../../config';

/**
 * Creates a popup box
 * @param {String} title title of the box
 * @param {String} body  body of the box
 * @param {"top"|"bottom"|"center"} position  body of the box
 * @param {boolean} cancelable if dialog box is cancelable
 */
export default function Box(title, body, position, cancelable = true) {
  position = position || config.defaultPromptBoxPos || 'top';

  let onhide = null;
  const id = cancelable ? helpers.uuid() : 'dialogbox';
  const $box = tag.parse(mustache.render(boxHTML, {
    id,
    title,
    body,
    position,
  }));

  return {
    render() {
      if (IS_ANDROID) {
        window.StatusBar.backgroundColorByHexString('#131318');
        window.NavigationBar.backgroundColorByHexString('#131318', false);
      }

      document.body.append($box);

      if (cancelable) {
        actionStack.push({
          id,
          action: this.hide,
        });
      }
    },
    hide() {
      if (IS_ANDROID) {
        window.StatusBar.backgroundColorByHexString('#212028');
        window.NavigationBar.backgroundColorByHexString('#212028', false);
      }

      if (cancelable) actionStack.remove(id);
      $box.get(':scope>.box').classList.add('hide');
      $box.get(':scope>.mask').classList.add('hide');
      setTimeout(() => {
        $box.remove();
      }, 300);
      if (typeof onhide === 'function') onhide();
    },
    get onhide() {
      return onhide;
    },
    set onhide(fun) {
      onhide = fun;
    },
    $mask: $box.get(':scope>.mask'),
    $body: $box.get(':scope>.box>.body'),
  };
}

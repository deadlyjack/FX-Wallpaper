import './page.scss';

import tag from 'html-tag-js';
import mustach from 'mustache';
import pageHTML from './page.hbs';

import helpers from '../../utils/helpers';
import config from '../../config';

/**
 *
 * @param {String} title
 * @param {boolean|PageOption} [options] options or is secondary?
 * @returns {Page}
 */
export default function Page(title, options) {
  let id = helpers.uuid();
  let secondary = false;
  let onhide;

  if (typeof options === 'boolean') {
    secondary = options;
  } else if (typeof options === 'object') {
    id = options.id;
    secondary = options.secondary;
  } else {
    options = {};
  }

  const content = mustach.render(pageHTML, {
    id,
    title,
    secondary,
  });
  const $page = tag.parse(content);

  if (typeof options.onhide === 'function') {
    $page.onhide = options.onhide;
  }

  Object.defineProperties($page, {
    onhide: {
      set(fun) {
        onhide = fun;
      },
      get() {
        return onhide;
      },
    },
    id: {
      value: id,
    },
    render: {
      value() {
        if (secondary) {
          actionStack.push({
            id,
            type: 'page',
            action: this.hide,
          });
        }

        $page.addEventListener('click', (e) => {
          const $target = e.target;
          if ($target instanceof HTMLElement) {
            const action = $target.getAttribute('action');
            if (action === 'back') {
              this.hide();
              actionStack.remove(id);
            }
          }
        });

        app.append(this);
      },
    },
    hide: {
      value() {
        if (typeof onhide === 'function') onhide();
        $page.classList.add('hide');
        setTimeout($page.remove.bind($page), config.pageTransitionTimeout);
      },
    },
    content: {
      get() {
        return this.get('.page-body').innerHTML;
      },
      set(HTMLtext) {
        const $body = this.get('.page-body');
        if (typeof HTMLtext === 'string') $body.innerHTML = HTMLtext;
        if (HTMLtext instanceof HTMLElement) $body.append(HTMLtext);
      },
    },
  });

  return $page;
}

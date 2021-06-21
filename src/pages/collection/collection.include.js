import './collection.scss';
import tag from 'html-tag-js';
import mustache from 'mustache';
import imagePreview from './image-preview.hbs';
import Page from '../../components/page/page';
import favorite from '../../lib/favorite';
import Loader from '../../components/loader';
import CropAndAdjust from '../cropAndAdjust/cropAndAdjust';
import strings from '../../strings';
import helpers from '../../utils/helpers';

/**
 *
 * @param {String} name
 * @param {function():Promise<Array<Image>>} nextPage
 */
export default function CollectionInclude(name, nextPage, onhide) {
  const { innerWidth } = window;
  const width = (Math.min(innerWidth, 800)) / 2;
  const $page = Page(name, {
    id: 'ldxpq13x',
    secondary: true,
  });
  const $pageBody = $page.get('.page-body');
  const pages = [];
  const loader = Loader('#39f');
  let topRow1 = 0;
  let topRow2 = 0;
  let isLoading = false;
  let shouldLoadNewPage = true;
  let counter = 0;
  let imgCounter = 0;
  let row = 1;

  loader
    .show()
    .showValue(false)
    .animate()
    .message(`${strings.loading}...`);

  nextPage().then((images) => {
    const $container = parsePage(images);
    loader.hide();
    if (!$container.innerHTML) {
      $pageBody.setAttribute('empty-message', 'No wallpaper found...');
      return;
    }
    $pageBody.style.height = `${$container.getAttribute('height')}px`;
    renderPage($container);
    pages.push($container);
  });

  $page.addEventListener('scroll', scrollHander);
  $page.addEventListener('click', clickHandler);
  $page.render();

  $page.onhide = () => {
    pages.length = 0;
    $page.removeEventListener('click', clickHandler);
    loader.destroy();
    if (typeof onhide === 'function') onhide();
  };

  function renderPage($container) {
    // [...$pageBody.children].forEach(($el) => $el.remove());
    $pageBody.append($container);
  }

  /**
   *
   * @param {Array<Image>} images
   */
  function parsePage(images) {
    const oldTopRow1 = topRow1;
    const oldTopRow2 = topRow2;
    const id = `page_${++counter}`;
    const $container = tag('div', { id });
    let innerHTML = '';

    images.map((img) => {
      img.page = `Page: ${counter} | Row: ${row}`;
      img.count = `Image: ${++imgCounter}`;
      img.favorite = !!favorite.has(img);
      img.relative_height = ((width / img.width) * img.height);
      img.relative_width = width - 7.5;

      if (row === 1) { // row1
        img.top = topRow1 + 5;
        img.left = 5;
        topRow1 += img.relative_height + 5;
        row = 2;
      } else { // row2
        img.top = topRow2 + 5;
        img.right = 5;
        topRow2 += img.relative_height + 5;
        row = 1;
      }

      innerHTML += mustache.render(imagePreview, img);
      return img;
    });

    const heightRow1 = topRow1 - oldTopRow1;
    const heightRow2 = topRow2 - oldTopRow2;

    $container.innerHTML = innerHTML;
    $container.setAttribute('top', Math.min(topRow1, topRow2));
    $container.setAttribute('bottom', Math.max(topRow1, topRow2));
    $container.setAttribute('height', Math.max(heightRow1, heightRow2));
    return $container;
  }

  /**
   *
   * @param {Event} e
   */
  function clickHandler(e) {
    const $target = e.target;
    if (!($target instanceof HTMLElement)) return;
    const aciton = $target.getAttribute('action');
    switch (aciton) {
      case 'set-wallpaper':
        CropAndAdjust(getImageData($target));
        break;

      case 'open-link':
        helpers.openlink($target.getAttribute('data-href'));
        break;

      case 'favorite':
        setUnsetFavorite($target);
        break;
      default:
        break;
    }
  }

  /**
   *
   * @this {HTMLDivElement}
   */
  function scrollHander() {
    if (isLoading) return;
    const bottom = this.scrollHeight * 0.98;
    const oldScrollTop = this.scrollTop;
    if (bottom <= (oldScrollTop + this.clientHeight) && shouldLoadNewPage) {
      isLoading = true;
      loader
        .show();
      nextPage()
        .then((images) => {
          loader.hide();
          isLoading = false;
          if (!images.length) {
            shouldLoadNewPage = false;
            return;
          }
          const $container = parsePage(images);
          $pageBody.style.height = `${$container.bottom}px`;
          renderPage($container);
          pages.push($container);
        });
    }
  }
}

function setUnsetFavorite($target) {
  const image = getImageData($target);
  $target.classList.toggle('fill-red');
  $target.classList.add('pop');
  setTimeout(() => {
    $target.classList.remove('pop');
  }, 100);

  if (favorite.has(image)) {
    favorite.remove(image);
  } else {
    favorite.add(image);
  }
}

/**
 *
 * @param {HTMLElement} $target
 */
function getImageData($target) {
  $target = tag.get(`[image-id='${$target.getAttribute('image-id')}']`);
  const getAtr = (atr) => $target.getAttribute(atr);
  return {
    id: getAtr('image-id'),
    avgColor: getAtr('avg-color'),
    height: getAtr('image-height'),
    width: getAtr('image-width'),
    meta: {
      author: getAtr('author'),
      website: getAtr('website'),
      email: getAtr('email'),
    },
    src: {
      thumbnail: getAtr('url-thumbnail'),
      original: getAtr('url-original'),
    },
  };
}

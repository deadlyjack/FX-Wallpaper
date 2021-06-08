import './home.scss';
import tag from 'html-tag-js';
import mustache from 'mustache';
import page from './home.hbs';
import header from './header.hbs';
import Api from '../../lib/api';
import Page from '../../components/page/page';
import Collection from '../collection/collection';
import favorite from '../../lib/favorite';
import strings from '../../strings';
import CropAndAdjust from '../cropAndAdjust/cropAndAdjust';
import Settings from '../settings/settings';
import GeneratedImage from '../../lib/generatedImage';
import helpers from '../../utils/helpers';

const MY_LIKES = 'my likes';
const SOLID_COLORS = 'solid colors';
const MY_GALLARY = 'my gallary';
const EXPLORE = 'explore';

export default function HomeInclude() {
  const PER_PAGE = 25;
  const MAX_WIDTH = 600;
  const $page = Page('Home', {
    id: 'logu5ufd',
    secondary: false,
  });
  const api = Api(PER_PAGE);
  const $pageBody = $page.get('.page-body');
  const $header = $page.get('header');
  const { innerWidth } = window;
  const width = ((Math.min(innerWidth, MAX_WIDTH)) / 2) - 15;
  const height = width * 2;
  const collections = [];
  const { permissions } = cordova.plugins;
  const permissionToRequest = permissions.READ_EXTERNAL_STORAGE;
  let message;
  let lastSearch;
  const tags = [MY_GALLARY];

  if (favorite.retrive().length > 0) {
    tags.push(MY_LIKES);
  }

  if (window.Worker) {
    tags.push(SOLID_COLORS);
  }

  tags.push(EXPLORE);
  $pageBody.style.width = `${Math.min(innerWidth, MAX_WIDTH)}px`;
  $header.innerHTML = header;
  const $searchInput = $header.get('[type=search]');

  document.addEventListener('wallpaperchange', onWallpaperChange);
  document.addEventListener('favorite:change', onFvoriteChange);
  $searchInput.addEventListener('search', submitHandler);
  $searchInput.addEventListener('focus', onfocus);
  $page.addEventListener('click', clickHandler);
  $page.render();
  render();

  api.collections()
    .then((res) => {
      if (Array.isArray(res)) {
        tags.push(...res);
      }
      render();
    })
    .catch((err) => {
      console.log(err);
    });

  permissions.checkPermission(permissionToRequest, ({ hasPermission }) => {
    if (hasPermission) {
      window.hasStoragePermission = true;
      addSystemWallpaper()
        .then(render)
        .finally(makeAppReady);
    } else {
      const $notification = tag('div', {
        textContent: strings.errorMessage,
        style: {
          width: '100%',
          padding: '20px',
          boxSizing: 'border-box',
          backgroundColor: '#f68',
          textAlign: 'center',
          color: 'white',
          margin: '-10px 0 10px 0',
        },
        attr: {
          action: 'grant-access',
        },
      });
      message = () => ($pageBody.firstElementChild
        ? $pageBody.insertBefore($notification, $pageBody.firstElementChild)
        : $pageBody.append($notification));

      render();
      makeAppReady();
    }
  });

  function makeAppReady() {
    setTimeout(() => {
      app.classList.add('ready');
      setTimeout(() => {
        app.classList.remove('ready', 'not-ready');
      }, 1000);
    }, 500);
  }

  /**
   * @this HTMLFormElement
   * @param {Event} e
   */
  function submitHandler(e) {
    e.preventDefault();
    const searchText = this.value;

    if (!searchText) return;

    this.blur();
    openTag(searchText, api);
  }

  function onfocus() {
    const $text = this;
    if (lastSearch) this.value = lastSearch;
    this.placeholder = strings.search;
    actionStack.push({
      id: 'unfocus-search',
      action() {
        $text.blur();
      },
    });

    this.onblur = function onblur() {
      lastSearch = this.value;
      this.value = '';
      window.system.getAppInfo((res) => {
        this.placeholder = res.label;
      }, () => {
        this.placeholder = 'Wallpaper';
      });
      actionStack.remove('unfocus-search');
    };
  }

  function thumbnail(type, title, src, description) {
    const collection = {
      title,
      type,
      description,
      height,
      width,
      get hidden() {
        return !this.src;
      },
    };

    if (typeof src === 'function') {
      Object.defineProperty(collection, 'src', {
        get: src,
      });
    } else {
      collection.src = src;
    }

    return collection;
  }

  /**
   *
   * @param {Event} e
   */
  function clickHandler(e) {
    const $target = e.target;
    if (!($target instanceof HTMLElement)) return;
    const action = $target.getAttribute('action');
    const getAtr = (atr) => $target.getAttribute(atr);
    switch (action) {
      case 'open-tag':
        openTag($target.textContent, api);
        break;
      case 'wallpaper':
        openWallpaper(
          getAtr('title'),
          getAtr('image-src'),
          '',
        );
        break;

      case 'enable-search':
        $searchInput.focus();
        break;

      case 'search':
        openTag(getAtr('title'), api);
        break;

      case 'settings':
        Settings();
        break;

      case 'grant-access':
        permissions.requestPermission(
          permissionToRequest,
          ({ hasPermission: gotPermission }) => {
            if (gotPermission) {
              window.hasStoragePermission = true;
              message = null;
              addSystemWallpaper().then(render);
            }
          },
        );
        break;

      default:
        break;
    }
  }

  function render() {
    $page.content = mustache.render(page, { collections, tags });
    if (typeof message === 'function') message();
  }

  async function addSystemWallpaper() {
    const wallpapers = [];
    let src;

    src = await new Promise((resolve, reject) => {
      window.wallpaper.getWallpaper('HOME', resolve, reject);
    });
    if (src) {
      wallpapers.push({
        name: 'Home screen',
        src,
      });
    }

    src = await new Promise((resolve, reject) => {
      window.wallpaper.getWallpaper('LOCK', resolve, reject);
    });
    if (src) {
      wallpapers.push({
        name: 'Lock screen',
        src,
      });
    }

    const API = await new Promise((resolve, reject) => {
      window.wallpaper.getAPILevel(resolve, reject);
    });

    if (API < 24) wallpapers.splice(1);

    if (wallpapers.length === 1) {
      wallpapers[0].name = 'Home & Lock screen';
    }

    wallpapers.forEach((wallpaper) => {
      collections.unshift(thumbnail('wallpaper', wallpaper.name, wallpaper.src, 'Active wallpaper'));
    });
  }

  function onWallpaperChange() {
    let acc = 1;
    const regex = /^(Home|Lock)(\s&\sLock)? screen/;
    const [home, lock] = collections;
    if (home && regex.test(home.title)) collections.splice(--acc, 1);
    if (lock && regex.test(lock.title)) collections.splice(acc, 1);

    addSystemWallpaper().then(render);
  }

  function onFvoriteChange() {
    const favorites = favorite.retrive();
    if (favorites.length && !tags.includes(MY_LIKES)) {
      tags.unshift(MY_LIKES);
    } else if (!favorites.length && tags.includes(MY_LIKES)) {
      tags.splice(tags.indexOf(MY_LIKES), 1);
    }
    render();
  }
}

function openWallpaper(id, original, thumbnail) {
  CropAndAdjust({
    title: id,
    get id() {
      return this.title;
    },
    src: {
      original,
      thumbnail,
    },
  });
}

/**
   *
   * @param {String} wallpaperTag
   * @param {any} api
   */
function openTag(wallpaperTag, api) {
  const { PER_PAGE } = api;
  if (wallpaperTag === MY_LIKES) {
    Collection(MY_LIKES.capitalize(), (() => {
      let pageCount = 0;
      return (async () => {
        const start = (pageCount++) * PER_PAGE;
        return favorite.retrive().slice(start, start + PER_PAGE);
      });
    })());
    return;
  }

  if (wallpaperTag === EXPLORE) {
    Collection(EXPLORE.capitalize(), (() => {
      let pageCount = 0;
      return (async () => {
        const result = await api.all(++pageCount);
        return result;
      });
    })());
    return;
  }

  if (wallpaperTag === MY_GALLARY) {
    window.sdcard.getImage((res) => {
      CropAndAdjust({
        title: helpers.uuid(),
        get id() {
          return this.title;
        },
        src: {
          original: res,
        },
      });
    }, (err) => {
      console.error(err);
    }, 'image/*');
    return;
  }

  if (wallpaperTag === SOLID_COLORS) {
    GeneratedImage(SOLID_COLORS, 'solid-colors');
    return;
  }

  Collection(wallpaperTag.capitalize(), (() => {
    let pageCount = 0;
    return (async () => {
      const result = await api.collection(wallpaperTag, ++pageCount);
      return result;
    });
  })());
}

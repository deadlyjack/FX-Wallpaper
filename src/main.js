import '@webcomponents/custom-elements';
import 'html-tag-js/dist/polyfill';
import './icons.scss';
import './main.scss';
import './utils/polyfill';
import 'core-js/stable';
import 'blueimp-canvas-to-blob';
import tag from 'html-tag-js';
import ajax from '@deadlyjack/ajax';
import ActionStack from './lib/actionStack';
import confirm from './components/dialogs/confirm/confirm';
import config from './config';
import Home from './pages/home/home';
import Loader from './components/loader';

function main() {
  const PLATFORM = cordova.platformId;
  const pages = [];
  window.ad = {
    show() {},
    hide() {},
  };

  (async () => {
    localStorage.AdStarted = await admob.start();
    await admob.BannerAd.config({
      backgroundColor: '#212028',
    });
    window.ad = new admob.BannerAd({
      adUnitId: 'ca-app-pub-5911839694379275/1467676836', // PRODUCTION
      // adUnitId: 'ca-app-pub-3940256099942544/6300978111', // TESTING
      position: 'bottom',
    });

    ad.show();
  })();

  window.ajax = ajax;
  window.loader = Loader('#39f');

  Object.defineProperties(window, {
    actionStack: value(ActionStack()),
    ROOT: value(window.location.href.replace(/(\/index\.html)$/, '').replace(/www\/.*/, 'www')),
    PLATFORM: value(PLATFORM),
    IS_ANDROID: value(PLATFORM === 'android'),
    IS_ELECTRON: value(PLATFORM === 'electron'),
    hasStoragePermission: {
      value: false,
      writable: true,
    },
  });

  tag.get('#app').setAttribute('platform', cordova.platformId);
  if (cordova.platformId === 'android') {
    window.StatusBar.backgroundColorByHexString('#212028');
    window.NavigationBar.backgroundColorByHexString('#212028', false);
    document.addEventListener('backbutton', onBackButton);
  }
  actionStack.on('push', (action) => onPush(pages, action));
  actionStack.on('remove', (action) => onRemove(pages, action));

  Home();
}

function value(val) {
  return {
    value: val,
    writable: false,
  };
}

function closeApp() {
  if (window.beforeClose) window.beforeClose();
  navigator.app.exitApp();
}

/**
 *
 * @param {Array<HTMLDivElement>} pages
 * @param {function():void} action
 */
function onPush(pages, action) {
  if (action.type !== 'page') return;
  pages.push(...tag.getAll('.page'));
  pages.forEach(($page) => {
    if (!$page.placeHolder) $page.placeHolder = tag('span');
    if ($page.isConnected) {
      $page.scrollPos = $page.scrollTop;
      app.replaceChild($page.placeHolder, $page);
    }
  });
}

function onRemove(pages) {
  if (!pages.length) return;
  const $page = pages.splice(pages.length - 1, 1)[0];
  app.replaceChild($page, $page.placeHolder);
  $page.scrollTop = $page.scrollPos;
}

function onBackButton() {
  if (!actionStack.length) {
    if (config.confirmOnExit) {
      setTimeout(() => {
        const closeMessage = typeof window.closeMessage === 'function' ? window.getCloseMessage() : '';

        if (closeMessage) confirm('Alert', closeMessage).then(closeApp);
        else confirm('Alert', 'Exit app?').then(closeApp);
      }, 0);
    } else {
      closeApp();
    }
    return;
  }

  actionStack.pop();
}

document.addEventListener('deviceready', main, false);

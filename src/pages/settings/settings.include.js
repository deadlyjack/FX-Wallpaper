import './settings.scss';
import mustache from 'mustache';
import page from './settings.hbs';
import Page from '../../components/page/page';

export default function SettingsInclude() {
  const $page = Page('Settings', {
    id: 'l0fztroz',
    secondary: true,
  });
  let packageName;

  (async () => {
    const appInfo = await new Promise((resolve, reject) => {
      window.system.getAppInfo(resolve, reject);
    });

    packageName = appInfo.packageName;

    $page.content = mustache.render(page, {
      options: [
        option('rate', 'Feedback', 'Rate this app on playstore.', 'icon-rate_review'),
      ],
      version: appInfo.versionName,
      label: appInfo.label,
    });
  })();

  $page.addEventListener('click', clickHandler);
  $page.render();

  $page.onhide = () => {
    $page.removeEventListener('click', clickHandler);
  };

  /**
   *
   * @param {MouseEvent} e
   */
  function clickHandler(e) {
    const $target = e.target;
    if (!($target instanceof HTMLElement)) return;
    const action = $target.getAttribute('action');
    const value = $target.getAttribute('value');

    switch (action) {
      case 'rate':
        window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_SYSTEM');
        break;

      case 'open':
        window.open(value, '_SYSTEM');
        break;

      case 'email':
        window.system.sendEmail(value, '', '', () => {}, () => {});
        break;

      default:
        break;
    }
  }

  function option(action, text, subText, icon) {
    return {
      action, text, subText, icon,
    };
  }
}

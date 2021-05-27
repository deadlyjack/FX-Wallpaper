export default function Settings(...args) {
  import(/* webpackChunkName: "settings" */ './settings.include')
    .then((module) => {
      const settings = module.default;
      settings(...args);
    });
}

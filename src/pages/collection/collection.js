export default function Collection(...args) {
  import(/* webpackChunkName: "home" */ './collection.include')
    .then((module) => {
      const home = module.default;
      home(...args);
    });
}

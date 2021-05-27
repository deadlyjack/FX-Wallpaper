export default function Home(...args) {
  import(/* webpackChunkName: "home" */ './home.include')
    .then((module) => {
      const home = module.default;
      home(...args);
    });
}

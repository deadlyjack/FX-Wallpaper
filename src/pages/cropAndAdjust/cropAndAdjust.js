export default function CropAndAdjust(...args) {
  import(/* webpackChunkName: "cropAndAdjust" */ './cropAndAdjust.include')
    .then((module) => {
      const cropAndAdjust = module.default;
      cropAndAdjust(...args);
    });
}

export default Promise.all([import("pixi.js"), import("pixi-filters"), import("@pixi-essentials/svg")]).then(imports =>
  Object.assign(window, ...imports)
);

export default Promise.all([
  import("@sdk/helpers/arrays"),
  import("@sdk/helpers/objects"),
  import("@sdk/helpers/promises"),
  import("@sdk/utils/math"),
  import("@sdk/utils/promises"),
  import("@sdk/utils/range"),
  import("@sdk/utils/random"),
  import("@sdk/createRandomizedFactory"),
  import("@sdk/pixi/animations/TemporaryTweener"),
  import("@sdk-pixi/layout/arrangeInStraightLine"),
]).then(imports => Object.assign(window, ...imports));

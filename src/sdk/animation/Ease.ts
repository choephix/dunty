const { sqrt, pow, sin, cos, PI } = Math;

function Linear(x: number) {
  return x;
}

function InSine(x: number) {
  return 1 - cos((x * PI) / 2);
}

function OutSine(x: number) {
  return sin((x * PI) / 2);
}

function InOutSine(x: number) {
  return -(cos(PI * x) - 1) / 2;
}

function InQuad(x: number) {
  return x * x;
}

function OutQuad(x: number) {
  return 1 - (1 - x) * (1 - x);
}

function InOutQuad(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
}

function InCubic(x: number) {
  return x * x * x;
}

function OutCubic(x: number) {
  return 1 - pow(1 - x, 3);
}

function InOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

function InQuart(x: number) {
  return x * x * x * x;
}

function OutQuart(x: number) {
  return 1 - pow(1 - x, 4);
}

function InOutQuart(x: number) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
}

function InQuint(x: number) {
  return x * x * x * x * x;
}

function OutQuint(x: number) {
  return 1 - pow(1 - x, 5);
}

function InOutQuint(x: number) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
}

function InExpo(x: number) {
  return x === 0 ? 0 : pow(2, 10 * x - 10);
}

function OutExpo(x: number) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
}

function InOutExpo(x: number) {
  return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? pow(2, 20 * x - 10) / 2 : (2 - pow(2, -20 * x + 10)) / 2;
}

function InCirc(x: number) {
  return 1 - sqrt(1 - pow(x, 2));
}

function OutCirc(x: number) {
  return sqrt(1 - pow(x - 1, 2));
}

function InOutCirc(x: number) {
  return x < 0.5 ? (1 - sqrt(1 - pow(2 * x, 2))) / 2 : (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
}

function InBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return c3 * x * x * x - c1 * x * x;
}

function OutBack(x: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
}

function InOutBack(x: number) {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return x < 0.5
    ? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
    : (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function InElastic(x: number) {
  const c4 = (2 * Math.PI) / 3;

  return x === 0 ? 0 : x === 1 ? 1 : -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
}

function OutElastic(x: number) {
  const c4 = (2 * Math.PI) / 3;

  return x === 0 ? 0 : x === 1 ? 1 : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
}

function InOutElastic(x: number) {
  const c5 = (2 * Math.PI) / 4.5;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
    : (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function InBounce(x: number) {
  return 1 - OutBounce(1 - x);
}

function OutBounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

function InOutBounce(x: number) {
  return x < 0.5 ? (1 - OutBounce(1 - 2 * x)) / 2 : (1 + OutBounce(2 * x - 1)) / 2;
}

export const Ease = {
  Linear,
  InSine,
  OutSine,
  InOutSine,
  InQuad,
  OutQuad,
  InOutQuad,
  InCubic,
  OutCubic,
  InOutCubic,
  InQuart,
  OutQuart,
  InOutQuart,
  InQuint,
  OutQuint,
  InOutQuint,
  InExpo,
  OutExpo,
  InOutExpo,
  InCirc,
  OutCirc,
  InOutCirc,
  InBack,
  OutBack,
  InOutBack,
  InElastic,
  OutElastic,
  InOutElastic,
  InBounce,
  OutBounce,
  InOutBounce,
};

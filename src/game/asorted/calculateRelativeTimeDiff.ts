export function calculateRelativeTimeDiffFromNow(epochSeconds: number, absolute: boolean = true) {
  const nowSeconds = new Date().getTime() * 0.001;
  const diffSeconds = nowSeconds - epochSeconds;
  if (absolute) {
    return Math.abs(diffSeconds);
  } else {
    return diffSeconds;
  }
}

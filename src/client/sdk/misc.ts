export function range(n: number) {
  return new Array(n).fill(null).map((_,i) => i);
}

export function getRandomItemFrom<T>(list: Readonly<T[]>, power?: number) {
  if (power && !isNaN(power)) {
    return list[~~(Math.pow(Math.random(), power) * list.length)];
  }
  return list[~~(Math.random() * list.length)];
}

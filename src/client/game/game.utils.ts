export function shuffleArray<T>(target: T[]) {
  for (let i = target.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = target[i];
    target[i] = target[j];
    target[j] = temp;
  }
  return target;
}

export function* getRange(total = 0, step = 1, from = 0) {
  let i = from;
  while (i < total) {
    yield i;
    i += step;
  }
}

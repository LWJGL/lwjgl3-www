/*
  Python-like number range generator

  range(5)         => [0, 1, 2, 3, 4]
  range(2, 5)      => [2, 3, 4]
  range(5, 2)      => [5, 4, 3]
  range(1, 7, 2)   => [1, 3, 5]
  range(5, 2, -1)  => [5, 4, 3]
  range(7, 1, -2)  => [7, 5, 3]
  range()          => []
  range(0)         => []
  range(-5)        => []
  range(5, 5)      => []
  range(1, 5, -1)  => []
  range(5, 1, +1)  => []
*/

export function* range(a: number, b?: number, step?: number): Generator<number> {
  if (step === undefined || b === undefined) {
    if (b === undefined) {
      b = a;
      a = 0;
      step = 1;
    } else {
      step = a < b ? 1 : -1;
    }
  }

  if (a === b || step === 0) {
    return;
  }

  if (a < b) {
    if (step < 0) {
      return;
    }
    while (a < b) {
      yield a;
      a += step;
    }
  }

  if (a > b) {
    if (step > 0) {
      return;
    }
    while (a > b) {
      yield a;
      a += step;
    }
  }
}

/*
  Exclusive version

  range(5)         => [0, 1, 2, 3, 4]
  range(2, 5)      => [2, 3, 4, 5]
  range(5, 2)      => [5, 4, 3, 2]
  range(1, 7, 2)   => [1, 3, 5, 7]
  range(5, 2, -1)  => [5, 4, 3, 2]
  range(7, 1, -2)  => [7, 5, 3, 1]
  range()          => []
  range(0)         => []
  range(-5)        => []
  range(5, 5)      => []
  range(1, 5, -1)  => []
  range(5, 1, +1)  => []
*/

export function rangei(a: number, b?: number, step?: number): Generator<number> {
  // console.log(a, b, step);
  if (step === undefined || b === undefined) {
    if (b === undefined) {
      b = a;
      a = 1;
      step = 1;
    } else {
      step = a < b ? 1 : -1;
    }
  }

  return range(a, b + step, step);
}

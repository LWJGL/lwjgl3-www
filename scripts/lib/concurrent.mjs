export async function* concurrentYield(concurrency, iterable, iteratorFn) {
  const executing = new Set();

  for (const item of iterable) {
    const promise = iteratorFn(item).finally(() => {
      executing.delete(promise);
    });

    executing.add(promise);
    if (executing.size >= concurrency) {
      yield await Promise.race(executing);
    }
  }
  while (executing.size > 0) {
    yield await Promise.race(executing);
  }
}

export async function concurrentRun(concurrency, iterable, iteratorFn) {
  const iterator = iterable[Symbol.iterator]();
  const channels = [];

  for (let i = 0; i < concurrency; i += 1) {
    channels.push(
      new Promise(async resolve => {
        for (let item of iterator) {
          await iteratorFn(item);
        }
        resolve();
      }),
    );
  }

  return Promise.all(channels);
}

const map = new Map();

export function priority(name: string) {
  if (!map.has(name)) {
    map.set(name, 1);
  }

  const value = map.get(name);
  map.set(name, value + 1);
  return value;
}

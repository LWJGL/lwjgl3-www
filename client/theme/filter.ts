export type SVGInterpolatedValue = string | number;

export function filter(strings: TemplateStringsArray, ...values: SVGInterpolatedValue[]): string {
  let data = strings[0];
  for (let i = 0; i < values.length; i++) {
    data += values[i];
    data += strings[i + 1];
  }
  data = `<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter" width="3" height="3" x="-1" y="-1">${data}</filter></svg>`;
  data = btoa(data);
  return `url(data:image/svg+xml;base64,${data}#filter)`;
}

export function transform(color) {
  return color.replace(/ /g, ',');
}

// export function transformA(color) {
//   return color.replace(/ \/ /g, ',').replace(/ /g, ',').replace('hsl', 'hsla');
// }

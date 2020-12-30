export default function prettyBytes(num) {
  return `${(num / 1000).toFixed(2)} kB`;
}

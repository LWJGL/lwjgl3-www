export default function ellipsis(str, maxlength = 30) {
  return str.length > maxlength ? `${str.slice(0, maxlength)}…` : str;
}

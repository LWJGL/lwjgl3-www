export default function ellipsis(str, maxlength = 30) {
  return str.length > maxlength ? `${str.substr(0, maxlength)}…` : str;
}

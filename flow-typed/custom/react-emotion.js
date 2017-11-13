declare module 'react-emotion' {
  declare type StyledOptions = { [string]: ?string };
  declare export default (tag: string, options: ?StyledOptions) => (css: Array<string>) => React$ElementType
}

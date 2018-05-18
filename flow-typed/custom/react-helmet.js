declare module 'react-helmet' {
  declare type HelmetProps = {
    encodeSpecialCharacters?: boolean,
    titleTemplate?: string,
    defaultTitle?: string,
    onChangeClientState?: (newState: {}) => void,
    children?: React.ChildrenArray<
      | React.Element<'html'>
      | React.Element<'body'>
      | React.Element<'title'>
      | React.Element<'base'>
      | React.Element<'meta'>
      | React.Element<'link'>
      | React.Element<'script'>
      | React.Element<'noscript'>
      | React.Element<'style'>
    >,
  };

  declare export default Class<React.ComponentType<HelmetProps>>;
}

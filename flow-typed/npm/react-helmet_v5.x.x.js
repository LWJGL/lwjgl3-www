declare module 'react-helmet' {
  declare export default class Helmet extends React$Component {
    props: {
      titleTemplate?: string,
      defaultTitle?: string,
    },
  }
}

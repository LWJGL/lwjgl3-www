declare module 'react-loadable' {
  declare export type LoadingComponentProps = {
    isLoading: boolean,
    timedOut: boolean,
    pastDelay: boolean,
    error: Error | null,
  };

  declare export type PromiseReactComponent = <Props: {}>() => Promise<LoadedComponent<Props>>;

  declare type GenericComponent<Props> = Class<React$Component<any, Props, any>>;
  declare type LoadedComponent<Props> = GenericComponent<Props>;
  declare type LoadingComponent = GenericComponent<LoadingComponentProps>;

  declare type Options = {
    loader: PromiseReactComponent,
    loading: LoadingComponent | ReactClass<any>,
    render?: <Props: {}>(
      loaded: React$Component<any, Props, any>,
      props: Props
    ) => Class<React$Component<any, Props, any>>,
    delay?: number,
    timeout?: number,
  };

  declare export default <Props: {}, Err: Error>(opts: Options) => Class<React$Component<any, Props, any>>;
}

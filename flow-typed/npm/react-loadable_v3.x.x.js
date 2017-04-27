declare module 'react-loadable' {
  declare export type LoadingComponentProps = {
    isLoading: boolean,
    pastDelay: boolean,
    error: Error | null,
  }

  declare export type PromiseReactComponent = <Props: {}>() => Promise<LoadedComponent<Props>>;

  declare type GenericComponent<Props> = Class<React$Component<any, Props, any>>;
  declare type LoadedComponent<Props> = GenericComponent<Props>;
  declare type LoadingComponent = GenericComponent<LoadingComponentProps>;

  declare type Options = {
    loader: PromiseReactComponent,
    LoadingComponent: LoadingComponent | ReactClass<any>,
    delay?: number,
    serverSideRequirePath?: string,
    webpackRequireWeakId?: () => number,
    resolveModule?: <Props: {}>(obj: Object) => LoadedComponent<Props>,
  };

  declare export default <Props: {}, Err: Error>(opts: Options) => Class<React$Component<any, Props, any>>
}

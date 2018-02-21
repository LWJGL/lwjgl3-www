declare type Provider<T> = React.Component<{
  value: T,
  children?: React.Node,
}>;

declare type Consumer<T> = React.Component<{
  children: (value: T) => React.Node,
}>;

declare type Context<T> = {
  Provider: Provider<T>,
  Consumer: Consumer<T>,
};

declare module 'react-hot-loader' {
  declare export function setConfig(config: { logLevel: string }): void;
  declare export var hot: React.ComponentType<{}>;
}

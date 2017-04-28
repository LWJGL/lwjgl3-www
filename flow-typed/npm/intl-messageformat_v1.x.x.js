// flow-typed signature: 9ee002d3ad4550b5b7da775c6ba6c5e2
// flow-typed version: 0bcfb6b09b/intl-messageformat_v1.x.x/flow_>=v0.32.x

declare module 'intl-messageformat' {
  declare type FormatsObject = {
    [type: string]: {
      [style: string]: {
        [options: string]: string
      }
    }
  };

  declare class IntlMessageFormat {
    constructor(message: string, locales: string | Array<string>, formats?: ?FormatsObject): IntlMessageFormat;

    /**
     * This method returns an object with the options values that were resolved during instance creation. It currently only contains a locale property.
     */
    resolvedOptions(): {| locale: string |};

    /**
     * Once the message is created, formatting the message is done by calling the format() method on the instance and passing a collection of values.
     */
    format(values: { [key: string]: any }): string;
  }

  declare module.exports: Class<IntlMessageFormat>;
}

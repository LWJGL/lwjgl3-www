declare module 'create-subscription' {
  declare type Unsubscribe = () => void;

  declare export function createSubscription<Property, Value>(
    config: $ReadOnly<{|
      // Synchronously gets the value for the subscribed property.
      // Return undefined if the subscribable value is undefined,
      // Or does not support synchronous reading (e.g. native Promise).
      getCurrentValue: (source: Property) => Value | void,

      // Setup a subscription for the subscribable value in props, and return an unsubscribe function.
      // Return false to indicate the property cannot be unsubscribed from (e.g. native Promises).
      // Due to the variety of change event types, subscribers should provide their own handlers.
      // Those handlers should not attempt to update state though;
      // They should call the callback() instead when a subscription changes.
      subscribe: (source: Property, callback: (value: Value | void) => void) => Unsubscribe,
    |}>
  ): React.ComponentType<{
    children: (value: Value | void) => React$Node,
    source: Property,
  }>;
}

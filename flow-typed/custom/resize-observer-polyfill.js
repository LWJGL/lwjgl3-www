declare module 'resize-observer-polyfill' {
  declare export type Entry = {
    +target: Element,
    +contentRect: DOMRectReadOnly,
  };

  declare export type ResizeObserverCallback = (entries: $ReadOnlyArray<Entry>, observer: ResizeObserver) => void;

  declare class ResizeObserver {
    constructor(entries: ResizeObserverCallback): void;
    disconnect(): void;
    observe(target: Element): void;
    unobserve(target: Element): void;
  }

  declare export default Class<ResizeObserver>;
}

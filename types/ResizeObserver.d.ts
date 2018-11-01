interface Window {
  ResizeObserver: ResizeObserver;
}

interface ResizeObserver {
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
  disconnect: () => void;
}

declare var ResizeObserver: {
  prototype: ResizeObserver;
  new (callback: ResizeObserverCallback): ResizeObserver;
};

interface ResizeObserverCallback {
  (entries: Array<ResizeObserverEntry>, observer: ResizeObserver): void;
}

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
}

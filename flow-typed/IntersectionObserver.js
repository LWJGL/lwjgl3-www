// TODO: Remove this when IntersectionObserver definition is fixed
// https://github.com/facebook/flow/pull/4664
declare class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverOptions): IntersectionObserver;
  observe(target: HTMLElement): void;
  unobserve(target: HTMLElement): void;
  takeRecords(): Array<IntersectionObserverEntry>;
  disconnect(): void;
}

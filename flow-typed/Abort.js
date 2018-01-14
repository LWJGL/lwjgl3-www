declare class AbortSignal {
  +aborted: boolean;
  onabort: Event;
}

declare class AbortController {
  constructor(): AbortController;
  signal: AbortSignal;
  abort(): void;
}

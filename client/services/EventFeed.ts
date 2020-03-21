interface Callback {
  (cb: Function): void;
}

// Single listener, multiple handler dispatching
export class EventFeed {
  register: Callback;
  unregister: Callback;

  constructor(register: Callback, unregister: Callback) {
    this.register = register;
    this.unregister = unregister;
  }

  subscribers: Array<Function> = [];

  handle(...args: Array<any>) {
    this.subscribers.forEach((listener) => {
      listener(...args);
    });
  }

  add(listener: Function) {
    this.subscribers.push(listener);
    if (this.subscribers.length === 1) {
      this.register(this.handle);
    }
  }

  remove(listener: Function) {
    const index = this.subscribers.indexOf(listener);
    this.subscribers.splice(index, 1);

    if (this.subscribers.length === 0) {
      this.unregister(this.handle);
    }
  }
}

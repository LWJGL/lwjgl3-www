import { unstable_scheduleCallback as scheduleCallback } from 'scheduler';

interface Entry<T> {
  value: T;
  onDelete: (() => any) | null;
  previous: Entry<T> | null;
  next: Entry<T> | null;
}

export function createLRU<T>(limit: number) {
  let LIMIT = limit;

  // Circular, doubly-linked list
  let first: Entry<T> | null = null;
  let size: number = 0;

  let cleanUpIsScheduled: boolean = false;

  function scheduleCleanUp() {
    if (cleanUpIsScheduled === false && size > LIMIT) {
      // The cache size exceeds the limit. Schedule a callback to delete the
      // least recently used entries.
      cleanUpIsScheduled = true;
      scheduleCallback(cleanUp);
    }
  }

  function cleanUp() {
    cleanUpIsScheduled = false;
    deleteLeastRecentlyUsedEntries(LIMIT);
  }

  function deleteLeastRecentlyUsedEntries(targetSize: number) {
    // Delete entries from the cache, starting from the end of the list.
    if (first !== null) {
      const resolvedFirst: Entry<T> = first;
      let last = resolvedFirst.previous;
      while (size > targetSize && last !== null) {
        const onDelete = last.onDelete;
        const previous = last.previous;
        last.onDelete = null;

        // Remove from the list
        last.previous = last.next = null;
        if (last === first) {
          // Reached the head of the list.
          first = last = null;
        } else {
          (first as Entry<T>).previous = previous;
          (previous as Entry<T>).next = first;
          last = previous;
        }

        size -= 1;

        // Call the destroy method after removing the entry from the list. If it
        // throws, the rest of cache will not be deleted, but it will be in a
        // valid state.
        (onDelete as () => any)();
      }
    }
  }

  function add(value: T, onDelete: () => any): Entry<T> {
    const entry: Entry<T> = {
      value,
      onDelete,
      next: null,
      previous: null,
    };
    if (first === null) {
      entry.previous = entry.next = entry;
      first = entry;
    } else {
      // Append to head
      const last = first.previous;
      (last as Entry<T>).next = entry;
      entry.previous = last;

      first.previous = entry;
      entry.next = first;

      first = entry;
    }
    size += 1;
    return entry;
  }

  function update(entry: Entry<T>, newValue: T): void {
    entry.value = newValue;
  }

  function access(entry: Entry<T>): T {
    const next = entry.next;
    if (next !== null) {
      // Entry already cached
      const resolvedFirst = first as Entry<T>;
      if (first !== entry) {
        // Remove from current position
        const previous = entry.previous;
        (previous as Entry<T>).next = next;
        next.previous = previous;

        // Append to head
        const last = resolvedFirst.previous;
        (last as Entry<T>).next = entry;
        entry.previous = last;

        resolvedFirst.previous = entry;
        entry.next = resolvedFirst;

        first = entry;
      }
    } else {
      // Cannot access a deleted entry
    }
    scheduleCleanUp();
    return entry.value;
  }

  function setLimit(newLimit: number) {
    LIMIT = newLimit;
    scheduleCleanUp();
  }

  return {
    add,
    update,
    access,
    setLimit,
  };
}

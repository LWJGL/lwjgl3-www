/* Returns React children into an array, flattening fragments. */
import { Children, isValidElement, cloneElement } from 'react';
import { isFragment } from 'react-is';
import type { ReactNode, ReactChild } from 'react';

export function flattenChildren(children: ReactNode, keys: (string | number)[] = []): ReactChild[] {
  const result = Children.toArray(children).reduce((acc: ReactChild[], node, nodeIndex) => {
    if (isFragment(node)) {
      acc.push.apply(acc, flattenChildren(node.props.children, keys.concat(node.key || nodeIndex)));
    } else {
      if (isValidElement(node)) {
        acc.push(
          cloneElement(node, {
            key: keys.concat(String(node.key)).join('.'),
          })
        );
      } else if (typeof node === 'string' || typeof node === 'number') {
        acc.push(node);
      }
    }

    return acc;
  }, []);

  return result;
}

/**
 * Concats strings or object with boolean keys and returns a class value
 *
 * Examples:
 *  cc('fa', 'fa-check') => "fa fa-check"
 *  cc('fa', {'fa-check':true, 'fa-spin':isSpinning}) => "fa fa-check fa-spin"
 *  cc(...['fa','fa-check'], 'fa-spin', {'bg-danger':true}) => "fa fa-check fa-spin bg-danger"
 *  cc(['fa', 'fa-check']) => "fa fa-check"
 *  cc('fa', ['fa-check', {'bg-danger':true}]) => "fa fa-check bg-danger"
 */

type Classnames = string | null | void | boolean | { [classname: string]: boolean };

export function cc(...args: Array<Classnames | Classnames[]>): string {
  let result = '';

  loop: for (let i = 0; i < args.length; i += 1) {
    let obj = args[i];
    if (obj == null) {
      continue;
    }

    let toAdd: string | null = null;
    switch (typeof obj) {
      case 'boolean':
        continue loop;
      case 'string':
        toAdd = obj;
        break;
      case 'object':
        if (Array.isArray(obj)) {
          if (obj.length) {
            toAdd = cc.apply(null, obj);
          }
        } else {
          toAdd = '';
          for (const key in obj) {
            if (obj[key] === true) {
              if (toAdd.length > 0) {
                toAdd += ' ';
              }
              toAdd += key;
            }
          }
        }
        break;
    }

    if (toAdd !== null && toAdd.length > 0) {
      if (result.length > 0) {
        result += ' ';
      }
      result += toAdd;
    }
  }

  return result;
}

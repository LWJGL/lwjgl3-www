/**
 * Concats strings or object with boolean keys and returns a class value
 * This function is more than 2x faster than https://github.com/JedWatson/classnames
 * with the difference that we don't flatten arrays and ignore number values.
 *
 * To flatten an array destructure at the call, e.g.: cc(...arr)
 *
 * Examples:
 *  cc('fa', 'fa-check') => "fa fa-check"
 *  cc('fa' {'fa-check':true,'fa-spin':isSpinning}) => "fa fa-check fa-spin"
 *  cc(...['fa','fa-check'], 'fa-spin', {'bg-danger':hasError}) => "fa fa-check fa-spin bg-danger"
 * @param {*} args
 */
function classConcat(...args: Array<string | null | void | { [classname: string]: boolean }>): string {
  let result = '';

  for (let i = 0; i < args.length; i += 1) {
    let obj = args[i];
    if (obj != null) {
      if (typeof obj === 'string') {
        result += (result && ' ') + obj;
      } else if (typeof obj === 'object') {
        for (let key in obj) {
          if (obj.hasOwnProperty(key) && obj[key] === true) {
            result += (result && ' ') + key;
          }
        }
      }
    }
  }

  return result;
}

export { classConcat as cc };

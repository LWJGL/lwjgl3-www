// Use this connect to enable HMR on react-redux connected components
import { connect as _connect } from 'react-redux';

export function connect(...args: any) {
  switch (args.length) {
    case 1:
      return _connect.call(null, args[0], null, null, { pure: false });
    case 2:
      return _connect.call(null, args[0], args[1], null, { pure: false });
    case 3:
      return _connect.call(null, args[0], args[1], args[2], { pure: false });
    case 4:
      return _connect.apply(null, args);
  }
}

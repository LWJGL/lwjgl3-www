import React from 'react';
import { connect } from 'react-redux';
import reducer, { actions as $$ } from './reducer';
import saga from './saga';
import ControlledPanel from '../../../components/ControlledPanel';
import Browser from './components/Browser';
import subscribe from '../../../store/subscribe';

const SCOPE = 'browser';

function isClosed(state) {
  return state[SCOPE].open === false;
}

function isBrowsing(state) {
  return state[SCOPE].open;
}

@subscribe
@connect(null, { browserOpen: $$.browserOpen })
class FileBrowser extends React.Component {
  static reducers = {
    [SCOPE]: reducer,
  };

  static sagas = [saga];

  // constructor(props) {
  //   super(props);
  //   if ( process.env.NODE_ENV !== 'production' && module.hot ) {
  //     module.hot.accept('./reducer', () => {
  //       props.reload(SCOPE, reducer);
  //     });
  //   }
  // }

  browse = () => {
    this.props.browserOpen();
  };

  render() {
    return [
      <ControlledPanel predicate={isClosed}>
        <button className="btn btn-outline-primary" onClick={this.browse}>Click to browse…</button>
      </ControlledPanel>,
      <ControlledPanel predicate={isBrowsing}>
        <Browser />
      </ControlledPanel>,
    ];
  }
}

export default FileBrowser;

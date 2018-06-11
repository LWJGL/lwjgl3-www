// @flow
import * as React from 'react';
//$FlowFixMe
import { ToastContainer, toast } from 'react-toastify';

type Props = {
  update: () => void,
};

const Msg = ({ onClick, closeToast }) => (
  <div className="d-flex justify-content-between">
    <button className="btn btn-success btn-sm mr-1 flex-grow-1" onClick={onClick}>
      Update to latest version
    </button>
    <button className="btn btn-outline-dark btn-sm" onClick={closeToast}>
      Close
    </button>
  </div>
);

class ServiceWorkerNotification extends React.Component<Props, void> {
  componentDidMount() {
    toast(<Msg onClick={this.props.update} />);
  }

  render() {
    return <ToastContainer autoClose={8000} closeButton={false} />;
  }
}

export default ServiceWorkerNotification;

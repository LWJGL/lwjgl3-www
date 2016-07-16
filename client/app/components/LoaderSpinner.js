import React from 'react'

export default class LoaderSpinner extends React.Component {

  render() {
    return (
      <svg className="loader-spinner" viewBox="0 0 32 32" width={this.props.size} height={this.props.size} style={this.props.style}>
        <circle cx={16} cy={16} r={14} fill="none"></circle>
      </svg>
    )
  }

};
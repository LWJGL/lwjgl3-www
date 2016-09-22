import React from 'react'

class Preserver {

  html = null;

  has() {
    return null !== this.html;
  }

  render() {
    const result = (
      <div dangerouslySetInnerHTML={{__html: this.html}} />
    );
    this.html = null;
    return result;
  }

  store(html) {
    this.html = html;
  }

}

export default new Preserver()
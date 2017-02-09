export default (styles) => (StyledComponent) => {
  // We are forced to use cWM because we need styles available before initial render()
  const componentWillMount = StyledComponent.prototype.componentWillMount;
  const componentWillUnmount = StyledComponent.prototype.componentWillUnmount;

  // We need a counter because with Fiber cWM may be called multiple times
  StyledComponent.prototype.count = 0;

  StyledComponent.prototype.componentWillMount = function() {
    this.count += 1;
    if ( this.count === 1 ) {
      styles.use();
    }
    if ( componentWillMount ) {
      componentWillMount.call(this)
    }
  };

  StyledComponent.prototype.componentWillUnmount = function() {
    styles.unuse();
    this.count = 0;
    if ( componentWillUnmount ) {
      componentWillUnmount.call(this)
    }
  };

  return StyledComponent;
}

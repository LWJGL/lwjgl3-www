class Env {

  mobile = false;
  tablet = false;
  desktop = true;

  constructor() {
    if ( process.browser ) {
      if ( document.body.classList.contains('tablet') ) {
        this.mobile = true;
        this.tablet = true;
        this.desktop = false;
      } else if ( document.body.classList.contains('mobile') ) {
        this.mobile = true;
        this.desktop = false;
      }
    }
  }

}

export default new Env();

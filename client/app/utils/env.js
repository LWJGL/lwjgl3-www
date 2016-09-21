class Env {

  mobile = false;
  tablet = false;
  desktop = true;

  constructor() {
    if ( process.browser ) {
      if ( document.body.classList.contains('tablet') ) {
        this.setTablet();
      } else if ( document.body.classList.contains('mobile') ) {
        this.setMobile();
      }
    }
  }

  setMobile() {
    this.mobile = true;
    this.tablet = false;
    this.desktop = false;
  }

  setTablet() {
    this.mobile = true;
    this.tablet = true;
    this.desktop = false;
  }

}

export default new Env();
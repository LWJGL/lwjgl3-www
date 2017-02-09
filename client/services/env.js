const Env = {
  mobile: false,
  tablet: false,
  desktop: true,
};

export const detect = () => {
  if ( document.body.classList.contains('tablet') ) {
    Env.mobile = true;
    Env.tablet = true;
    Env.desktop = false;
  } else if ( document.body.classList.contains('mobile') ) {
    Env.mobile = true;
    Env.tablet = false;
    Env.desktop = false;
  } else {
    Env.mobile = false;
    Env.tablet = false;
    Env.desktop = true;
  }
};

export default Env;

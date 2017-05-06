import React from 'react';

const scrollTopTop = (e: SyntheticEvent): boolean => {
  e.preventDefault();
  window.scroll(0, 0);
  return false;
};

const BackToTop = () => <p className="text-center"><a href="#" onClick={scrollTopTop}>top &nbsp; ▲</a></p>;

export default BackToTop;

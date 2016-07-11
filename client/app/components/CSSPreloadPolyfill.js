import { loadCSS } from 'fg-loadcss'

const w = window;

function supported() {
  try {
    return w.document.createElement('link').relList.supports('preload');
  } catch (e) {
  }
  return false;
}

if ( !supported() ) {
  // loop preload links and fetch using loadCSS
  const links = w.document.getElementsByTagName('link');
  for( let i = 0; i < links.length; i+=1 ){
    let link = links[i];
    if ( link.rel === "preload" && link.getAttribute('as') === 'style' ){
      loadCSS(link.href, link);
      link.rel = null;
    }
  }
}

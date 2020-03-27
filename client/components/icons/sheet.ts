let defs: SVGDefsElement | null = null;

export const register = (src: string) => {
  if (defs === null) {
    defs = document.querySelector('#iconsheet defs');
  }
  //@ts-ignore
  defs.insertAdjacentHTML('beforeend', src);
};

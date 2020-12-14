let defs: SVGDefsElement | null = null;

function getNode(element: string): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', element);
}

function createDefs(): SVGDefsElement {
  let svg = getNode('svg');
  let style = getNode('style');
  let defs = getNode('defs') as SVGDefsElement;

  svg.style.height = '0px';

  style.innerHTML = `path {
  opacity: var(--icon-primary-opacity, 1);
  fill: currentColor;
  fill: var(--icon-primary, currentColor);
}
path.s {
  opacity: 0.4;
  opacity: var(--icon-secondary-opacity, 0.4);
  fill: var(--icon-secondary, currentColor);
}`;

  svg.appendChild(style);
  svg.appendChild(defs);
  document.body.appendChild(svg);

  return defs;
}

export function register(src: string): void {
  if (defs === null) {
    defs = createDefs();
  }

  defs.insertAdjacentHTML('beforeend', src);
}

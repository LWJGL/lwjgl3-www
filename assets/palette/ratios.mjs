import chroma from 'chroma-js';

const hues = buildHueMap(tailwind);

function buildHueMap(palette) {
  const hues = [];
  Object.entries(palette).forEach(([color, colors]) => {
    let hue = chroma(colors['600']).hsl()[0];
    if (isNaN(hue)) {
      // skip true gray
      return;
    }
    hues.push({
      color,
      hue,
    });
  });

  hues.sort((a, b) => {
    if (a.hue > b.hue) {
      return 1;
    } else if (a.hue < b.hue) {
      return -1;
    }
    return 0;
  });

  return hues;
}

function computeContrastRatios(colors) {
  return colors.map(hex => chroma.contrast(hex, '#fefefe'));
}

export function findOptimalRatios(hex) {
  const color = chroma(hex);
  const hue = color.hsl()[0];

  if (isNaN(hue)) {
    return computeContrastRatios(Object.values(tailwind.trueGray));
  }

  // Find closest hue
  for (let i = 0; i < hues.length; i += 1) {
    let a = hues[i];
    let hueA = a.hue;
    let b;
    let hueB;

    if (i < hues.length - 1) {
      b = hues[i + 1];
      hueB = b.hue;
    } else {
      b = hues[0];
      hueB = b.hue + 360;
    }

    if (hue >= hueA && hue <= hueB) {
      const distance = hueB - hueA;
      const pos = hue - hueA;
      const weightA = (distance - pos) / distance;
      const weightB = 1 - weightA;

      // console.log(hex, a.color, `${weightA.toFixed(2)}%`, b.color, `${weightB.toFixed(2)}%`);

      const ratiosA = computeContrastRatios(Object.values(tailwind[a.color]));
      const ratiosB = computeContrastRatios(Object.values(tailwind[b.color]));

      return ratiosA.map((ratio, i) => ratio * weightA + ratiosB[i] * weightB);
    }
  }
}

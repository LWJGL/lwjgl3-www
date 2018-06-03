// @flow
import { Hsl } from './Hsl';

export function hsl(hue: number, saturation: number, lightness: number, alpha?: number) {
  return new Hsl(hue, saturation, lightness, alpha);
}

/*
  TODO:
    If the following TC39 proposals are accepted (and Flow adds support):
      https://github.com/rbuckton/proposal-partial-application
      https://github.com/tc39/proposal-pipeline-operator

    We can refactor color functions calls as follows:
      const COLOR_LIGHT = COLOR
        |> setLightness(97, ?)
        |> rotateHue(15, ?)

    Similarly, in css-in-js like so:
      css`
        background-color: ${COLOR |> rotateHue(15, ?) |> toCss}
      `

  TODO: Add more functions from https://polished.js.org/docs/
*/

export function setHue(color: Hsl, value: number) {
  if (!FLAG_PRODUCTION) {
    if (value < 0 || value > 360) {
      throw new Error(`Invalid hue (0-360): ${value}`);
    }
  }

  return new Hsl(value, color.saturation, color.lightness, color.alpha);
}

export function setSaturation(color: Hsl, value: number) {
  if (!FLAG_PRODUCTION) {
    if (value < 0 || value > 100) {
      throw new Error(`Invalid saturation (0-100): ${value}`);
    }
  }

  return new Hsl(color.hue, value, color.lightness, color.alpha);
}

export function setLightness(color: Hsl, value: number) {
  if (!FLAG_PRODUCTION) {
    if (value < 0 || value > 100) {
      throw new Error(`Invalid lightness (0-100): ${value}`);
    }
  }

  return new Hsl(color.hue, color.saturation, value, color.alpha);
}

export function setAlpha(color: Hsl, value: number) {
  if (!FLAG_PRODUCTION) {
    if (value < 0 || value > 1) {
      throw new Error(`Invalid alpha (0.0-1.0): ${value}`);
    }
  }

  return new Hsl(color.hue, color.saturation, color.lightness, value);
}

export function rotate(color: Hsl, degrees: number) {
  let hue = color.hue + degrees;
  if (hue > 360) {
    hue = hue % 360;
  } else if (hue < 0) {
    hue = 360 + (hue % -360);
  }
  return setHue(color, hue);
}

export function saturate(color: Hsl, value: number) {
  let saturation = color.saturation + value;
  if (saturation > 100) {
    saturation = 100;
  } else if (saturation < 0) {
    saturation = 0;
  }

  return setSaturation(color, saturation);
}

export const desaturate = (color: Hsl, value: number) => saturate(color, -value);

export function lighten(color: Hsl, value: number) {
  let lightness = color.lightness + value;
  if (lightness > 100) {
    lightness = 100;
  } else if (lightness < 0) {
    lightness = 0;
  }
  return setLightness(color, lightness);
}

export const darken = (color: Hsl, value: number) => lighten(color, -value);

export function fade(color: Hsl, value: number) {
  let alpha = color.alpha + value;
  if (alpha > 1) {
    alpha = 1;
  } else if (alpha < 0) {
    alpha = 0;
  }

  return setAlpha(color, alpha);
}

export function mix(color: Hsl, mix: Hsl, weight: number = 0.5) {
  const mixChannels = toRGB(mix);
  return setAlpha(
    fromRGB(toRGB(color).map((channelA, i) => Math.round(mixChannels[i] + (channelA - mixChannels[i]) * weight))),
    mix.alpha + (mix.alpha - color.alpha) * weight
  );
}

export function toRGB(color: Hsl) {
  const h = color.hue / 360;
  const s = color.saturation / 100;
  const l = color.lightness / 100;
  let val: number;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  let t2;

  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }

  const t1 = 2 * l - t2;
  const rgb = [0, 0, 0];

  for (let i = 0; i < 3; i += 1) {
    let t3 = h + (1 / 3) * -(i - 1);
    if (t3 < 0) {
      t3++;
    }
    if (t3 > 1) {
      t3--;
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }

    rgb[i] = val * 255;
  }

  return rgb;
}

export function fromRGB(rgb: Array<number>) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0;
  let s;
  const l = (min + max) / 2;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return new Hsl(h, s * 100, l * 100);
}

export function getBrightness(color: Hsl) {
  const [red, blue, green] = toRGB(color);
  return (red * 299 + blue * 587 + green * 114) / 1000;
}

export function isDark(color: Hsl) {
  return getBrightness(color) < 128;
}

export const isLight = (color: Hsl) => !isDark(color);

export function getLuminance(color: Hsl) {
  //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  const [red, blue, green] = toRGB(color);
  const RsRGB = red / 255;
  const GsRGB = blue / 255;
  const BsRGB = green / 255;

  let R, G, B;

  if (RsRGB <= 0.03928) {
    R = RsRGB / 12.92;
  } else {
    R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
  }

  if (GsRGB <= 0.03928) {
    G = GsRGB / 12.92;
  } else {
    G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
  }

  if (BsRGB <= 0.03928) {
    B = BsRGB / 12.92;
  } else {
    B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
  }

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

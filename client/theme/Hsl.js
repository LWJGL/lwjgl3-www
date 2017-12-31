// @flow
export class Hsl {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  constructor(hue: number, saturation: number, lightness: number, alpha: number = 1) {
    if (process.env.NODE_ENV !== 'production') {
      if (hue < 0 || hue > 360) {
        throw new Error(`Invalid hue (0-360): ${hue}`);
      }
      if (saturation < 0 || saturation > 100) {
        throw new Error(`Invalid saturation (0-100): ${saturation}`);
      }
      if (lightness < 0 || lightness > 100) {
        throw new Error(`Invalid lightness (0-100): ${lightness}`);
      }
      if (alpha < 0 || alpha > 1) {
        throw new Error(`Invalid alpha (0.0-1.0): ${alpha}`);
      }
    }

    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.alpha = alpha;
  }

  h(value: number) {
    if (process.env.NODE_ENV !== 'production') {
      if (value < 0 || value > 360) {
        throw new Error(`Invalid hue (0-360): ${value}`);
      }
    }

    return new Hsl(value, this.saturation, this.lightness, this.alpha);
  }

  s(value: number) {
    if (process.env.NODE_ENV !== 'production') {
      if (value < 0 || value > 100) {
        throw new Error(`Invalid saturation (0-100): ${value}`);
      }
    }

    return new Hsl(this.hue, value, this.lightness, this.alpha);
  }

  l(value: number) {
    if (process.env.NODE_ENV !== 'production') {
      if (value < 0 || value > 100) {
        throw new Error(`Invalid lightness (0-100): ${value}`);
      }
    }

    return new Hsl(this.hue, this.saturation, value, this.alpha);
  }

  a(value: number) {
    if (process.env.NODE_ENV !== 'production') {
      if (value < 0 || value > 1) {
        throw new Error(`Invalid alpha (0.0-1.0): ${value}`);
      }
    }

    return new Hsl(this.hue, this.saturation, this.lightness, value);
  }

  rotate(degrees: number) {
    let hue = this.hue + degrees;
    if (hue > 360) {
      hue = hue % 360;
    } else if (hue < 0) {
      hue = 360 + hue % -360;
    }
    return this.h(hue);
  }

  saturate(value: number) {
    let saturation = this.saturation + value;
    if (saturation > 100) {
      saturation = 100;
    } else if (saturation < 0) {
      saturation = 0;
    }

    return this.s(saturation);
  }

  desaturate(value: number) {
    return this.saturate(-value);
  }

  lighten(value: number) {
    let lightness = this.lightness + value;
    if (lightness > 100) {
      lightness = 100;
    } else if (lightness < 0) {
      lightness = 0;
    }
    return this.l(lightness);
  }

  darken(value: number) {
    return this.lighten(-value);
  }

  fade(value: number) {
    let alpha = this.alpha + value;
    if (alpha > 1) {
      alpha = 1;
    } else if (alpha < 0) {
      alpha = 0;
    }

    return this.a(alpha);
  }

  mix(color: Hsl, weight: number = 0.5) {
    let a = this.toRGB();
    let b = color.toRGB();

    for (let i = 0; i < 3; i += 1) {
      a[i] = Math.round(b[i] + (a[i] - b[i]) * weight);
    }

    return this.fromRGB(a).a(color.alpha + (this.alpha - color.alpha) * weight);
  }

  toRGB() {
    const h = this.hue / 360;
    const s = this.saturation / 100;
    const l = this.lightness / 100;
    let val;

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
      let t3 = h + 1 / 3 * -(i - 1);
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

  fromRGB(rgb: [number, number, number]) {
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

  css() {
    return this.alpha < 1.0
      ? `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
      : `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }
}

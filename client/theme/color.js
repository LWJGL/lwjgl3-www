// @flow
export class Hsl {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  constructor(hue: number, saturation: number, lightness: number, alpha: number) {
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

  hsl() {
    return this.alpha < 1.0
      ? `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
      : `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }
}

export const hsl = (hue: number = 0, saturation: number = 100, lightness: number = 50, alpha: number = 1): Hsl =>
  new Hsl(hue, saturation, lightness, alpha);

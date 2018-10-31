export class Hsl {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  constructor(hue: number, saturation: number, lightness: number, alpha: number = 1) {
    if (!FLAG_PRODUCTION) {
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

  css() {
    return this.alpha < 1.0
      ? `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
      : `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }
}

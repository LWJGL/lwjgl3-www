import { Hsl } from '~/theme/color';
type Tone = Readonly<[Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl]>;

export const BG = new Hsl(180, 33.33, 99.41);
export const TEXT = new Hsl(211.3, 25.84, 17.45);

export const PRIMARY: Tone = [
  new Hsl(210, 50, 97.65),
  new Hsl(215.29, 48.57, 93.14),
  new Hsl(215.63, 47.06, 86.67),
  new Hsl(212.54, 47.2, 75.49),
  new Hsl(211.76, 47.49, 64.9),
  new Hsl(208.76, 49.39, 51.96),
  new Hsl(208, 33.33, 44.12),
  new Hsl(207.93, 32.22, 35.29),
  new Hsl(209.23, 29.32, 26.08),
  new Hsl(208.89, 27.27, 19.41),
];

export const NEUTRAL: Tone = [
  new Hsl(210, 14.29, 97.25),
  new Hsl(216, 12.82, 92.35),
  new Hsl(213.33, 12, 85.29),
  new Hsl(220, 11.45, 74.31),
  new Hsl(219, 10.87, 63.92),
  new Hsl(220, 8.64, 52.35),
  new Hsl(220, 9.17, 44.9),
  new Hsl(217.5, 13.04, 36.08),
  new Hsl(216, 17.99, 27.25),
  new Hsl(215, 23.53, 20),
];

export const CRITICAL: Tone = [
  new Hsl(0, 77.78, 98.24),
  new Hsl(0, 92.59, 94.71),
  new Hsl(0, 96.08, 90),
  new Hsl(0, 93.62, 81.57),
  new Hsl(0.46, 91.55, 72.16),
  new Hsl(0, 82.61, 59.41),
  new Hsl(0, 71.2, 49.02),
  new Hsl(0, 72.28, 39.61),
  new Hsl(0, 62.34, 30.2),
  new Hsl(2.65, 59.65, 22.35),
];

export const CAUTION: Tone = [
  new Hsl(54.55, 95.65, 90.98),
  new Hsl(52.03, 98.46, 74.51),
  new Hsl(48.71, 97.12, 59.22),
  new Hsl(45.4, 93.39, 47.45),
  new Hsl(41.85, 95.35, 42.16),
  new Hsl(38.28, 93.55, 36.47),
  new Hsl(35.36, 90.42, 32.75),
  new Hsl(31.03, 79.45, 28.63),
  new Hsl(27.75, 68.97, 22.75),
  new Hsl(28.36, 63.22, 17.06),
];

export const POSITIVE: Tone = [
  new Hsl(137.65, 80.95, 95.88),
  new Hsl(141.43, 80, 86.27),
  new Hsl(142.08, 75.71, 72.55),
  new Hsl(141.32, 64.41, 53.73),
  new Hsl(142.06, 72.77, 41.76),
  new Hsl(142.03, 74.42, 33.73),
  new Hsl(142.64, 71.62, 29.02),
  new Hsl(142.78, 64.23, 24.12),
  new Hsl(142.5, 58.33, 18.82),
  new Hsl(140, 47.37, 14.9),
];

export const INFO: Tone = [
  new Hsl(226.67, 100, 98.24),
  new Hsl(226.15, 100, 94.9),
  new Hsl(227.5, 96, 90.2),
  new Hsl(229.16, 93.26, 82.55),
  new Hsl(233.89, 90, 76.47),
  new Hsl(237.74, 85.81, 69.61),
  new Hsl(240.41, 80.22, 64.31),
  new Hsl(243.95, 65.52, 54.51),
  new Hsl(243.24, 53.62, 40.59),
  new Hsl(243.64, 45.83, 28.24),
];

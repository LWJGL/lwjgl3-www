import { Hsl } from '~/theme/color';
type Tone = Readonly<[Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl, Hsl]>;

export const BG = new Hsl(212.73, 21.57, 10);
export const TEXT = new Hsl(210, 28, 90.2);

export const PRIMARY: Tone = [
  new Hsl(212.31, 21.31, 11.96),
  new Hsl(210, 25, 15.69),
  new Hsl(208.97, 27.62, 20.59),
  new Hsl(209.3, 29.66, 28.43),
  new Hsl(208.47, 31.89, 36.27),
  new Hsl(208.16, 41.53, 46.27),
  new Hsl(209.46, 48.7, 54.9),
  new Hsl(212.59, 47.37, 66.47),
  new Hsl(213.46, 47.27, 78.43),
  new Hsl(213.1, 47.54, 88.04),
];

export const NEUTRAL: Tone = [
  new Hsl(219.13, 35.38, 12.75),
  new Hsl(216.52, 27.71, 16.27),
  new Hsl(215, 22.22, 21.18),
  new Hsl(218.4, 16.78, 29.22),
  new Hsl(215, 12.77, 36.86),
  new Hsl(219, 8.33, 47.06),
  new Hsl(219, 8.7, 54.9),
  new Hsl(216.67, 10.11, 65.1),
  new Hsl(218.57, 12.07, 77.25),
  new Hsl(217.5, 12.12, 87.06),
];

export const CRITICAL: Tone = [
  new Hsl(8.11, 55.22, 13.14),
  new Hsl(3.46, 56.52, 18.04),
  new Hsl(1.67, 60, 23.53),
  new Hsl(0, 66.27, 32.55),
  new Hsl(0, 72.95, 40.59),
  new Hsl(0.33, 73.88, 51.96),
  new Hsl(0.37, 85.42, 62.35),
  new Hsl(0.48, 92.59, 73.53),
  new Hsl(0.76, 95.18, 83.73),
  new Hsl(1.36, 95.65, 90.98),
];

export const CAUTION: Tone = [
  new Hsl(29.03, 58.49, 10.39),
  new Hsl(28.57, 60, 13.73),
  new Hsl(28.47, 64.84, 17.84),
  new Hsl(28.64, 70.97, 24.31),
  new Hsl(32, 81.08, 29.02),
  new Hsl(36.08, 91.86, 33.73),
  new Hsl(38.78, 93.78, 37.84),
  new Hsl(42.4, 95.41, 42.75),
  new Hsl(46.26, 89.72, 49.61),
  new Hsl(49.89, 96.94, 61.57),
];

export const POSITIVE: Tone = [
  new Hsl(137.65, 34.69, 9.61),
  new Hsl(140.77, 41.94, 12.16),
  new Hsl(140, 49.37, 15.49),
  new Hsl(143.23, 60.78, 20),
  new Hsl(142.41, 65.35, 24.9),
  new Hsl(142.3, 72.9, 30.39),
  new Hsl(142.39, 75.28, 34.9),
  new Hsl(141.78, 71.69, 42.94),
  new Hsl(141.74, 68.66, 57.45),
  new Hsl(140.84, 77.24, 75.88),
];

export const INFO: Tone = [
  new Hsl(247.27, 39.76, 16.27),
  new Hsl(244.8, 43.86, 22.35),
  new Hsl(243.38, 46.41, 30),
  new Hsl(244.32, 55.56, 44.12),
  new Hsl(243.87, 68.89, 55.88),
  new Hsl(239.58, 82.66, 66.08),
  new Hsl(237.19, 86.49, 70.98),
  new Hsl(233.21, 91.38, 77.25),
  new Hsl(229.46, 94.87, 84.71),
  new Hsl(227.73, 100, 91.37),
];
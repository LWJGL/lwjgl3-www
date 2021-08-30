## Usage

```bash
# Generate color theme:
node index.mjs \#4e789d
# Generate leonardocolor.io URL
node index.mjs --url

# Generate non-default color theme:
node index.mjs [themename]
```

## Notes

1. Base Scale (background)
2. Tones (neutral, critical, caution, positive, info)
3. Brand (accent)

- Tones follow Braid Design System conventions:
  https://seek-oss.github.io/braid-design-system/foundations/tones

- Color levels follow Radix Colors conventions:
  1-12
  https://www.radix-ui.com/colors

- Ratios tuned by hand:
  run `node index.mjs --url` to inspect on https://leonardocolor.io/theme.html

- Calculating a Contrast Ratio
  Contrast ratios can range from 1 to 21 (commonly written 1:1 to 21:1).
  (L1 + 0.05) / (L2 + 0.05), whereby:

* L1 is the relative luminance of the lighter of the colors, and
* L2 is the relative luminance of the darker of the colors.

- Web Content Accessibility Guidelines (WCAG) 2.0
  Contrast (Minimum): The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: (Level AA)
  Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;

- Enhanced Contrast Standards
  Contrast (Enhanced): The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the following: (Level AAA)
  Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;

Incidental: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
Logotypes: Text that is part of a logo or brand name has no minimum contrast requirement.

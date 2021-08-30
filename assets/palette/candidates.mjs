import * as radix from '@radix-ui/colors';
import chroma from 'chroma-js';
import { transform } from './util.mjs';

export let candidates = [
  Object.values(radix.blue),
  Object.values(radix.brown),
  Object.values(radix.crimson),
  Object.values(radix.cyan),
  Object.values(radix.grass),
  Object.values(radix.green),
  Object.values(radix.indigo),
  Object.values(radix.orange),
  Object.values(radix.pink),
  Object.values(radix.plum),
  Object.values(radix.purple),
  Object.values(radix.red),
  Object.values(radix.teal),
  Object.values(radix.tomato),
  Object.values(radix.violet),
  // Bright
  Object.values(radix.amber),
  Object.values(radix.lime),
  Object.values(radix.mint),
  Object.values(radix.sky),
  Object.values(radix.yellow),
  // Grays
  Object.values(radix.gray),
  Object.values(radix.mauve),
  Object.values(radix.olive),
  Object.values(radix.sage),
  Object.values(radix.sand),
  Object.values(radix.slate),
  // Metal
  Object.values(radix.bronze),
  Object.values(radix.gold),
].map(tone => tone.map(color => chroma(transform(color))));

export let candidatesDark = [
  Object.values(radix.blueDark),
  Object.values(radix.brownDark),
  Object.values(radix.crimsonDark),
  Object.values(radix.cyanDark),
  Object.values(radix.grassDark),
  Object.values(radix.greenDark),
  Object.values(radix.indigoDark),
  Object.values(radix.orangeDark),
  Object.values(radix.pinkDark),
  Object.values(radix.plumDark),
  Object.values(radix.purpleDark),
  Object.values(radix.redDark),
  Object.values(radix.tealDark),
  Object.values(radix.tomatoDark),
  Object.values(radix.violetDark),
  // Bright
  Object.values(radix.amberDark),
  Object.values(radix.limeDark),
  Object.values(radix.mintDark),
  Object.values(radix.skyDark),
  Object.values(radix.yellowDark),
  // Grays
  Object.values(radix.grayDark),
  Object.values(radix.mauveDark),
  Object.values(radix.oliveDark),
  Object.values(radix.sageDark),
  Object.values(radix.sandDark),
  Object.values(radix.slateDark),
  // Metal
  Object.values(radix.bronzeDark),
  Object.values(radix.goldDark),
].map(tone => tone.map(color => chroma(transform(color))));

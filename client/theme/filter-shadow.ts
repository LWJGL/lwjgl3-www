import { filter } from './filter';

export interface NaturalShadowOptions {
  blur?: number;
  x?: number;
  y?: number;
  opacity?: number;
  saturation?: number;
  lightness?: number;
}

/*
  let shadow = shadowFilter({ x, y, blur, saturation, lightness, opacity })
  then:

  <div style={{filter: shadow}} />
*/

export function shadowFilter(options: NaturalShadowOptions) {
  return filter`
    <feOffset dx="${options.x ?? 0}" dy="${options.y ?? 0}" />
    <feGaussianBlur  stdDeviation="${options.blur ?? 0}"  />
    <feColorMatrix type="saturate" values="${options.saturation ?? 1}"></feColorMatrix>
    <feComponentTransfer>
      <feFuncA type="linear" slope="${options.opacity ?? 1}"/>
    </feComponentTransfer>
    <feComponentTransfer>
      <feFuncR type="linear" slope="${options.lightness ?? 0.5}"/>
      <feFuncG type="linear" slope="${options.lightness ?? 0.5}"/>
      <feFuncB type="linear" slope="${options.lightness ?? 0.5}"/>
    </feComponentTransfer>
    <feMerge>
      <feMergeNode in="x" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  `;
}

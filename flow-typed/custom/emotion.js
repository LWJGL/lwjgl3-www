declare module 'emotion' {
  declare type EmotionRule = { [string]: any };

  declare type CSSRuleList = Array<EmotionRule>;

  declare class Stylesheet {
    inject(): void,
    insert(rule: string): void,
    flush(): void,
  }

  declare var sheet: Stylesheet;

  declare var inserted: { [string | number]: boolean | void };

  declare function flush(): void;

  declare function css(
    objs: Array<string> | EmotionRule | Array<EmotionRule>,
    vars: Array<any>,
    content: () => Array<any>
  ): string;

  declare function injectGlobal(objs: Array<any>, vars: Array<any>, content: () => Array<any>): void;

  declare function fontFace(objs: Array<any>, vars: Array<any>, content: () => Array<any>): void;

  declare function keyframes(objs: any, vars: Array<any>, content: () => Array<any>): void;
  declare function hydrate(ids: string[]): void;
  declare function objStyle(...rules: CSSRuleList): EmotionRule;
  declare function isLikeRule(rule: EmotionRule): boolean;
  declare function idFor(rule: EmotionRule): string;
}

declare type EmotionRule = { [string]: any };
declare type CSSRuleList = Array<EmotionRule>;
declare type GlobalProps = {
  css: Array<string> | EmotionRule | Array<EmotionRule>,
};

declare module '@emotion/core' {
  declare export var jsx: typeof React.createElement;
  declare export var Global: React.ComponentType<GlobalProps>;
}

declare module '@emotion/jsx' {
  declare export default typeof React.createElement;
}

declare module '@emotion/css' {
  declare export default function css(
    objs: Array<string> | EmotionRule | Array<EmotionRule>,
    vars: Array<any>,
    content: () => Array<any>
  ): string;
}

declare module '@emotion/global' {
  declare export default React.ComponentType<GlobalProps>;
}

declare module '@emotion/keyframes' {
  declare type Keyframes = {
    styles: EmotionRule,
    name: string,
  };

  declare export default function keyframes(string): Keyframes;
}

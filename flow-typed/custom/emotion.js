declare module '@emotion/core' {
  declare type EmotionRule = { [string]: any };
  declare type CSSRuleList = Array<EmotionRule>;
  declare type GlobalProps = {
    css: Array<string> | EmotionRule | Array<EmotionRule>,
  };
  declare type Keyframes = {
    styles: EmotionRule,
    name: string,
  };

  declare export var jsx: typeof React.createElement;
  declare export var Global: React.ComponentType<GlobalProps>;

  declare export function css(
    objs: Array<string> | EmotionRule | Array<EmotionRule>,
    vars: Array<any>,
    content: () => Array<any>
  ): string;

  declare export function keyframes(string): Keyframes;
}

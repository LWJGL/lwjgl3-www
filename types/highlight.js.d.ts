// declare var style: CSSModule;
// declare var hljs: HighlightJS;

declare module 'highlight.js/lib/highlight' {
  interface HighlightJS {
    registerLanguage(lang: string, langLib: any): void;
    highlight(lang: string, source: string): { value: string };
  }

  const hljs: HighlightJS;
  export default hljs;
}

declare module 'highlight.js/lib/languages/java' {
  const Module: any;
  export default Module;
}

declare module 'highlight.js/styles/dracula.css' {
  const Module: CSSModule;
  export default Module;
}

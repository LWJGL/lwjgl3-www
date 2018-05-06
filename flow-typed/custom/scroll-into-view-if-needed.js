declare module 'scroll-into-view-if-needed' {
  declare type scrollIntoViewOptions = {
    scrollMode?: 'if-needed',
    behavior?: 'auto' | 'instant' | 'smooth', // default = auto
    block?: 'start' | 'center' | 'end' | 'nearest', // default = center
    inline?: 'start' | 'center' | 'end' | 'nearest', // default = nearest
  };
  declare export default (element: HTMLElement, scrollIntoViewOptions: ?scrollIntoViewOptions) => void;
}

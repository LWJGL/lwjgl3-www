// https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2.1
export const contextOptions: WebGLContextAttributes = {
  antialias: window.devicePixelRatio === 1,
  alpha: true,
  failIfMajorPerformanceCaveat: true,
  preserveDrawingBuffer: true,
  desynchronized: true,
};

import env from './env'

// export const IS_CHROME = /Chrome/.test(navigator.userAgent);
// export const IS_SAFARI = !IS_CHROME && /Safari/.test(navigator.userAgent);

// Can't find a reliable way to compute the viewport offsetTop in iOS because pageYOffset returns the pixels
// from the top of the screen ( the point under the browser's address bar! )
export const IS_IOS = env.mobile && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

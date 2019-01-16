/*
 * Heavily based on FileSaver.js
 * By Eli Grey, https://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 * https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js
 */
function autoBOM(blob: Blob): Blob {
  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  return /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)
    ? new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type })
    : blob;
}

let saveAsWrapped;

// IE 10+ (native saveAs)
if (navigator.msSaveOrOpenBlob !== undefined) {
  saveAsWrapped = function(blob: Blob, name: string, no_auto_bom?: boolean) {
    return navigator.msSaveOrOpenBlob(no_auto_bom !== true ? blob : autoBOM(blob), name);
  };
} else {
  // only get URL when necessary in case Blob.js hasn't overridden it yet
  const getURL = function() {
    //@ts-ignore
    return window.URL || window.webkitURL || window;
  };

  const saveLink = document.createElement('a');

  const click = function(node: HTMLAnchorElement) {
    var event = new MouseEvent('click');
    node.dispatchEvent(event);
  };

  const revoke = function(file: string) {
    // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
    setTimeout(() => getURL().revokeObjectURL(file), 1000 * 40);
  };

  saveAsWrapped = function(blob: Blob, name: string, no_auto_bom?: boolean) {
    const objectUrl = getURL().createObjectURL(no_auto_bom !== true ? blob : autoBOM(blob));
    if ('download' in saveLink) {
      setTimeout(function() {
        saveLink.href = objectUrl;
        saveLink.download = name;
        click(saveLink);
        revoke(objectUrl);
      }, 0);
    } else {
      window.location.href = objectUrl;
      revoke(objectUrl);
    }
  };
}

export const saveAs = saveAsWrapped;

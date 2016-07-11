import tabbable from 'tabbable'

let trap;
let tabbableNodes;
let previouslyFocused;
let activeFocusTrap;
let insideTrap;
let onClose;

export function activate(element, options) {
  // There can be only one focus trap at a time
  if ( activeFocusTrap ) {
    deactivate();
  }
  activeFocusTrap = true;

  trap = element;
  insideTrap = options.closeOutside;
  onClose = options.onClose;
  previouslyFocused = document.activeElement;

  updateTabbableNodes();

  // Set initial focus
  if ( tabbableNodes.length ) tabbableNodes[0].focus();

  let doc = window.document;

  doc.addEventListener('focus', checkFocus, true);
  doc.addEventListener('click', checkClick, true);
  doc.addEventListener('touchend', checkClick, true);
  doc.addEventListener('keydown', checkKey, true);
}

export function deactivate() {
  if ( !activeFocusTrap ) return;
  activeFocusTrap = false;

  let doc = window.document;

  doc.removeEventListener('focus', checkFocus, true);
  doc.removeEventListener('click', checkClick, true);
  doc.removeEventListener('touchend', checkClick, true);
  doc.removeEventListener('keydown', checkKey, true);

  if ( onClose ) {
    onClose();
  }

  setTimeout(function() {
    if ( previouslyFocused ) {
      previouslyFocused.focus();
    }
  }, 0);
}

function checkClick(e) {
  if ( insideTrap && !insideTrap.contains(e.target) ) {
    deactivate();
  } else if ( trap.contains(e.target) ) {
    return;
  }
  e.preventDefault();
  e.stopImmediatePropagation();

}

function checkFocus(e) {
  updateTabbableNodes();
  if ( trap.contains(e.target) ) return;
  tabbableNodes[0].focus();
}

function checkKey(e) {
  if ( e.key === 'Tab' || e.keyCode === 9 ) {
    e.preventDefault();
    updateTabbableNodes();
    var currentFocusIndex = tabbableNodes.indexOf(e.target);
    var lastTabbableNode = tabbableNodes[tabbableNodes.length - 1];
    var firstTabbableNode = tabbableNodes[0];
    if ( e.shiftKey ) {
      if ( e.target === firstTabbableNode ) {
        lastTabbableNode.focus();
        return;
      }
      tabbableNodes[currentFocusIndex - 1].focus(0);
      return;
    }
    if ( e.target === lastTabbableNode ) {
      firstTabbableNode.focus();
      return;
    }
    tabbableNodes[currentFocusIndex + 1].focus();
  }

  if ( insideTrap !== null && ( e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27 ) ) {
    deactivate();
  }
}

function updateTabbableNodes() {
  tabbableNodes = tabbable(trap);
}

const SW_SUPPORTED =
  FLAG_PRODUCTION &&
  navigator.serviceWorker !== undefined &&
  window.isSecureContext &&
  (document.location as any).hostname === HOSTNAME_PRODUCTION;

interface WorkerListener {
  (isPending: boolean): void;
}

let worker: null | ServiceWorker = null;
let listeners: Array<WorkerListener> = [];
let pending = false;

export function addListener(cb: WorkerListener) {
  listeners.push(cb);
}

export function removeListener(cb: WorkerListener) {
  listeners.splice(listeners.indexOf(cb), 1);
}

export function isPending() {
  return pending;
}

export function update() {
  if (worker !== null) {
    worker.postMessage({ action: 'skipWaiting' });
  }
}

function setPending(state: boolean) {
  pending = state;
  listeners.forEach(cb => cb(state));
}

function trackInstallation(workerInstalling: ServiceWorker) {
  workerInstalling.addEventListener('statechange', () => {
    if (workerInstalling.state == 'installed') {
      // A new service worker has been installed!
      worker = workerInstalling;
      setPending(true);
    }
  });
}

if (SW_SUPPORTED) {
  // Prevent web app install banner from being displayed automatically
  // https://developers.google.com/web/fundamentals/app-install-banners/
  // let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    // deferredPrompt = e;
  });

  if (navigator.serviceWorker !== undefined) {
    // Register service worker
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((registration: ServiceWorkerRegistration) => {
        // Registration was successful
        // console.log('ServiceWorker registration successful with scope: ', reg.scope);

        // If there's no controller this page wasn't loaded via a service worker so we know we are on the latest version.
        if (navigator.serviceWorker.controller === null) {
          return;
        }

        // An updated worker is already waiting
        if (registration.waiting) {
          worker = registration.waiting;
          setPending(true);
          return;
        }

        // An updated worker is installing, track its progress (if it becomes "installed")
        if (registration.installing) {
          trackInstallation(registration.installing);
          return;
        }

        // Else, listen for new installing workers arriving. If on arrives, track its progress
        registration.addEventListener('updatefound', () => {
          if (registration.installing !== null) {
            trackInstallation(registration.installing);
          }
        });
      });
    });

    // ! This will refresh all open tabs!
    // If controller changed that means a new service worker has been activated.
    // This happens when we send 'skipWaiting' with postMessage. All clients will self reload.
    // Ensure refresh is only called once. This works around a bug in "force update on reload".
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  }
}

// @flow
import * as React from 'react';

type State = {
  // installed: boolean,
  updatePending: boolean,
  update: () => void,
};

type Props = {
  children: React.Node,
};

export const ServiceWorkerContext = React.createContext({
  updatePending: false,
  update: function() {},
});

// export const ServiceWorkerConsumer = ServiceWorkerContext.Consumer;

// const SW_SUPPORTED = navigator.serviceWorker !== undefined && window.isSecureContext;

const SW_SUPPORTED =
  FLAG_PRODUCTION &&
  navigator.serviceWorker !== undefined &&
  window.isSecureContext &&
  document.location.hostname === HOSTNAME_PRODUCTION;

if (SW_SUPPORTED) {
  // Prevent web app install banner from being displayed automatically
  // ? https://developers.google.com/web/fundamentals/app-install-banners/#defer_or_cancel
  // TODO: https://developers.google.com/web/updates/2018/06/a2hs-updates
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    return false;
  });
}

export class ServiceWorkerProvider extends React.Component<Props, State> {
  state = {
    updatePending: false,
    update: () => {
      this.update();
    },
  };
  mounted: boolean = false;
  worker: null | ServiceWorker = null;

  update() {
    if (this.worker !== null) {
      this.worker.postMessage({ action: 'skipWaiting' });
    }
  }

  trackInstallation(worker: ServiceWorker) {
    const _this = this;
    worker.addEventListener('statechange', () => {
      if (worker.state == 'installed') {
        _this.worker = worker;
        // A new service worker has been installed!
        if (_this.mounted) {
          _this.setState({
            updatePending: true,
          });
        }
      }
    });
  }

  componentDidMount() {
    this.mounted = true;

    if (SW_SUPPORTED /*:: && navigator.serviceWorker !== undefined*/) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js').then(reg => {
        // Registration was successful
        // console.log('ServiceWorker registration successful with scope: ', reg.scope);

        // If there's no controller, this page wasn't loaded via a service worker, so they're looking at the latest version.
        // In that case, exit early
        if (navigator.serviceWorker === undefined || navigator.serviceWorker.controller === null) {
          return;
        }

        // An updated worker is already waiting
        if (reg.waiting) {
          if (this.mounted) {
            this.worker = reg.waiting;
            this.setState({ updatePending: true });
            return;
          }
        }

        // An updated worker is installing, track its progress (if it becomes "installed")
        if (reg.installing) {
          this.trackInstallation(reg.installing);
          return;
        }

        // Else, listen for new installing workers arriving. If on arrives, track its progress
        reg.addEventListener('updatefound', () => {
          this.trackInstallation(reg.installing);
        });
      });

      // ! This will refresh all open tabs!
      // If controller changed that means a new service worker has been activated.
      // This happens when we send 'skipWaiting' with postMessage. All clients will self reload.
      // Ensure refresh is only called once. This works around a bug in "force update on reload".
      let refreshing = false;

      /*:: if ( navigator.serviceWorker === undefined ) return; */
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <ServiceWorkerContext.Provider value={this.state}>
        {React.Children.only(this.props.children)}
      </ServiceWorkerContext.Provider>
    );
  }
}

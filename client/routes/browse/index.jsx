// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';

import { Browser } from './components/Browser';
import { register } from '~/store/asyncReducers';
import { fileBrowserReducer, loadPath } from './reducer';
import { Connect } from '~/store/Connect';

register('browser', fileBrowserReducer);

const BrowseRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Helmet>
      <title>Browse</title>
      <meta name="description" content="Browse LWJGL files" />
    </Helmet>
    <main>
      <section className="container px-0" style={{ margin: '-1rem auto' }}>
        <Connect
          state={state => ({
            ...state.browser.contents[state.browser.path],
            path: state.browser.path,
          })}
          actions={{
            loadPath,
          }}
        >
          {(props, actions) => <Browser {...props} {...actions} />}
        </Connect>
      </section>
    </main>
  </PageView>
);

export default BrowseRoute;

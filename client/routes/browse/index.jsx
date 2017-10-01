// @flow
import * as React from 'react';
import PageView from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import Helmet from 'react-helmet';

import Browser from './components/Browser';
import { register } from '~/store/asyncReducers';
import reducer, { loadPath } from './reducer';
import Connect from '~/store/Connect';

register('browser', reducer);

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
          actions={dispatch => ({
            loadPath: (path: string) => dispatch(loadPath(path)),
          })}
        >
          {(props, actions) => <Browser {...props} {...actions} />}
        </Connect>
      </section>
    </main>
  </PageView>
);

export default BrowseRoute;

// @flow
import * as React from 'react';
import { PageView } from '~/containers/PageView';
import type { ContextRouter } from 'react-router-dom';
import { Head } from '~/components/Head';
import { Title } from '~/components/Title';

import { Browser } from './components/Browser';
import { register } from '~/store/asyncReducers';
import { fileBrowserReducer, loadPath } from './reducer';
import { Connect } from '~/store/Connect';

register('browser', fileBrowserReducer);

const BrowseRoute = (props: ContextRouter) => (
  <PageView {...props}>
    <Title>Browse</Title>
    <Head tag="meta" name="description" content="Browse LWJGL files" />
    <main>
      <section className="container-fluid px-0" style={{ margin: '-1rem auto 0 auto' }}>
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

import { hot } from 'react-hot-loader';
export default hot(module)(BrowseRoute);

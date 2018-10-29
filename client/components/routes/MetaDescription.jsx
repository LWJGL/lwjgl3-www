// @flow
import * as React from 'react';
//$FlowFixMe
import { useContext, useState } from 'react';
import { Head } from '../Head';

export const MetaDescriptionContext = React.createContext({
  desc: null,
  setDesc: function() {},
});

export function MetaDescriptionProvider(props: { children: React.Node }) {
  const [desc, setDesc] = useState(null);

  return (
    <MetaDescriptionContext.Provider
      value={{
        desc,
        setDesc,
      }}
    >
      {desc !== null && (
        <Head>
          <meta name="description" content={desc} />
        </Head>
      )}
      {props.children}
    </MetaDescriptionContext.Provider>
  );
}

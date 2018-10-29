// @flow
import * as React from 'react';
//$FlowFixMe
import { useMutationEffect } from 'react';
import type { CSSModule } from '~/services/CSSModule';

type Props = {
  loader: CSSModule,
};

function Style({ loader }: Props) {
  useMutationEffect(() => {
    loader.use();
    return loader.unuse;
  });

  return null;
}

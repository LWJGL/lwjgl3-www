// import { Fragment } from 'react';
import { styled } from '~/theme/stitches.config';
import { Grid } from '~/components/layout/Grid';
// import * as radix from '@radix-ui/colors';

const ColorBox = styled('div', {
  width: '100%',
  height: 30,
  border: '1px solid black',
});

export const Colors: React.FC = () => {
  return (
    <Grid css={{ grid: 'auto-flow / 1fr repeat(12, 1fr)', gap: '$sm' }}>
      <span>Accent</span>
      <ColorBox css={{ backgroundColor: '$accent1' }} />
      <ColorBox css={{ backgroundColor: '$accent2' }} />
      <ColorBox css={{ backgroundColor: '$accent3' }} />
      <ColorBox css={{ backgroundColor: '$accent4' }} />
      <ColorBox css={{ backgroundColor: '$accent5' }} />
      <ColorBox css={{ backgroundColor: '$accent6' }} />
      <ColorBox css={{ backgroundColor: '$accent7' }} />
      <ColorBox css={{ backgroundColor: '$accent8' }} />
      <ColorBox css={{ backgroundColor: '$accent9' }} />
      <ColorBox css={{ backgroundColor: '$accent10' }} />
      <ColorBox css={{ backgroundColor: '$accent11' }} />
      <ColorBox css={{ backgroundColor: '$accent12' }} />

      {/* {Object.keys(radix)
        .filter((name) => !name.endsWith('A') && name.indexOf('Dark') === -1)
        .map((tone) => {
          return (
            <Fragment key={tone}>
              <span>{tone}</span>
              {Object.keys(radix[tone]).map((color) => {
                return <ColorBox key={color} style={{ backgroundColor: radix[tone][color] }} />;
              })}
            </Fragment>
          );
        })}

      {Object.keys(radix)
        .filter((name) => !name.endsWith('A') && name.indexOf('Dark') > -1)
        .map((tone) => {
          return (
            <Fragment key={tone}>
              <span>{tone}</span>
              {Object.keys(radix[tone]).map((color) => {
                return <ColorBox key={color} style={{ backgroundColor: radix[tone][color] }} />;
              })}
            </Fragment>
          );
        })} */}
    </Grid>
  );
};

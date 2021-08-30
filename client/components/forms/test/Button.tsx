import { Grid } from '~/components/layout/Grid';
import { Button } from '~/components/forms/Button';

interface Props {
  showDisabled?: boolean;
}

export const ButtonVariations: React.FC<Props> = ({ showDisabled = false }) => {
  return (
    <Grid css={{ grid: 'repeat(4, 3rem) / 0.5fr repeat(3, 1fr)', gap: '$paragraph' }}>
      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>ACCENT</h2>
      <Button tone="accent">Contained</Button>
      <Button tone="accent" variant="outline">
        Outline
      </Button>
      <Button tone="accent" variant="text">
        Text
      </Button>
      {showDisabled ? (
        <>
          <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>BASE DISABLED</h2>
          <Button tone="accent" disabled>
            Contained
          </Button>
          <Button tone="accent" disabled variant="outline">
            Outline
          </Button>
          <Button tone="accent" disabled variant="text">
            Text
          </Button>
        </>
      ) : null}

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>NEUTRAL</h2>
      <Button tone="neutral">Contained</Button>
      <Button tone="neutral" variant="outline">
        Outline
      </Button>
      <Button tone="neutral" variant="text">
        Text
      </Button>
      {showDisabled ? (
        <>
          <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>NEUTRAL DISABLED</h2>
          <Button disabled tone="neutral">
            Contained
          </Button>
          <Button disabled tone="neutral" variant="outline">
            Outline
          </Button>
          <Button disabled tone="neutral" variant="text">
            Text
          </Button>
        </>
      ) : null}

      {/* <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>POSITIVE</h2>
      <Button tone="positive">Contained</Button>
      <Button tone="positive" variant="outline">
        Outline
      </Button>
      <Button tone="positive" variant="text">
        Text
      </Button>
      {showDisabled ? (
        <>
          <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>POSITIVE</h2>
          <Button disabled tone="positive">
            Contained
          </Button>
          <Button disabled tone="positive" variant="outline">
            Outline
          </Button>
          <Button disabled tone="positive" variant="text">
            Text
          </Button>
        </>
      ) : null}

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>INFO</h2>
      <Button tone="info">Contained</Button>
      <Button tone="info" variant="outline">
        Outline
      </Button>
      <Button tone="info" variant="text">
        Text
      </Button>
      {showDisabled ? (
        <>
          <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>INFO DISABLED</h2>
          <Button disabled tone="info">
            Contained
          </Button>
          <Button disabled tone="info" variant="outline">
            Outline
          </Button>
          <Button disabled tone="info" variant="text">
            Text
          </Button>
        </>
      ) : null} */}

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>CAUTION</h2>
      <Button tone="caution">Contained</Button>
      <Button tone="caution" variant="outline">
        Outline
      </Button>
      <Button tone="caution" variant="text">
        Text
      </Button>
      {showDisabled ? (
        <>
          <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>CAUTION DISABLED</h2>
          <Button disabled tone="caution">
            Contained
          </Button>
          <Button disabled tone="caution" variant="outline">
            Outline
          </Button>
          <Button disabled tone="caution" variant="text">
            Text
          </Button>
        </>
      ) : null}

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>CRITICAL</h2>
      <Button tone="critical">Contained</Button>
      <Button tone="critical" variant="outline">
        Outline
      </Button>
      <Button tone="critical" variant="text">
        Text
      </Button>
      {showDisabled ? (
        <>
          <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>CRITICAL DISABLED</h2>
          <Button disabled tone="critical">
            Contained
          </Button>
          <Button disabled tone="critical" variant="outline">
            Outline
          </Button>
          <Button disabled tone="critical" variant="text">
            Text
          </Button>
        </>
      ) : null}
    </Grid>
  );
};

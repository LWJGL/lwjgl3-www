import { Grid } from '~/components/layout/Grid';
import { Button } from '~/components/forms/Button';

export function ButtonVariations() {
  return (
    <Grid css={{ my: '10rem', grid: 'repeat(6, 3rem) / 0.5fr repeat(4, 1fr)', gap: '$paragraph' }}>
      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>BASE</h2>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>NEUTRAL</h2>
      <Button tone="neutral">Default</Button>
      <Button tone="neutral" variant="secondary">
        Secondary
      </Button>
      <Button tone="neutral" variant="outline">
        Outline
      </Button>
      <Button tone="neutral" variant="text">
        Text
      </Button>

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>POSITIVE</h2>
      <Button tone="positive">Default</Button>
      <Button tone="positive" variant="secondary">
        Secondary
      </Button>
      <Button tone="positive" variant="outline">
        Outline
      </Button>
      <Button tone="positive" variant="text">
        Text
      </Button>

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>INFO</h2>
      <Button tone="info">Default</Button>
      <Button tone="info" variant="secondary">
        Secondary
      </Button>
      <Button tone="info" variant="outline">
        Outline
      </Button>
      <Button tone="info" variant="text">
        Text
      </Button>

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>CAUTION</h2>
      <Button tone="caution">Default</Button>
      <Button tone="caution" variant="secondary">
        Secondary
      </Button>
      <Button tone="caution" variant="outline">
        Outline
      </Button>
      <Button tone="caution" variant="text">
        Text
      </Button>

      <h2 style={{ justifySelf: 'end', alignSelf: 'center' }}>CRITICAL</h2>
      <Button tone="critical">Default</Button>
      <Button tone="critical" variant="secondary">
        Secondary
      </Button>
      <Button tone="critical" variant="outline">
        Outline
      </Button>
      <Button tone="critical" variant="text">
        Text
      </Button>
    </Grid>
  );
}

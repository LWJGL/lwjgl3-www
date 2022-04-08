import { styled } from '~/theme/stitches.config';

export const Text = styled('p', {
  // '--text-size': '1rem',
  fontSize: 'var(--text-size, inherit)',
  // fontSize: 'var(--text-size, 1rem)',
  variants: {
    size: {
      auto: {
        fontSize: 'calc(var(--text-size, 1rem) * var(--scale-sm, 1))',
      },
      xs: {
        fontSize: 'calc(var(--text-size, 1rem) * 0.75)',
      },
      sm: {
        fontSize: 'calc(var(--text-size, 1rem) * 0.875)',
      },
      base: {
        fontSize: 'var(--text-size, 1rem)',
      },
      lg: {
        fontSize: 'calc(var(--text-size, 1rem) * 1.125)',
      },
      xl: {
        fontSize: 'calc(var(--text-size, 1rem) * 1.25)',
      },
      xxl: {
        fontSize: 'calc(var(--text-size, 1rem) * 1.5)',
      },
    },
    margin: {
      true: {
        mb: '$paragraph',
      },
    },
  },
});

interface HeadingProps {
  level: number;
}

export const H1 = styled('h1', {
  '--text-size': '2.25em',
  fontWeight: '$light',
  '> b,> strong': {
    fontWeight: '$bold',
  },
});

export const H2 = styled('h2', {
  '--text-size': '1.75em',
  fontWeight: '$bold',
});

export const H3 = styled('h3', {
  '--text-size': '1.25em',
  fontWeight: '$bold',
});

const HeadingSwitch: FCC<HeadingProps> = ({ level, children, ...rest }) => {
  switch (level) {
    case 1:
      return <H1 {...rest}>{children}</H1>;
    case 2:
      return <H2 {...rest}>{children}</H2>;
    case 3:
      return <H3 {...rest}>{children}</H3>;
    case 4:
      return <h4 {...rest}>{children}</h4>;
    case 5:
      return <h5 {...rest}>{children}</h5>;
    case 6:
      return <h6 {...rest}>{children}</h6>;
    default:
      return <H3 {...rest}>{children}</H3>;
  }
};

export const Heading = styled(HeadingSwitch, Text);

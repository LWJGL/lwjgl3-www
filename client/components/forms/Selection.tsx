import { styled } from '~/theme/stitches.config';
import { register } from '~/theme/icons/sheet';
import { Box } from '~/components/layout/Box';

const UICheckboxChecked = 'ui/checkbox/checked';
const UICheckboxIndeterminate = 'ui/checkbox/indeterminate';
const UIRadioChecked = 'ui/radio/checked';
const UISwitch = 'ui/switch';

register(
  `<symbol id="${UICheckboxChecked}" viewBox="0 0 24 24"><path fill="none" stroke-width="2" stroke="currentColor" d="M19.7 6.3c-.4-.4-1-.4-1.4 0L9 15.6l-3.3-3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4 4c.2.2.4.3.7.3s.5-.1.7-.3l10-10c.4-.4.4-1 0-1.4z"></path></svg>`
);
register(
  `<symbol id="${UICheckboxIndeterminate}" viewBox="0 0 24 24"><path fill="none" stroke-width="2" stroke="currentColor" d="M18 11H6c-.6 0-1 .4-1 1s.4 1 1 1h12c.6 0 1-.4 1-1s-.4-1-1-1z"></path></symbol>`
);
register(`<symbol id="${UIRadioChecked}" viewBox="-4 -4 8 8"><circle r="2" fill="currentColor"/></symbol>`);
register(`<symbol id="${UISwitch}" viewBox="-4 -4 8 8"><circle r="3" fill="currentColor"/></symbol>`);

const Gap = styled(Box, {
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: '0.75rem',
});

const SelectionLabel = styled('label', {
  '--line-height-base': '1.5em',
  '--control-width': '1em',
  '--control-height': '1em',

  display: 'flex',
  position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',

  '@sm-down': {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    // expand hit area
    padding: '$xsm $sm',
    margin: '0 calc($sm * -1)',
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: 0.5,
      },
    },
  },
});

export const SelectionInput = styled('input', {
  border: 0,
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  position: 'absolute',
  clip: 'rect(1px,1px,1px,1px)',
  overflow: 'hidden',
  '@all': {
    overflow: 'clip',
  },
  whiteSpace: 'nowrap',

  // Animate visual sibling only on programmatic value change
  '&:not(:focus) + *': {
    transition: 'background-color .15s ease-in-out, border-color .15s ease-in-out',
  },

  '&:focus + *': {
    borderColor: '$primary600',
    boxShadow: '0 0 0 3px $outline_primary',
  },

  '&:not(:checked):focus + *': {
    color: '$primary400',
  },
});

const Mark = styled('svg', {
  width: 'calc(1em - 1px)',
  height: 'calc(1em - 1px)',
  transition: 'transform .15s ease-in-out',
});

function getVisualMark(id: string): React.ReactNode {
  return (
    <Mark focusable={false} aria-hidden={true} preserveAspectRatio="xMidYMid meet">
      <use xlinkHref={`#${id}`} />
    </Mark>
  );
}

const Visual = styled('div', {
  width: 'var(--control-width, 1em)',
  height: 'var(--control-height, 1em)',
  border: '1px solid $neutral500',
  backgroundColor: '$body',
  flex: '0 0 var(--control-width, 1em)',
  mt: 'calc((var(--line-height-base) - var(--control-height)) / 2)',
  color: '$primary50',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&:active': {
    filter: 'brightness(.9)',
  },

  variants: {
    variant: {
      checkbox: {
        borderRadius: '$rounded',
      },
      switch: {
        '--control-width': '1.75em',
        borderRadius: '2.25em',
        color: '$neutral400',
        backgroundColor: '$body',
        // borderColor: '$neutral400',
        // border: 'none',
        transition: 'background-color .15s ease-in-out, border-color .15s ease-in-out',
        [`${Mark}`]: {
          width: '1em',
          height: '1em',
          transform: 'translateX(-0.38em)',
        },
      },
      radio: {
        borderRadius: '$full',
      },
    },
    checked: {
      true: {
        backgroundColor: '$primary600',
        borderColor: '$primary600',
      },
    },
    disabled: {
      true: {
        borderColor: '$neutral600',
        backgroundColor: '$neutral200',
      },
    },
  },
  compoundVariants: [
    {
      checked: true,
      disabled: true,
      css: {
        backgroundColor: '$neutral600',
      },
    },
    {
      checked: true,
      variant: 'switch',
      css: {
        color: '$primary50',
      },
    },
    {
      variant: 'switch',
      checked: true,
      css: {
        backgroundColor: '$primary600',
        borderColor: '$primary600',
        [`${Mark}`]: {
          transform: 'translateX(.38em)',
        },
      },
    },
  ],
});

export const SelectionLabelDescription = styled('div', {
  fontSize: '$sm',
  color: '$neutral600',
});

export interface CheckboxProps {
  value?: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  description?: React.ReactNode;
  variant?: 'checkbox' | 'switch';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onChange,
  checked = false,
  disabled = false,
  indeterminate = false,
  children,
  description,
  variant = 'checkbox',
}) => (
  <SelectionLabel disabled={disabled}>
    <SelectionInput
      type="checkbox"
      disabled={disabled}
      checked={checked}
      onChange={(e) => {
        onChange(e, value);
      }}
    />
    <Visual variant={variant} checked={checked || indeterminate} disabled={disabled}>
      {variant === 'switch'
        ? getVisualMark(UISwitch)
        : checked || indeterminate
        ? getVisualMark(indeterminate ? UICheckboxIndeterminate : UICheckboxChecked)
        : null}
    </Visual>
    {children && (
      <>
        <Gap />
        <div>
          {children}
          {description && <SelectionLabelDescription>{description}</SelectionLabelDescription>}
        </div>
      </>
    )}
  </SelectionLabel>
);

export interface RadioProps {
  value: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
  checked?: boolean;
  disabled?: boolean;
  description?: React.ReactNode;
}

export const Radio: React.FC<RadioProps> = ({
  value,
  onChange,
  checked = false,
  disabled = false,
  children,
  description,
}) => (
  <SelectionLabel disabled={disabled}>
    <SelectionInput
      type="radio"
      disabled={disabled}
      checked={checked}
      onChange={(e) => {
        onChange(e, value);
      }}
    />
    <Visual variant="radio" checked={checked} disabled={disabled}>
      {checked ? getVisualMark(UIRadioChecked) : null}
    </Visual>
    {children && (
      <>
        <Gap />
        <div>
          {children}
          {description && <SelectionLabelDescription>{description}</SelectionLabelDescription>}
        </div>
      </>
    )}
  </SelectionLabel>
);

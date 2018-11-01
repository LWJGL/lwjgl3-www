import { useState } from 'react';

export function useInputValue(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  function onChange(event: React.SyntheticEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return {
    value,
    onChange,
  };
}

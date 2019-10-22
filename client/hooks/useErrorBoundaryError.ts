import { useState } from 'react';

export function useErrorBoundaryError() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    // clear out the error
    setError(null);
    // let the error boundary catch this
    throw error;
  }

  return setError;
}

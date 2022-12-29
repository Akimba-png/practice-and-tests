import { useState } from 'react';

const useToggle = (defaultValue: boolean) => {
  const [state, setState] = useState<boolean>(defaultValue);
  const updateState = (value?: boolean | undefined) => {
    setState((prev) => value !== undefined ? value : !prev);
  };
  return {
    state,
    updateState,
  };
};

export { useToggle };

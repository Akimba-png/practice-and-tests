import { useEffect } from 'react';

const useDebounce = (cb: () => void, delay: number) => {

  useEffect(() => {
    const id = setTimeout(() => {
      cb();
    }, delay);
    return clearTimeout(id);
  });
};

export { useDebounce };

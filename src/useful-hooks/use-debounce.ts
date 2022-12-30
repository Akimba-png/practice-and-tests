import { useEffect } from 'react';

const useDebounce = (cb: Function, delay: number) => {
  let id = 0;
  useEffect(() => {
    return () => clearTimeout(id);
  });
  const debounced = <T>(data: T) => {
    clearTimeout(id);
    id = setTimeout(() => {
      cb(data);
    }, delay) as unknown as number;
  };
  return debounced;
};

export { useDebounce };

import { useState, useEffect } from 'react';

const useDebouncedValue = <T>(value: T, delay: number) => {
  const [ debouncedValue, setDebouncedValue ] = useState<T>(value);
  useEffect(() => {
    let id = 0;
    id = setTimeout(() => {
      setDebouncedValue(value);
    }, delay) as unknown as number;
    return () => clearTimeout(id);
  }, [value]);
  return debouncedValue;
};


export { useDebouncedValue };

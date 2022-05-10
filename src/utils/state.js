import { useReducer, useRef, useEffect } from 'react';

const toggleReducer = (state, nextValue) =>
  typeof nextValue === 'boolean' ? nextValue : !state;

export const useToggle = initialValue => {
  return useReducer(toggleReducer, initialValue);
};

export const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

import { useEffect } from "react";

/**
 * Debounce a callback function
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @param dependencies - Dependencies array (like useEffect)
 */
export function useDebounce(
  callback: () => void,
  delay: number,
  dependencies: React.DependencyList
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

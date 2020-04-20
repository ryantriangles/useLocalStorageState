import { useEffect, useState } from "react";

// Custom hook that behaves exactly like useState, but which stores the value
// in local storage on each update, and attempts to fetch the value from local
// storage on each access. The `defaultValue` passed to the useState call only
// gets used when `key` isn't found in local storage.
function useLocalStorageState(key: string, defaultValue: any) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  // Listen for storage events to keep state in sync with other tabs.
  useEffect(() => {
    const storageEventListener = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key)
        setValue(JSON.parse(e.newValue as string));
    };
    window.addEventListener("storage", storageEventListener);
    // Clean up the old event listener on unmount or key change
    return () => window.removeEventListener("storage", storageEventListener);
  }, [key]);

  const setValueInLocalStorage = (newValue: any) => {
    setValue((currentValue: any) => {
      const evaluatedNewValue =
        typeof newValue === "function" ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(evaluatedNewValue));
      return evaluatedNewValue;
    });
  };

  return [value, setValueInLocalStorage];
}

export default useLocalStorageState;

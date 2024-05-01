import { useEffect } from "react";

export const useWindowListener = (eventType, listener) => {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
};

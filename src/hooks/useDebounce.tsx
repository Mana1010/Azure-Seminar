import { useEffect, useState } from "react";

function useDebounce(text: string) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(text);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);
  return value;
}

export default useDebounce;

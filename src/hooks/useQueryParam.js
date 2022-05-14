import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function useQueryParam(key) {
  let [searchParams, setSearchParams] = useSearchParams();
  let paramValue = searchParams.get(key);

  let value = useMemo(() => paramValue, [paramValue]);

  let setValue = useCallback(
    (newValue, options) => {
      let newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, newValue);
      setSearchParams(newSearchParams, options);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

export default useQueryParam;

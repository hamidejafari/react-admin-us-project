import { useCallback, useState } from "react";
import axiosInstance from "../utiles/axiosInstance";

const useGetData = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const getData = useCallback((url) => {
    setLoading(true);
    axiosInstance
      .get(url)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { loading, error, data, setData, getData, setLoading };
};

export default useGetData;

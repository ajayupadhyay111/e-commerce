import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const optionsString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts = { ...options };
    if (method === "POST" && !opts.data) {
      opts.data = {};
    }
    return opts;
  }, [method, optionsString]);

  useEffect(() => {
    const apiCall = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });
        setData(response);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    apiCall();
  }, [url, refreshIndex, requestOptions]);

  const refresh = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  return { data, loading, error, refresh };
};

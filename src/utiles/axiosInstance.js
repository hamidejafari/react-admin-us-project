import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URL + "/api/",
});

axiosInstance.interceptors.request.use(function (config) {
  if (Cookies.get('admin-token')) {
    config.headers.Authorization = `Bearer ${Cookies.get('admin-token')}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error?.response?.status >= 500 && error?.response?.status <= 599) {
      toast.error("Error happened please contact admin.");
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;

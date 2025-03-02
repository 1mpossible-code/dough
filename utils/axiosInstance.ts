import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.130.45:3000/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default axiosInstance;
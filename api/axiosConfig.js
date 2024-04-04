import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:5000/", // local development
  baseURL: "http://34.171.192.59:3000/", // production deployment
  timeout: 1000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    // Add other default headers if necessary
  },
});

export default axiosInstance;

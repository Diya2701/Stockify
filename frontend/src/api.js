import axios from "axios";

const api = axios.create({
  baseURL: "https://stockify-backend-opit.onrender.com",
  withCredentials: true,
});

export default api;

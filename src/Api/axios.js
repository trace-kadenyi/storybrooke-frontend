import axios from "axios";

// const BASE_URL = "https://imagine-tellmeastory-api.vercel.app"

const BASE_URL = "https://imagine-tellmeastory-api-git-dev-trace-kadenyi.vercel.app/"

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
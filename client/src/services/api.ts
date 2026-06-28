import axios from "axios";

const API = axios.create({
  baseURL: "https://task-tracker-8kcj.onrender.com",
});

export default API;
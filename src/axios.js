import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3102",
});

export default instance;

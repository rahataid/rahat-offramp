import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/v1" + "/offramps",
});

export default api;

export const endpoints = {
  offramps: {
    requests: {
      create: "/",
      list: "/",
      execute: "/execute",
    },
    providers: {
      list: "/providers",
      register: "/providers",
      actions: "/providers/actions",
    },
  },
};


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/v1",
});

export default api;

export const endpoints = {
  offramps: {
    create: "/offramps",
    execute: "/offramps/execute",
    list: "/offramps",
    single: `/offramps/single`,
    providers: {
      list: "/offramps/providers",
      actions: "/offramps/providers/actions",
    },
  },
};

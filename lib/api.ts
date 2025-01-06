import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_API || "http://localhost:5500/v1",
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

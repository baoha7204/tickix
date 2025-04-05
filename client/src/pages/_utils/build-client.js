import axios from "axios";

const buildClient = ({ req }) => {
  let config = {};
  // Check if the environment is SERVER
  if (typeof window === "undefined") {
    config = {
      // baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      baseUrl: "http://pregnacare.dev",
      headers: req.headers,
    };
  }
  return axios.create(config);
};

export default buildClient;

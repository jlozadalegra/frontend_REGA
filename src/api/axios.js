import axios from "axios";
import { TokenService } from "../services";
//import { useLocation, Navigate } from "react-router-dom";

const instance = axios.create({
  baseURL: "http://10.0.1.115:8300",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (request) => {
    const token = await TokenService.GetAccessToken();

    if (token) {      
      request.headers["Authorization"] = "Bearer " + token;
      request.headers["Content-Type"] = "application/json";
    }
    console.info("Request AXIOS", request);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.info("Response AXIOS", response);    
    return response;
  },
  async (error) => {
    console.error("Error AXIOS response", error);

    if (error.response.status === 401){      
      TokenService.RemoveUser();
      window.location.replace('/login');
    }
 
    /*
    
    const originalConfig = err.config;

    if (err.response.status === 401) {

      originalConfig._retry = true;

      try {
        const rs = await instance.post("/auth/refreshtoken", {
          refreshToken: TokenService.getLocalRefreshToken(),
        });

        const { accessToken } = rs.data;
        TokenService.updateLocalAccessToken(accessToken);

        return instance(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
*/
    return Promise.reject(error);
  }
);

export default instance;

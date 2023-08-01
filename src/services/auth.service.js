import instance from "../api/axios";
import { AXIOSCONST } from "../constants/axios.constants";

const login = async (usuario, password) => {
  let resp = "";

  try {
    resp = await instance({
      method: "post",
      url: AXIOSCONST.LOGIN,
      data: {
        usuario: usuario,
        password: password,
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error.response.data;
      });
  } catch (error) {
    console.error("LoginTry", error);
  }

  return resp;
};

const AuthService = {
  login,
};

export default AuthService;

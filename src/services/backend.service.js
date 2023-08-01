import axios from "../api/axios";

//Obtener -------------------------------------------------------
const _get = async (url) => {
  let respuesta = "";

  try {
    respuesta = await axios({
      method: "get",
      url: url,
    }).then((response) => {
      return response.data;
    });
  } catch (error) {
    if (!error?.response) {
      return { message: "Servidor no encontrado" };
    } else {
      return error.response.data;
    }
  }

  return respuesta;
};

//Insertar Registro----------------------------------------------------------
const _insert = async (url, value) => {
  let respuesta = "";

  try {
    respuesta = await axios({
      method: "post",
      url: url,
      data: value,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {        
        return err.response.data;
      });
  } catch (error) {    
    return error.response.data;
  }

  return respuesta;
};

//Actualizar registros------------------------------------------------------
const _update = async (url, value) => {
  let respuesta = "";

  try {
    respuesta = await axios({
      method: "put",
      url: url,
      data: value,
    }).then((response) => {
      return response.data;
    });
  } catch (error) {
    return error.response.data;
  }

  return respuesta;
};

//Eleminar un registro-------------------------------------------------------
const _delete = async (url) => {
  let respuesta = "";

  try {
    respuesta = await axios({
      method: "delete",
      url: url,
    }).then((response) => {
      return response.data;
    });
  } catch (error) {
    return error.response.data;
  }

  return respuesta;
};

const BackendService = {
  _get,
  _insert,
  _update,
  _delete,
};

export default BackendService;

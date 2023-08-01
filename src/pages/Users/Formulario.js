import React, { useEffect, useState } from "react";

import style from "../../styles/style";

import { MenuItem, Box, Modal, Grid, Button, Typography } from "@mui/material";

import { Formik, Form, Field } from "formik";

import { TextField, Select } from "formik-mui";

import { useAuthContext } from "../../contexts/auth-context";

import { AXIOSCONST } from "../../constants";
import { BackendService } from "../../services";

export function Formulario({ open, onClose, postedit, currentrow }) {
  const { usuario, MessageError, MessageSuccess } = useAuthContext();
  const [unidades, setUnidades] = useState([]);
  const [modifedUser, setModifedUser] = useState(false);

  useEffect(() => {
    setModifedUser(false);

    //Cargar undades-------------------------------------------------------
    const cargarUnidades = async () => {
      const result = await BackendService._get(AXIOSCONST.UNITS);

      if (result.statusCode === 200) {
        await setUnidades(result.data);
      } else {
        MessageError(result.message);
      }
    };

    cargarUnidades();
  }, [MessageError]);

  //Validar identificador---------------------------------------------------------------------
  const validateuser = async (usuario) => {
    const validate = await BackendService._get(
      AXIOSCONST.USERS + "/" + usuario
    );

    return validate;
  };

  //Guardar nuevo registro--------------------
  const newrecord = async (value) => {
    if (usuario.usuario !== "Administrador") {
      //newrow = { ...value, Num_unidad_reg: usuario.idUnidad };
      value.Num_unidad_reg = usuario.idUnidad;
    } else {
      value.Num_unidad_reg = parseInt(value.Num_unidad_reg);
    }

    let minuscula = value.identificador;
    value.identificador = minuscula.toLowerCase();

    value.deleted = "NO";

    //Guardar un registro
    const result = await BackendService._insert(AXIOSCONST.USERS, value);

    onClose(true); //Cierra el modal

    if (result.statusCode === 200) {
      MessageSuccess("Registro guardado satisfactoriamente");
    } else {
      MessageError(result.message);
    }
  };

  //Actualizar nuevo registro---------------------
  const updaterecord = async (value) => {
    value.Num_unidad_reg = parseInt(value.Num_unidad_reg);

    if (!modifedUser) {
      delete value.passnreg;
    }

    const result = await BackendService._update(
      AXIOSCONST.USERS + "/" + currentrow.id,
      value
    );

    onClose(true); //Cierra el modal

    if (result.statusCode === 200) {
      MessageSuccess("Registro actualizado satisfactoriamente");
    } else {
      MessageError(result.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box>
          <Typography color="darkred" variant="h3" gutterBottom>
            {postedit === "post"
              ? "Insertar Nuevo Registro"
              : "Actualizar Registro"}
          </Typography>
        </Box>
        <Formik
          initialValues={{
            identificador: postedit === "edit" ? currentrow.identificador : "",
            Num_unidad_reg:
              postedit === "edit" ? currentrow.Num_unidad_reg.id : "",
            passnreg: postedit === "edit" ? currentrow.passnreg : "",
            datosgenerales:
              postedit === "edit" ? currentrow.datosgenerales : "",
            aut_NC: postedit === "edit" ? currentrow.aut_NC[0] : "NO",
          }}
          validate={async (values) => {
            const errors = {};

            const expresion = {
              user: /^[a-z0-9]{4,16}$/,
              fullname: /^[a-zA-Z\sÁ-ÿ]{1,40}$/,
            };

            if (!values.identificador) {
              errors.identificador = "Este campo es obligatorio";
            } else {
              //Validar si cumple con los requerimientos
              if (!expresion.user.test(values.identificador)) {
                errors.identificador = await "Error de directiva";
                MessageError(
                  "Nombre de usuario debe tener de 4 a 16 caracteres y solo contener letras y números"
                );
              }

              if (postedit === "post") {
                //Validar si el usuario esta en la base de datos
                const resul = await validateuser(values.identificador);
                if (resul.statusCode === 200) {
                  errors.identificador = "Ya existe este usuario";
                }
              }
            }

            if (usuario.usuario === "Administrador" && !values.Num_unidad_reg) {
              errors.Num_unidad_reg = "Este campo es obligatorio";
            }

            if (!values.passnreg) {
              errors.passnreg = "Este campo es obligatorio";
            }

            if (!values.datosgenerales) {
              errors.datosgenerales = "Este campo es obligatorio";
            } else {
              if (!expresion.fullname.test(values.datosgenerales)) {
                errors.datosgenerales = await "Error de directiva";
                MessageError(
                  "Nombre de usuario debe tener de 1 a 40 caracteres y solo contener letras"
                );
              }
            }

            if (!values.aut_NC) {
              errors.aut_NC = "Este campo es obligatorio";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            setSubmitting(false);

            //Funcion que permite guardar el nuevo registro
            if (postedit === "post") newrecord(values);
            if (postedit === "edit") updaterecord(values);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <Grid container rowSpacing={3} spacing={2}>
                <Grid item xs={4}>
                  <Field
                    component={TextField}
                    id="identificador"
                    name="identificador"
                    type="text"
                    label="Nombre de Usuario"
                    disabled={postedit === "edit"}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Field
                    component={TextField}
                    id="datosgenerales"
                    name="datosgenerales"
                    type="text"
                    label="Nombre Completo"
                  />
                </Grid>
                <Grid
                  item
                  xs={8}
                  display={
                    usuario.usuario === "Administrador" ? "block" : "none"
                  }
                >
                  <Field
                    component={Select}
                    id="Num_unidad_reg"
                    name="Num_unidad_reg"
                    label="Unidad"
                  >
                    {unidades.map((elemento) => (
                      <MenuItem value={elemento.id}>
                        {elemento.descripcionureg}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  <Field
                    component={TextField}
                    id="passnreg"
                    name="passnreg"
                    type="password"
                    label="Contraseña"
                    onKeyDown={(event) => {
                      setModifedUser(true);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  display={
                    usuario.usuario === "Administrador" ? "block" : "none"
                  }
                >
                  <Field
                    component={Select}
                    id="aut_NC"
                    name="aut_NC"
                    label="Administrador"
                    sx={{
                      width: 200,
                      height: 50,
                    }}
                  >
                    <MenuItem value="SI">SI</MenuItem>
                    <MenuItem value="NO">NO</MenuItem>
                  </Field>
                </Grid>
                <Grid
                  item
                  alignItems="center"
                  direction="row"
                  justifyContent="center"
                  xs={12}
                >
                  <div
                    // @ts-ignore
                    className="actionbutton"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      Aceptar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onClose(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}

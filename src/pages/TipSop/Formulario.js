import style from "../../styles/style";

import { Box, Modal, Grid, Button, Typography } from "@mui/material";

import { Formik, Form, Field } from "formik";

import { TextField } from "formik-mui";

import { useAuthContext } from "../../contexts/auth-context";

import { AXIOSCONST } from "../../constants";
import { BackendService } from "../../services";

export function Formulario({ open, onClose, postedit, currentrow }) {
  const { MessageError, MessageSuccess } = useAuthContext();

  //Guardar nuevo registro---------------------------------------------------------------------
  const newrecord = async (value) => {
    //Guardar un registro
    const result = await BackendService._insert(AXIOSCONST.TIPSOP, value);

    onClose(true); //Cierra el modal

    if (result.statusCode === 200) {
      MessageSuccess("Registro guardado satisfactoriamente");
    } else {
      MessageError(result.message);
    }
  };

  //Actualizar nuevo registro-----------------------------------------------------------------
  const updaterecord = async (value) => {
    const result = await BackendService._update(
      AXIOSCONST.TIPSOP + "/" + currentrow.id,
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
            Desc_tipsal: postedit === "edit" ? currentrow.Desc_tipsal : "",
          }}
          validate={(values) => {
            const errors = {};

            if (!values.Desc_tipsal) {
              errors.Desc_tipsal = "Este campo es obligatorio";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);

            //Funcion que permite guardar el nuevo registro
            if (postedit === "post") newrecord(values);
            if (postedit === "edit") updaterecord(values);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <Grid container rowSpacing={3} spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    id="Desc_tipsal"
                    name="Desc_tipsal"
                    type="text"
                    label="Descripción"
                  />
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

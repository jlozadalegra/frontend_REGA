import { useLocation, useNavigate } from "react-router-dom";

import { Typography, Grid, Paper, Button, Box } from "@mui/material";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-mui";

import { AuthService, TokenService } from "../services";
import { useAuthContext } from "../contexts/auth-context";


export default function Login() {
  const { setUsuario, MessageError } = useAuthContext();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  return (
    <Formik
      initialValues={{
        usuario: "",
        password: "",
      }}
      validate={(values) => {
        const errors = {};

        if (!values.usuario) {          
          errors.usuario = "El Usuario es requerido";
        }

        if (!values.password) {
          errors.password = "La contraseña es requerida";
        }

        return errors;
      }}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        setSubmitting(false);                

        const obtenerLogin = async () => {
          const resul = await AuthService.login(
            values.usuario,
            values.password
          );

          console.info("Resultado", resul);

          //Si el usuario y la contraseñas son correctas
          if (resul.statusCode === 200) {
            TokenService.SetUser(resul.data);
            setUsuario(resul.data);
            navigate(from, { replace: true });
          } else {
            //si el usuario es incorrecto
            if (resul.statusCode === 404)
              setFieldError("usuario", resul.message);

            //si la contraseña es incorrecta
            if (resul.statusCode === 409)
              setFieldError("password", resul.message);

            MessageError(resul.message);
          }
        };

        obtenerLogin();
      }}
    >
      {({ submitForm, isSubmitting }) => (
        <Form>
          <Grid
            container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{
              minHeight: "100vh",
              minWidth: "100vw",
              position: "fixed",
              top: 0,
              left: 0,
              display: "flex",
            }}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitForm();
              }
            }}
          >
            <Box sx={{ width: "400px" }}>
              <Paper elevation={12} sx={{ padding: 5 }}>
                <Grid item sx={{ marginBottom: 2, textAlign: "center" }}>
                  <Typography variant="body1" color="initial">
                    Inicio de Sesión
                  </Typography>
                </Grid>
                <Grid item sx={{ marginBottom: 2 }}>
                  <Field
                    component={TextField}
                    id="usuario"
                    name="usuario"
                    label="Usuario"
                    sx={{ minWidth: "320px", maxWidth: "320px" }}
                    type="text"
                  />
                </Grid>
                <Grid item sx={{ marginBottom: 2 }}>
                  <Field
                    component={TextField}
                    id="password"
                    name="password"
                    label="Contraseña"
                    sx={{ minWidth: "320px" }}
                    type="password"
                  />
                </Grid>
                <Grid item sx={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    Aceptar
                  </Button>
                </Grid>
              </Paper>
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

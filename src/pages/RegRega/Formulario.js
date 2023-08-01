import React, { useCallback, useEffect, useState } from "react";

import style from "../../styles/style";

import { Box, Modal, MenuItem, Grid, Button, Typography } from "@mui/material";

import { Formik, Form, Field } from "formik";

import { TextField, Select } from "formik-mui";

import { useAuthContext } from "../../contexts/auth-context";
import { AXIOSCONST } from "../../constants";
import { BackendService } from "../../services";

export function Formulario({ open, onClose, postedit, currentrow }) {
  const { usuario, MessageError, MessageSuccess } = useAuthContext();
  const [tipdoc, setTipDoc] = useState([]);
  const [procdest, setProcDest] = useState([]);
  const [tipsop, setTipSop] = useState([]);

  const [archivo, setArchivo] = useState({});
  const [modifiedFile, setModifiedFile] = useState(false);

  const ConfigureModal = useCallback(async () => {
    //Poblar select Clasificación de Documento
    const resultCD = await BackendService._get(AXIOSCONST.TIPDOC);

    if (resultCD.statusCode === 200) {
      setTipDoc(resultCD.data);
    } else {
      MessageError(resultCD.message);
    }

    //Poblar select Procedencia Destino
    const resultPD = await BackendService._get(AXIOSCONST.PROCDEST);

    if (resultPD.statusCode === 200) {
      setProcDest(resultPD.data);
    } else {
      MessageError(resultPD.message);
    }

    //Poblar select Tipo de Soporte
    const resultTS = await BackendService._get(AXIOSCONST.TIPSOP);

    if (resultTS.statusCode === 200) {
      setTipSop(resultTS.data);
    } else {
      MessageError(resultTS.message);
    }
  }, [MessageError]);

  //llamar a inincio del modal
  useEffect(() => {
    if (open === true) {
      ConfigureModal();
    }
  }, [open, ConfigureModal]);

  //Reiniciar las variables de entorno
  const reset = () => {
    setArchivo({});
    setModifiedFile(false);
  };

  //Obtener llave de Clasificación
  const keyTipDoc = async (Co_tdoc) => {
    const key = await BackendService._get(AXIOSCONST.TIPDOC + "/" + Co_tdoc);

    return key.data.Co_docu;
  };

  //Obtener consecutivo del REGA
  const nextCod = async (year) => {
    const cod = await BackendService._get(
      AXIOSCONST.CONSECUTIVO + "/" + usuario.idUnidad + "/" + year
    );

    return cod;
  };

  //Generar nombre de Archivo
  const newNameFile = (tipdoc, consec, year) => {
    return archivo.archivonombre === undefined
      ? ""
      : tipdoc +
          "." +
          usuario.keyUnidad +
          "." +
          consec +
          "." +
          String(year).slice(-2) +
          ".pdf";
  };

  //Guardar nuevo registro
  const newrecord = async (value) => {
    let responseFile;
    let responseInsert;

    let date = new Date(Date.now());

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const tipdoc = await keyTipDoc(value.Co_tdoc);

    const consec = await nextCod(year);

    const nameFile = newNameFile(tipdoc, consec, year);

    //crea la constante registro con el usuario y la unidad extraidos del context
    const registro = {
      ...value,
      num_reg: consec,
      fecha: String(year + "-" + month + "-" + day),
      year: String(year),
      repartir: "R",
      Co_nombre: usuario.idUsuario,
      Num_unidad_reg: usuario.idUnidad,
      file: nameFile,
    };

    responseInsert = await BackendService._insert(AXIOSCONST.REGA, registro);

    if (modifiedFile && archivo) {
      const f = new FormData();
      f.append("file", archivo.archivo, nameFile); //archivo.archivonombre);

      responseFile = await BackendService._insert(AXIOSCONST.UPLOAD, f);
    }

    onClose(true); //Cierra el modal

    if (responseInsert.statusCode === 200) {
      MessageSuccess("Registro guardado satisfactoriamente");
    } else {
      MessageError(responseInsert.message);
    }

    if (responseFile.statusCode === 200) {
      setTimeout(function () {
        MessageSuccess(responseFile.message);
      }, 500);
    } else {
      MessageError(responseFile.message);
    }

    reset();
  };

  //Actualizar nuevo registro
  const updaterecord = async (value) => {
    let responseFile;
    let responseUpdate;

    const nameFile =
      currentrow.Co_tdoc.Co_docu +
      "." +
      currentrow.Num_unidad_reg.Num_unidad_reg +
      "." +
      currentrow.num_reg +
      "." +
      currentrow.year.slice(-2) +
      ".pdf";

    const registro = { ...value, file: nameFile };

    responseUpdate = await BackendService._update(
      AXIOSCONST.REGA + "/" + currentrow.Co_reg,
      registro
    );

    if (modifiedFile && archivo) {
      let fupdate = new FormData();
      await fupdate.append("file", archivo.archivo, nameFile); //archivo.archivonombre);

      responseFile = await BackendService._insert(AXIOSCONST.UPLOAD, fupdate);
    }

    onClose(true); //Cierra el modal

    if (responseUpdate.statusCode === 200) {
      MessageSuccess("Registro actualizado satisfactoriamente");
    } else {
      MessageError(responseUpdate.message);
    }

    if (responseFile.statusCode === 200) {
      setTimeout(function () {
        MessageSuccess(responseFile.message);
      }, 500);
    } else {
      MessageError(responseFile.message);
    }

    reset();
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
            numejemp: postedit === "edit" ? currentrow.numejemp : "",
            ent_sal: postedit === "edit" ? currentrow.ent_sal : "",
            Co_tdoc: postedit === "edit" ? currentrow.Co_tdoc.id : "",
            Co_pdest: postedit === "edit" ? currentrow.Co_pdest.id : "",
            Co_tipsal: postedit === "edit" ? currentrow.Co_tipsal.id : "",
            denomindoc: postedit === "edit" ? currentrow.denomindoc : "",
          }}
          validate={(values) => {
            const errors = {};

            if (!values.numejemp) {
              errors.numejemp = "Required";
            }

            if (!values.ent_sal) {
              errors.ent_sal = "Required";
            }

            if (!values.Co_tdoc) {
              errors.Co_tdoc = "Required";
            }

            if (!values.Co_pdest) {
              errors.Co_pdest = "Required";
            }

            if (!values.Co_tipsal) {
              errors.Co_tipsal = "Required";
            }

            if (!values.denomindoc) {
              errors.denomindoc = "Required";
            }

            var extPermitidas = /(.pdf)$/i;

            if (archivo.archivonombre !== undefined) {
              if (!extPermitidas.exec(archivo.archivonombre)) {
                errors.upload = "Solo seleccionar archivos PDF";
              }
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);

            values.Co_tdoc = parseInt(values.Co_tdoc);
            values.Co_pdest = parseInt(values.Co_pdest);
            values.Co_tipsal = parseInt(values.Co_tipsal);

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
                    component={Select}
                    id="ent_sal"
                    name="ent_sal"
                    labelId="lbles"
                    label="Entrada/Salida"
                  >
                    <MenuItem value="R/E">Registro de Entrada</MenuItem>
                    <MenuItem value="R/S">Registro de Salida</MenuItem>
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  <Field
                    component={TextField}
                    id="numejemp"
                    name="numejemp"
                    type="number"
                    label="Número de Ejemplares"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    component={Select}
                    id="Co_tipsal"
                    name="Co_tipsal"
                    labelId="lblts"
                    label="Tipo de Soporte"
                  >
                    {tipsop.map((elemento) => (
                      <MenuItem value={elemento.id}>
                        {elemento.Desc_tipsal}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field
                    component={Select}
                    id="Co_tdoc"
                    name="Co_tdoc"
                    labelId="lbltd"
                    label="Clasificación"
                  >
                    {tipdoc.map((elemento) => (
                      <MenuItem value={elemento.id}>
                        {elemento.Desc_docu}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field
                    component={Select}
                    id="Co_pdest"
                    name="Co_pdest"
                    labelId="lblpd"
                    label="Procedencia o Destino"
                  >
                    {procdest.map((elemento) => (
                      <MenuItem value={elemento.id}>
                        {elemento.descripcionpdest}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    id="denomindoc"
                    name="denomindoc"
                    type="text"
                    label="Descripción"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    id="upload"
                    name="upload"
                    type="file"
                    variant="standard"
                    inputProps={{
                      accept: ".pdf",
                    }}
                    sx={{
                      width: "500px",
                    }}
                    onChange={async (e) => {
                      e.preventDefault();
                      setModifiedFile(true);

                      await setArchivo({
                        archivo: e.target.files[0],
                        archivonombre: e.target.files[0].name,
                      });
                    }}
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
                        reset();
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

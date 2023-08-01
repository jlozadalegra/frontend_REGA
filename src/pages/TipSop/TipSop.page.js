import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth-context";

import { Typography } from "@mui/material";

import messageAlert from "../../components/messageAlert";
import CustomTable from "../../components/customTable";
import columnas from "./columnas";
import { Formulario } from "./Formulario";

import { AXIOSCONST } from "../../constants";
import { BackendService } from "../../services";

function TipSop() {
  const { MessageError, MessageSuccess } = useAuthContext();

  const [dataTable, setDataTable] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [open, setOpen] = useState(false);
  const [postedit, setPostEdit] = useState("post");
  const [currentrow, setCurrentRow] = useState([]);
  const [edited, setEdited] = useState(true);

  //Función para cerrar el modal
  const CloseModal = async (data) => {
    setEdited(data);
    setOpen(false);
  };

  //-----------------------------------------------------------------------------------------
  useEffect(() => {
    //Obtener Tipo e Soporte-----------------------------------------------------------------
    const Obtener = async () => {
      setCargando(true);

      const result = await BackendService._get(AXIOSCONST.TIPSOP);

      //Poner mensaje de error de producirce
      if (result.statusCode === 200) {
        await setDataTable(result.data);
        MessageError(null);
      } else {
        MessageError(result);
      }

      setTimeout(() => {
        setCargando(false);
      }, 500);
    };

    if (!open && edited) Obtener();
    // eslint-disable-next-line
  }, [open]);

  //Eliminar un registro-----------------------------------------------------------------------
  const handleClickDelete = async (row) => {
    messageAlert().then(async (result) => {
      if (result.isConfirmed) {
        const result1 = await BackendService._delete(
          AXIOSCONST.TIPSOP + "/" + row.original.id
        );

        if (result1.statusCode === 200) {
          dataTable.splice(row.index, 1);
          setDataTable([...dataTable]);

          MessageSuccess("Registro eliminado satisfactoriamente");
        } else {
          MessageError(result1.message);
        }
      }
    });
  };

  //------------------------------------------------
  return (
    <>
      <Formulario
        open={open}
        onClose={CloseModal}
        postedit={postedit}
        currentrow={currentrow}
      />

      <Typography variant="h4" color="initial" sx={{ ml: 2 }}>
        Tipo de Soporte de Entra o Salida
      </Typography>

      <CustomTable
        columnas={columnas}
        dataTable={dataTable}
        setPostEdit={setPostEdit}
        setOpen={setOpen}
        setCurrentRow={setCurrentRow}
        handleClickDelete={handleClickDelete}
        state={{
          isLoading: cargando,
        }}
      />
    </>
  );
}

export default TipSop;

import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth-context";

import { Typography } from "@mui/material";

import columnas from "./columnas";
import { Formulario } from "./Formulario";

import messageAlert from "../../components/messageAlert";
import CustomTable from "../../components/customTable";
import { AXIOSCONST } from "../../constants";
import { BackendService } from "../../services";

function Units() {
  const { MessageSuccess, MessageError } = useAuthContext();

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

  //Obtener Unidades-------------------------------------------
  const ObtenerUnidades = async () => {
    setCargando(true);

    const result = await BackendService._get(AXIOSCONST.UNITS);

    //Poner mensaje de error de producirce
    if (result.statusCode === 200) {
      await setDataTable(result.data);
      
    } else {
      MessageError(result.message);
    }

    setTimeout(() => {
      setCargando(false);
    }, 500);
  };

  //------------------------------------------------
  useEffect(() => {
    if (!open && edited) ObtenerUnidades();
    // eslint-disable-next-line
  }, [open]);

  //Eliminar un registro----------------------------
  const handleClickDelete = async (row) => {
    messageAlert().then(async (result) => {
      if (result.isConfirmed) {
        

        const result = await BackendService._delete(
          AXIOSCONST.UNITS + "/" + row.original.id
        );

        if (result.statusCode === 200) {
          dataTable.splice(row.index, 1);
          setDataTable([...dataTable]);

          MessageSuccess("Registro eliminado satisfactoriamente");
        } else {
          MessageError(result.message);
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
        Unidades o Departamentos
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

export default Units;

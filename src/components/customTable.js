import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import { useAuthContext } from "../contexts/auth-context";

export default function CustomTable({
  columnas,
  dataTable,
  setPostEdit,
  setOpen,
  setCurrentRow,
  handleClickDelete,
  state,
}) {
  const { usuario } = useAuthContext();

  //Accion boton Nuevo registro-------------------------------------------------------------
  const handleClickInsert = () => {
    setPostEdit("post");
    setOpen(true);
  };

  //Accion del Boton Update-----------------------------------------------------------------
  const handleClickUpdate = (row) => {
    setPostEdit("edit");
    setOpen(true);
    setCurrentRow(row.original);
  };

  return (
    <MaterialReactTable
      displayColumnDefOptions={{
        "mrt-row-actions": {
          muiTableHeadCellProps: {
            align: "center",
          },
          size: 10,
        },
      }}
      columns={columnas}
      data={dataTable}
      enableColumnOrdering
      localization={MRT_Localization_ES}
      enableStickyHeader
      enableRowActions
      renderRowActions={({ row }) =>
        row.original.Co_nombre &&
        (row.original.Co_nombre.id !== usuario.idUsuario &&
          usuario.admin === "NO") ? null : (
          <Box width='1px' sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Actualizar">
              <IconButton
                color="success"
                onClick={() => handleClickUpdate(row)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Eliminar">
              <IconButton color="error" onClick={() => handleClickDelete(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
      renderTopToolbarCustomActions={() => (
        <Button
          color="secondary"
          onClick={handleClickInsert}
          variant="contained"
        >
          Crear Nuevo Registro
        </Button>
      )}
      state={state}
    />
  );
}

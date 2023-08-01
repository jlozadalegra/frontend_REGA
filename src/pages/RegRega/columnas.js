import { FileDownload, Visibility } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import axios from "../../api/axios";
import fileDownload from "js-file-download";

const columnas = [
  {
    id: "Archivo",
    header: "Archivo",
    footer: "Archivo",
    columnDefType: "display", //turns off data column features like sorting, filtering, etc.
    enableColumnOrdering: true,
    size: 80,
    Cell: ({ row }) =>
      row.original.file !== "" ? (
        <div>
          <Tooltip arrow placement="top" title="Mostrar PDF">
            <IconButton
              color="primary"
              onClick={() => {                
                const url = "http://10.0.1.115:8300/file/" + row.original.file;                

                /*
                <PDFDownloadLink
                  document={url}
                  fileName={row.original.file}
                ></PDFDownloadLink>;
*/

                //fileDownload("http://10.0.1.115:8300/file", row.original.file);

                
                 var a = document.createElement("a");

                a.href = url;

                a.target = "_blank";

                a.rel = "noreferrer";

                a.download = row.original.file;

                document.body.appendChild(a);

                a.click();
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="top" title="Descargar PDF">
            <IconButton
              color="primary"
              onClick={() => {
                axios({
                  url: "http://10.0.1.115:8300/file/" + row.original.file,
                  method: "GET",
                  responseType: "blob",
                  headers: {
                    "Content-Type": "application/pdf",
                  },
                }).then((response) => {

                  fileDownload(response.data, row.original.file)

                  /*
                  var fileURL = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  var fileLink = document.createElement("a");

                  fileLink.href = fileURL;

                  fileLink.download = row.original.file;

                  document.body.appendChild(fileLink);

                  fileLink.click();
                  */
                });
              }}
            >
              <FileDownload />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        ""
      ),
  },
  {
    accessorFn: (row) =>
      row.ent_sal === "R/E"
        ? (row.Co_tdoc !== null ? row.Co_tdoc.Co_docu : "-") +
          "." +
          row.Num_unidad_reg.Num_unidad_reg +
          "." +
          row.num_reg +
          "." +
          row.year.slice(-2)
        : "",
    header: "R/E",
    muiTableHeadCellProps: {
      align: "center",
    },
    enableColumnOrdering: false,
    enableEditing: false, //disable editing on this column
    enableSorting: false,
    size: 80,
    footer: "R/S",
  },
  {
    accessorFn: (row) =>
      row.ent_sal === "R/S"
        ? (row.Co_tdoc !== null ? row.Co_tdoc.Co_docu : "-") +
          "." +
          row.Num_unidad_reg.Num_unidad_reg +
          "." +
          row.num_reg +
          "." +
          row.year.slice(-2)
        : "",
    header: "R/S",
    muiTableHeadCellProps: {
      align: "center",
    },
    enableColumnOrdering: false,
    enableEditing: false, //disable editing on this column
    enableSorting: false,
    size: 80,
    footer: "R/S",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    footer: "Fecha",
    size: 20,
  },
  {
    accessorKey: "denomindoc",
    header: "Clasificación",
    footer: "Clasificación",
    size: 300,
  },
  {
    accessorFn: (row) =>
      row.ent_sal === "R/E"
        ? row.Co_pdest !== null
          ? row.Co_pdest.descripcionpdest
          : "-"
        : "",
    header: "Procedencia",
    footer: "Procedencia",
  },
  {
    accessorFn: (row) =>
      row.ent_sal === "R/S"
        ? row.Co_pdest !== null
          ? row.Co_pdest.descripcionpdest
          : "-"
        : "",
    header: "Destino",
    footer: "Destino",
  },
  {
    accessorKey: "numejemp",
    header: "Ejemplares",
    footer: "Ejemplares",
    size: 50,
  },
  {
    accessorKey: "Co_tipsal.Desc_tipsal",
    header: "Tipo Salida",
    footer: "Tipo Salida",
  },
  {
    accessorKey: "Co_nombre.datosgenerales",
    header: "Tramitado",
    footer: "Tramitado",
    size: 200,
  },
];

export default columnas;

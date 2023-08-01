import Swal from "sweetalert2";

export default function messageAlert() {
  return Swal.fire({
    title: "¿Esta seguro?",
    text: "¡Esta acción no se puede deshacer!",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "¡Si, eliminarlo!",
  });
}

import Swal from "sweetalert2";

export const sweetAlert = (title) => {
  return Swal.fire({
    title: title,
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  });
};

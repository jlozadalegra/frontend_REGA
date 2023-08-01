import { Typography } from "@mui/material";

function Unauthorized() {
  return (
    <section>
      <Typography variant="h4" color="initial" sx={{ ml: 2 }}>
        No Autorizado
      </Typography>
      <br />
      <p>No tiene autorización para consultar esta página.</p>
    </section>
  );
}

export default Unauthorized;

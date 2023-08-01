import * as React from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useAuthContext } from "../contexts/auth-context";

function MyMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const { msgError, msgSuccess } = useAuthContext();

  React.useEffect(() => {    
    msgError && enqueueSnackbar(msgError, { variant: "error" });
    msgSuccess && enqueueSnackbar(msgSuccess, { variant: "success" });
  }, [msgError, msgSuccess, enqueueSnackbar]);

  return <></>;
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyMessage />
    </SnackbarProvider>
  );
}

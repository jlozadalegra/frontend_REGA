import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/auth-context";

const RequireAuth = ({ allowedRoles }) => {
  const { usuario } = useAuthContext();
  const location = useLocation();

  if (usuario) {
    if (usuario.usuario === "Administrador") {
      return <Outlet />;
    } else {
      if (allowedRoles?.includes(usuario.admin)) {
        return <Outlet />;
      } else {
        return (
          <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
      }
    }
  } else return <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;

import React from "react";

import { Link as LinkRouter } from "react-router-dom";

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Link,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import {
  AccountCircle,
  Person,
  Business,
  Password,
  Logout,
} from "@mui/icons-material";

import { useAuthContext } from "../contexts/auth-context";
import TokenService from "../services/token.service";
import MenuAdmin from "./MenuAdmin";

export default function Head() {
  const { usuario, setUsuario } = useAuthContext();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickLogup = (e) => {
    e.preventDefault();
    handleClose();
    TokenService.RemoveUser();
    setUsuario(null);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <IconButton aria-label="menu" color="inherit">
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1, display: "flex" }}>
                <Typography
                  sx={{
                    mr: 2,
                    display: { xs: "block", sm: "flex", md: "flex" },
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  <Box className="boxlink">
                    <Link
                      component={LinkRouter}
                      to="/"
                      color="inherit"
                      underline="hover"
                      variant="h6"
                    >
                      Inicio
                    </Link>
                  </Box>
                  <Box className="boxlink">
                    <Link
                      component={LinkRouter}
                      to="/rega"
                      color="inherit"
                      underline="hover"
                      variant="h6"
                    >
                      Rega
                    </Link>
                  </Box>

                  <Box
                    className="boxlink"
                    display={
                      usuario.admin === "SI" ||
                      usuario.usuario === "Administrador"
                        ? "block"
                        : "none"
                    }
                  >
                    <MenuAdmin />
                  </Box>
                </Typography>
              </Box>

              <Box sx={{ flexGrow: 0, display: "inline-flex" }}>
                <IconButton aria-label="acount" onClick={handleClick}>
                  <AccountCircle sx={{ color: "white" }} />
                </IconButton>
                <Menu
                  id="MenuUsers"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem>
                    <Person sx={{ mr: 2 }} /> {usuario.usuario}
                  </MenuItem>
                  <MenuItem>
                    <Business sx={{ mr: 2 }} /> {usuario.unidad}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>
                    <Password sx={{ mr: 2 }} /> Cambiar Contraseña
                  </MenuItem>
                  <MenuItem onClick={handleClickLogup}>
                    <Logout sx={{ mr: 2 }} /> Cerrar Sesión
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </div>
  );
}

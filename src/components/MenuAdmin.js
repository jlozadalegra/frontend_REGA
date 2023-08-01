import { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Link from "@mui/material/Link";

import { useNavigate } from "react-router-dom";

export default function MenuAdmin() {
  const [state, setState] = useState(false);

  const direction = "left";

  const menuadmin = [
    { id: 0, name: "Unidades o Departamentos", path: "/units" },    
    { id: 1, name: "Procedencia o Destino", path: "/procdest" },
    { id: 2, name: "Clasificación de Documentos", path: "/tipdoc" },
    { id: 3, name: "Tipo de Soporte", path: "/tipsop" },    
    { id: 4, name: "Usuarios", path: "/users" },
  ];

  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuadmin.map(({ id, name, path }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton
              onClick={() => {
                toggleDrawer(false);
                navigate(path, { replace: false });
              }}
            >
              <ListItemIcon>
                {id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Link
        component="button"
        onClick={toggleDrawer(true)}
        color="inherit"
        underline="hover"
        
        variant='h6'
      >
        Administrar
      </Link>

      <Fragment key={direction}>
        <Drawer anchor={direction} open={state} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </Fragment>
    </div>
  );
}

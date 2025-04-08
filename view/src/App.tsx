import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "./store/store";
import { logout } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ItemList from "./pages/item/List";
import ItemDetail from "./pages/item/Detail";
import CreateItem from "./pages/item/Create";
import ItemEdit from "./pages/item/Edit";
import CreateContact from "./pages/contact/Create";
import ContactList from "./pages/contact/List";
import ContactDetail from "./pages/contact/Detail";

import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ContactsIcon from "@mui/icons-material/Contacts";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 240;

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const tokens = useSelector((state: AppState) => state.auth.tokens);
  return tokens ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tokens = useSelector((state: AppState) => state.auth.tokens);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  if (!tokens) {
    return <Typography>Please log in to view the dashboard.</Typography>;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/items">
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Items" />
        </ListItemButton>
        <ListItemButton component={Link} to="/contacts">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ bgcolor: "white" }} className="justify-between">
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{color:'primary.dark'}} variant="h6" noWrap>
            Maintenance System
          </Typography>
          <Button
            className="mt-4 "
            variant="contained"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Temporary drawer for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better mobile performance
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Persistent drawer for desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Offset for AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/items"
        element={
          <PrivateRoute>
            <AppLayout>
              <ItemList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/items/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateItem />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/item/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ItemDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/item/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ItemEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <PrivateRoute>
            <AppLayout>
              <ContactList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/contacts/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateContact />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/contact/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ContactDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;

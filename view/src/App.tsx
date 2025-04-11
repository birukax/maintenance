import React, { useState, useEffect } from "react";
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
import ContactEdit from "./pages/contact/Edit";

import InventoryList from "./pages/inventory/List";

import PurchaseApprovalList from "./pages/approval/purchase/List";

import CreateUnitOfMeasure from "./pages/unitOfMeasure/Create";
import UnitOfMeasureList from "./pages/unitOfMeasure/List";
import UnitOfMeasureDetail from "./pages/unitOfMeasure/Detail";
import UnitOfMeasureEdit from "./pages/unitOfMeasure/Edit";

import CreatePurchaseSchedule from "./pages/purchaseSchedule/Create";
import PurchaseScheduleList from "./pages/purchaseSchedule/List";
import PurchaseScheduleDetail from "./pages/purchaseSchedule/Detail";
import PurchaseScheduleEdit from "./pages/purchaseSchedule/Edit";

import CreatePurchaseRequest from "./pages/purchaseRequest/Create";
import PurchaseRequestList from "./pages/purchaseRequest/List";
import PurchaseRequestDetail from "./pages/purchaseRequest/Detail";

import CreateConsumption from "./pages/consumption/Create";
import ConsumptionList from "./pages/consumption/List";
import ConsumptionDetail from "./pages/consumption/Detail";
import ConsumptionEdit from "./pages/consumption/Edit";

import CreateReturn from "./pages/return/Create";
import ReturnList from "./pages/return/List";
import ReturnDetail from "./pages/return/Detail";
import ReturnEdit from "./pages/return/Edit";

import CreateLocation from "./pages/location/Create";
import LocationList from "./pages/location/List";
import LocationDetail from "./pages/location/Detail";
import LocationEdit from "./pages/location/Edit";


import CreateMachine from "./pages/machine/Create";
import MachineList from "./pages/machine/List";
import MachineDetail from "./pages/machine/Detail";
import MachineEdit from "./pages/location/Edit";

import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Drawer,
  List,
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

  useEffect(() => {
    if (!tokens) {
      navigate("/login");
    }
  }, [tokens, navigate]);

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
        <ListItemButton component={Link} to="/unit-of-measures/">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Unit of Measures" />
        </ListItemButton>
        <ListItemButton component={Link} to="/inventories">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItemButton>
        <ListItemButton component={Link} to="/purchase-schedules">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Purchase Schedule" />
        </ListItemButton>
        <ListItemButton component={Link} to="/purchase-requests">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Purchase Request" />
        </ListItemButton>
        <ListItemButton component={Link} to="/purchase-approvals">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Purchase Approval" />
        </ListItemButton>
        <ListItemButton component={Link} to="/consumptions">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Consumption" />
        </ListItemButton>
        <ListItemButton component={Link} to="/returns">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Return" />
        </ListItemButton>
        <ListItemButton component={Link} to="/locations">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Location" />
        </ListItemButton>
        <ListItemButton component={Link} to="/machines">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Machine" />
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
          <Typography sx={{ color: "primary.dark" }} variant="h6" noWrap>
            Maintenance System
          </Typography>
          <Button className="mt-4 " variant="contained" onClick={handleLogout}>
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
        path="/item/create"
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
        path="/contact/create"
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
      <Route
        path="/contact/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ContactEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/unit-of-measures"
        element={
          <PrivateRoute>
            <AppLayout>
              <UnitOfMeasureList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/unit-of-measure/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateUnitOfMeasure />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/unit-of-measure/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <UnitOfMeasureDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/unit-of-measure/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <UnitOfMeasureEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/inventories"
        element={
          <PrivateRoute>
            <AppLayout>
              <InventoryList />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/purchase-approvals"
        element={
          <PrivateRoute>
            <AppLayout>
              <PurchaseApprovalList />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/purchase-schedules"
        element={
          <PrivateRoute>
            <AppLayout>
              <PurchaseScheduleList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/purchase-schedule/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreatePurchaseSchedule />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/purchase-schedule/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <PurchaseScheduleDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/purchase-schedule/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <PurchaseScheduleEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/purchase-requests"
        element={
          <PrivateRoute>
            <AppLayout>
              <PurchaseRequestList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/purchase-request/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreatePurchaseRequest />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/purchase-request/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <PurchaseRequestDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/consumptions"
        element={
          <PrivateRoute>
            <AppLayout>
              <ConsumptionList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/consumption/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateConsumption />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/consumption/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ConsumptionDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/consumption/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ConsumptionEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/returns"
        element={
          <PrivateRoute>
            <AppLayout>
              <ReturnList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/return/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateReturn />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/return/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ReturnDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/return/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ReturnEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/locations"
        element={
          <PrivateRoute>
            <AppLayout>
              <LocationList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/location/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateLocation />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/location/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <LocationDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/location/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <LocationEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/machines"
        element={
          <PrivateRoute>
            <AppLayout>
              <MachineList />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/machine/create"
        element={
          <PrivateRoute>
            <AppLayout>
              <CreateMachine />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/machine/detail/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <MachineDetail />
            </AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/machine/edit/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <MachineEdit />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;

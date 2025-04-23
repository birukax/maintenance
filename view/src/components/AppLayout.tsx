import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { ToastContainer } from 'react-toastify';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from "../assets/Images/logo.png"
const drawerWidth = 240;

const AppLayout = ({ children }) => {
  const tokens = useSelector((state: AppState) => state.auth.tokens);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!tokens) {
      navigate("/login", { replace: true });
    }
  }, [tokens, navigate]);

  useEffect(() => {
    sessionStorage.setItem("previousRoute", location.pathname);
  }, [navigate]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  const drawer = (
    <div>
      <div className="logo" onClick={() => navigate("/dashboard")}>
        <img src={Logo} alt="qualabels logo" width="80px" title="qualabels manufacturers plc logo"/>
      </div>
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
        <ListItemButton component={Link} to="/unit-of-measures">
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
        <ListItemButton component={Link} to="/equipments">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Equipment" />
        </ListItemButton>
        <ListItemButton component={Link} to="/activities">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Activity" />
        </ListItemButton>
        <ListItemButton component={Link} to="/work-order-types">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Work Order Type" />
        </ListItemButton>
        <ListItemButton component={Link} to="/activity-types">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Activity Type" />
        </ListItemButton>
        <ListItemButton component={Link} to="/work-orders">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Work Order" />
        </ListItemButton>
        <ListItemButton component={Link} to="/schedules">
          <ListItemIcon>
            <ContactsIcon />
          </ListItemIcon>
          <ListItemText primary="Schedule" />
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
          <Button className="mt-4" variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
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
          mt: 8,
        }}
      >
        <div className="navigate-back">
          <div className="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon sx={{fontSize:32,fill:"#5d4037"}}/>
          </div>

        </div>
      <ToastContainer/>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;

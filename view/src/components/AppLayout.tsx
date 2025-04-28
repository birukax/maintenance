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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';

const drawerWidth = 240;

const AppLayout = ({ children }) => {
  const [openSections, setOpenSections] = useState({
    inventory: false,
    purchase: false,
    maintenance: false,
    consumption: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
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
      {/* <div className="logo" onClick={() => navigate("/dashboard")}>
        <img src={Logo} alt="qualabels logo" width="80px" title="qualabels manufacturers plc logo"/>
      </div> */}
      <Toolbar />
      <List>
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
        <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/contacts">
              <ListItemIcon>
              <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary="Contacts" />
            </ListItemButton>
        <List>
          <ListItemButton onClick={() => toggleSection("inventory")}>
        <ListItemText primary="Inventory" />
        {openSections.inventory ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          {openSections.inventory && (
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/items" sx={{ pl: 4 }}>
            <ListItemIcon>
          <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Items" />
          </ListItemButton>
          <ListItemButton component={Link} to="/inventories" sx={{ pl: 4 }}>
            <ListItemIcon>
          <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItemButton>
          <ListItemButton component={Link} to="/locations" sx={{ pl: 4 }}>
            <ListItemIcon>
          <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Location" />
          </ListItemButton>
        </List>
          )}

          <ListItemButton onClick={() => toggleSection("purchase")}>
        <ListItemText primary="Purchase" />
        {openSections.purchase ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          {openSections.purchase && (
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/purchase-schedules" sx={{ pl: 4 }}>
            <ListItemIcon>
          < CalendarMonthIcon/>
            </ListItemIcon>
            <ListItemText primary="Purchase Schedule" />
          </ListItemButton>
          <ListItemButton component={Link} to="/purchase-requests" sx={{ pl: 4 }}>
            <ListItemIcon>
          <RequestPageIcon />
            </ListItemIcon>
            <ListItemText primary="Purchase Request" />
          </ListItemButton>
          <ListItemButton component={Link} to="/purchase-approvals" sx={{ pl: 4 }}>
            <ListItemIcon>
          <CheckCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Purchase Approval" />
          </ListItemButton>
        </List>
          )}

          <ListItemButton onClick={() => toggleSection("maintenance")}>
        <ListItemText primary="Maintenance" />
        {openSections.maintenance ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          {openSections.maintenance && (
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/machines" sx={{ pl: 4 }}>
            <ListItemIcon>
          <PrecisionManufacturingIcon />
            </ListItemIcon>
            <ListItemText primary="Machine" />
          </ListItemButton>
          <ListItemButton component={Link} to="/equipments" sx={{ pl: 4 }}>
            <ListItemIcon>
          <HomeRepairServiceIcon />
            </ListItemIcon>
            <ListItemText primary="Equipment" />
          </ListItemButton>
          <ListItemButton component={Link} to="/units-of-measures" sx={{ pl: 4 }}>
              <ListItemIcon>
              <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary="Unit of Measures" />
            </ListItemButton>
          <ListItemButton component={Link} to="/activities" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Activity" />
          </ListItemButton>
          <ListItemButton component={Link} to="/work-order-types" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Work Order Type" />
          </ListItemButton>
          <ListItemButton component={Link} to="/activity-types" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Activity Type" />
          </ListItemButton>
          <ListItemButton component={Link} to="/work-orders" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Work Order" />
          </ListItemButton>
          <ListItemButton component={Link} to="/schedules" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Schedule" />
          </ListItemButton>
          <ListItemButton component={Link} to="/breakdowns" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Breakdown" />
          </ListItemButton>
        </List>
          )}
            
            
          <ListItemButton onClick={() => toggleSection("consumption")}>
        <ListItemText primary="Consumption" />
        {openSections.consumption ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          {openSections.consumption && (
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/consumptions" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Consumption" />
          </ListItemButton>
          <ListItemButton component={Link} to="/returns" sx={{ pl: 4 }}>
            <ListItemIcon>
          <ContactsIcon />
            </ListItemIcon>
            <ListItemText primary="Return" />
          </ListItemButton>
        </List>
          )}
        </List>
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
          <Typography sx={{ color: "primary.dark",display:"flex",alignItems:"center",justifyContent:"center",gap:".5rem" }} variant="h6" noWrap>
          <div className="navigate-back">
          <div className="back" onClick={() => navigate(-1)}>
          <ArrowBackIcon sx={{fontSize:32,fill:"#5d4037"}}/>
          </div>

        </div>
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
        
      <ToastContainer/>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;

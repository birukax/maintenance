import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../store/store";
import {
  useNavigate,
  useLocation,
  Link,
  useSearchParams,
} from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { ToastContainer } from "react-toastify";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Logo from "../assets/Images/logo.png";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import ScaleIcon from "@mui/icons-material/Scale";
import EngineeringIcon from "@mui/icons-material/Engineering";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import HardwareIcon from "@mui/icons-material/Hardware";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import UndoIcon from "@mui/icons-material/Undo";
import ConstructionIcon from "@mui/icons-material/Construction";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import FactoryIcon from "@mui/icons-material/Factory";
import AreaChartIcon from "@mui/icons-material/AreaChart";
import PersonIcon from "@mui/icons-material/Person";
import { jwtDecode } from "jwt-decode";
import TableChartIcon from "@mui/icons-material/TableChart";
import ArchiveIcon from "@mui/icons-material/Archive";
import TableRowsIcon from "@mui/icons-material/TableRows";
import PlaceIcon from "@mui/icons-material/Place";
const drawerWidth = 260;

const AppLayout = ({ children }) => {
  const [openSections, setOpenSections] = useState({
    inventory: false,
    purchase: false,
    maintenance: false,
    consumption: false,
    location: false,
    shelf: false,
  });
  const [searchParams, setSearchParams] = useSearchParams();
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
  const user = tokens?.access ? jwtDecode(tokens.access) : null;
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
    <div style={{ minWidth: "fit-content" }} className="sidebar">
      {/* <div className="logo" onClick={() => navigate("/dashboard")}>
        <img src={Logo} alt="qualabels logo" width="80px" title="qualabels manufacturers plc logo"/>
      </div> */}
      <Toolbar sx={{ minWidth: "fit-content" }} />
      <List sx={{ minWidth: "fit-content" }}>
        <ListItemButton component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={Link} to="/contacts">
          <ListItemIcon>
            <ContactsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItemButton>

        <ListItemButton onClick={() => toggleSection("shelf")}>
          <ListItemText primary="Shelf" />
          {openSections.shelf ? (
            <ExpandLessIcon color="primary" />
          ) : (
            <ExpandMoreIcon color="primary" />
          )}
        </ListItemButton>
        {openSections.shelf && (
          <List
            component="div"
            disablePadding
            sx={{ minWidth: "fit-content" }}
          >
            <ListItemButton component={Link} to="/shelves" sx={{ pl: 4 }}>
              <ListItemIcon>
                <TableChartIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Shelf" />
            </ListItemButton>
            <ListItemButton component={Link} to="/shelf-rows" sx={{ pl: 4 }}>
              <ListItemIcon>
                <TableRowsIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Shelf Row" />
            </ListItemButton>
            <ListItemButton component={Link} to="/shelf-boxes" sx={{ pl: 4 }}>
              <ListItemIcon>
                <ArchiveIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Shelf Box" />
            </ListItemButton>
          </List>
        )}


        <List>
          <ListItemButton onClick={() => toggleSection("inventory")}>
            <ListItemText primary="Inventory" />
            {openSections.inventory ? (
              <ExpandLessIcon color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}
          </ListItemButton>
          {openSections.inventory && (
            <List
              component="div"
              disablePadding
              sx={{ minWidth: "fit-content" }}
            >
              <ListItemButton component={Link} to="/items" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CategoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Items" />
              </ListItemButton>
              <ListItemButton component={Link} to="/inventories" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <InventoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItemButton>
              <ListItemButton component={Link} to="/locations" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PlaceIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Location"
                  sx={{ minWidth: "fit-content" }}
                />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/unit-of-measures"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <ScaleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Unit of Measures"
                  sx={{ minWidth: "fit-content" }}
                />
              </ListItemButton>
              <ListItemButton component={Link} to="/transfers" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <UndoIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Transfer" />
              </ListItemButton>
              {/* <ListItemButton component={Link} to="/consumptions" sx={{ pl: 4 }} >
                <ListItemIcon>
                  <LocalShippingIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Consumption" />
              </ListItemButton>
              <ListItemButton component={Link} to="/returns" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <UndoIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Return" />
              </ListItemButton> */}
            </List>
          )}

          <ListItemButton onClick={() => toggleSection("purchase")}>
            <ListItemText primary="Purchase" />
            {openSections.purchase ? (
              <ExpandLessIcon color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}
          </ListItemButton>
          {openSections.purchase && (
            <List
              component="div"
              disablePadding
              sx={{ minWidth: "fit-content" }}
            >
              {
                <ListItemButton
                  component={Link}
                  to={"/purchase-schedules"}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <CalendarMonthIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Purchase Schedule"
                    sx={{ minWidth: "fit-content" }}
                  />
                </ListItemButton>
              }

              <ListItemButton
                component={Link}
                to="/purchase-requests"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <RequestPageIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Purchase Request" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/purchase-approvals"
                sx={{ pl: 4, minWidth: "fit-content" }}
              >
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Purchase Approval"
                  sx={{ minWidth: "fit-content" }}
                />
              </ListItemButton>
            </List>
          )}

          <ListItemButton onClick={() => toggleSection("maintenance")}>
            <ListItemText primary="Maintenance" />
            {openSections.maintenance ? (
              <ExpandLessIcon color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}
          </ListItemButton>
          {openSections.maintenance && (
            <List
              component="div"
              disablePadding
              sx={{ minWidth: "fit-content" }}
            >
              <ListItemButton component={Link} to="/machines" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PrecisionManufacturingIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Machine" />
              </ListItemButton>
              <ListItemButton component={Link} to="/equipments" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <HomeRepairServiceIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Equipment" />
              </ListItemButton>

              {/* <ListItemButton component={Link} to="/activities" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PlaylistAddCheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Activity" />
              </ListItemButton> */}

              <ListItemButton
                component={Link}
                to="/activity-types"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <ContactsIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Activity Type" />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/work-order-types"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <EngineeringIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Work Order Type"
                  sx={{ minWidth: "fit-content" }}
                />
              </ListItemButton>

              <ListItemButton component={Link} to="/work-orders" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ConstructionIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Work Order" />
              </ListItemButton>
              <ListItemButton component={Link} to="/schedules" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EditCalendarIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
              </ListItemButton>
              <ListItemButton component={Link} to="/breakdowns" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <HardwareIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Breakdown" />
              </ListItemButton>
            </List>
          )}

          <ListItemButton onClick={() => toggleSection("location")}>
            <ListItemText primary="Location" />
            {openSections.location ? (
              <ExpandLessIcon color="primary" />
            ) : (
              <ExpandMoreIcon color="primary" />
            )}
          </ListItemButton>
          {openSections.location && (
            <List
              component="div"
              disablePadding
              sx={{ minWidth: "fit-content" }}
            >
              <ListItemButton component={Link} to="/plants" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <FactoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Plant" />
              </ListItemButton>
              <ListItemButton component={Link} to="/areas" sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AreaChartIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Area" />
              </ListItemButton>
            </List>
          )}

          <ListItemButton component={Link} to="/users">
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
          <ListItemButton component={Link} to={`/profile/${user?.user_id}`}>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
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
        <Toolbar
          sx={{ bgcolor: "white", margin: 0 }}
          className="justify-between"
        >
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ padding: "0 0 0 .5rem", mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon color="primary" />
          </IconButton>
          <div
            // style={{
            //   color: "primary.dark",
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   gap: ".5rem",
            // }}
            className="title-header "
          >
            {/* <div className="navigate-back">
              <div className="back" onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: 28, fill: "secondary" }} />
              </div>
            </div> */}
            <Typography color='primary' component='h1' variant='h6' className='uppercase text-base! sm:text-xl!'>
              Maintenance System
            </Typography>
          </div>
          <Button size='medium' className="mt-4" variant="contained" onClick={handleLogout}>
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
        <ToastContainer />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;

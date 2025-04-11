// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchLocations } from "../../store/slices/locationSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  Typography,
  CircularProgress,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ListTable from "../../partials/ListTable";
import { Link } from "react-router-dom";

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const { locations } = useSelector((state: AppState) => state.location);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchLocations());
    }
  }, []);

  const handleRefresh = () => {
    dispatch(fetchLocations());
  };

  if (!tokens) {
    return <Typography>Please log in to view locations.</Typography>;
  }
  const headers = ["Code", "Name", "Action"];

  return (
    <>
      <div className="flex justify-between contacts-center">
        <Typography variant="h5" className="font-bold">
          Locations
        </Typography>
        <Button component={Link} to="/location/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={locations.loading}
        >
          Refresh
        </Button>
      </div>
      {locations.loading && <CircularProgress />}
      {locations.error && (
        <Typography variant="body2" className="text-red-500">
          {locations.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {locations.data &&
            locations.data.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.code}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/location/detail/${location.id}`}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </ListTable>
    </>
  );
};

export default List;

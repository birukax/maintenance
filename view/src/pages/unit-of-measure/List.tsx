// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchUnitOfMeasures } from "../../store/slices/unitOfMeasureSlice";
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
  const { unitOfMeasures } = useSelector(
    (state: AppState) => state.unitOfMeasure
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchUnitOfMeasures());
    }
  }, [tokens, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUnitOfMeasures());
  };

  if (!tokens) {
    return <Typography>Please log in to view Unit Of Measures.</Typography>;
  }
  const headers = ["Code", "Name", "Action"];

  return (
    <>
      <div className="flex justify-between contacts-center">
        <Typography variant="h5" className="font-bold">
          Unit Of Measures
        </Typography>
        <Button component={Link} to="/unit-of-measure/create">
          New
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={unitOfMeasures.loading}
        >
          Refresh
        </Button>
      </div>
      {unitOfMeasures.loading && <CircularProgress />}
      {unitOfMeasures.error && (
        <Typography variant="body2" className="text-red-500">
          {unitOfMeasures.error}
        </Typography>
      )}
      <ListTable headers={headers}>
        <TableBody>
          {unitOfMeasures.data &&
            unitOfMeasures.data.map((unitOfMeasure) => (
              <TableRow key={unitOfMeasure.id}>
                <TableCell>{unitOfMeasure.code}</TableCell>
                <TableCell>{unitOfMeasure.name}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/unit-of-measure/detail/${unitOfMeasure.id}`}
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

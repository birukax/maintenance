// src/pages/List.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { fetchItems } from "../../store/slices/itemSlice";
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
  const { items } = useSelector((state: AppState) => state.item);
  const dispatch = useDispatch<AppDispatch>();
  const navigte = useNavigate();

const rowStyle = {
  textTransform: "capitalize",
  fontSize: 16,
};

useEffect(() => {
  if (tokens && !items.data && !items.loading) {
    dispatch(fetchItems());
  }
}, []);

const handleRefresh = () => {
  dispatch(fetchItems());
};

if (!tokens) {
  return <Typography>Please log in to view items.</Typography>;
}
const headers = ["ID", "Name", "Type", "Category", "UoM Code", "Action"];

return (
  <>
    <div className="flex justify-between items-center">
      <Typography variant="h5" className="font-bold">
        Inventory Items
      </Typography>
      <Button component={Link} to="/item/create">
        New
      </Button>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={handleRefresh}
        disabled={items.loading}
      >
        Refresh
      </Button>
    </div>
    {items.loading && <CircularProgress />}
    {items.error && (
      <Typography variant="body2" className="text-red-500">
        {items.error}
      </Typography>
    )}
    <ListTable headers={headers}>
      <TableBody>
        {items.data &&
          items.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {" "}
                <Typography sx={rowStyle}>{item.no}</Typography>
              </TableCell>
              <TableCell>
                {" "}
                <Typography sx={rowStyle}>{item.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={rowStyle}>{item.type.toLowerCase()}</Typography>
              </TableCell>
              <TableCell>
                <Typography sx={rowStyle}>
                  {item.category.toLowerCase()}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={rowStyle}>{item.uom.name}</Typography>
              </TableCell>
              <TableCell>
                <Button component={Link} to={`/item/detail/${item.id}`}>
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

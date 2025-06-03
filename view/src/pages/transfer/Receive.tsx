// src/pages/List.tsx
import React, { useEffect,useState } from "react";
import { fetchTransfer, fetchTransfers } from "../../store/slices/transferSlice";
import { AppState,AppDispatch } from "../../store/store";
import {useSelector, useDispatch } from "react-redux";
import {useSearchParams} from "react-router-dom"
import {
  GenericListPage,
  ColumnDefination,
} from "../../components/GenericListPage";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const transferColumns = [
  { header: "Item", accessor: "item.name"},
  { header: "Requested Date", accessor: "item.requested_date"},
  { header: "Requested Quantity", accessor: "item.requested_quantity"},
  // { header: "Status", accessor: "status"},
  // { header: "From", accessor: "from_location.name"},
  // { header: "To", accessor: "to_location.name"}
];

const List: React.FC = () => {
   const { tokens } = useSelector((state: AppState) => state.auth);
      const [searchParams, setSearchParams] = useSearchParams();
      const [keyWord,setKeyWord]=useState("")
       const entityState = useEntityDetail({
          detailSelector: (state: AppState) => state.transfer.transfer,
          fetchDetailAction: fetchTransfer,
        });
        
      const dispatch = useDispatch<AppDispatch>();

        const handleRefresh = () => {
         if (tokens) {
           dispatch(fetchTransfers(params));
       }}
    
     
  return (
    <Table sx={{ minWidth: 650 }} aria-label={` table`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography noWrap>Item</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Requested Date</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Requested Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Shipped Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Receive</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entityState &&
            entityState.data.transfer_items.map((row) => (
              <TableRow>
            <TableCell>
              <Typography noWrap>{row.item.name}</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>{entityState?.data?.requested_date}</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>{row?.requested_quantity}</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>{row?.shipped_quantity}</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>
                <Button
                  variant="contained"
                  sx={{ mr: 1 }}
          >
            Receive
          </Button></Typography>
            </TableCell>
          </TableRow>
            ))}
        </TableBody>
      </Table>
  );
};

export default List;

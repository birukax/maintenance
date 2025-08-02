// src/pages/List.tsx
import React, { useState } from "react";
import { fetchTransfer, fetchTransfers } from "../../store/slices/transferSlice";
import { AppState, AppDispatch } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom"
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const List: React.FC = () => {
  const { tokens } = useSelector((state: AppState) => state.auth);
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });

  const dispatch = useDispatch<AppDispatch>();


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
          entityState.data?.transfer_items?.map((row) => (
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

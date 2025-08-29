// src/pages/List.tsx
import { FC } from "react";
import { fetchTransfer } from "../../store/slices/transferSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { type Data } from '../../store/types';


const List: FC = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });



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
          entityState.data?.transfer_items?.map((row: Data) => (
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

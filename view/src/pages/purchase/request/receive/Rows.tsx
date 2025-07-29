import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/store";

const CheckListRows = ({ row, handleFormChange, index, errorCount, setErrorCount }) => {

  const [error, setError] = useState(false);
  const errorList = errorCount

  const transfer = useSelector((state: AppState) => state.transfer.transfer)


  return (
    <TableRow key={row.id}>
      <TableCell align="left" title={row.id}>
        {row?.item?.no}
      </TableCell>
      <TableCell align="left">
        {row?.item?.name}
      </TableCell>
      <TableCell align="left">
        {row?.item?.uom?.code}
      </TableCell>
      <TableCell align="left">
        {row?.requested_quantity}
      </TableCell>
      <TableCell align="left">
        {row?.received_quantity}
      </TableCell>
      <TableCell align="left">
        {row?.row.requested_quantity - row.received_quantity}
      </TableCell>
      <TableCell align="left">
        <TextField
          size='small'
          name="quantity"
          type="number"
          required
          inputProps={{ min: 0, max: row.requested_quantity - row.received_quantity }}
          helperText={transfer.error?.quantity || ""}
          style={error ? { border: "1px solid red" } : {}}
          onChange={(e) => {
            if (Number(e.target.value) > row.requested_quantity - row.received_quantity) {
              setError(true)
              errorList[index] = true
              setErrorCount([...errorList])
            } else {
              setError(false)
              errorList[index] = false
              setErrorCount([...errorList])
              handleFormChange({
                item_id: row?.item?.id,
                quantity: e.target.value
              })
            }

          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default CheckListRows;

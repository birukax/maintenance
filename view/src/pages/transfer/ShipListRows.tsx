import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";

const CheckListRows = ({ row, handleFormChange }) => {
  const [remark, setRemark] = useState(row.remark || "");
  const [value, setValue] = useState(row.value || false);
  useEffect(() => {
    setRemark(row.remark || "");
  }, [row.remark]);
  useEffect(() => {
    setValue(row.value || "");
  }, [row.value]);
  return (
    <TableRow key={row.id}>
      <TableCell align="left" title={row.id}>
        {row?.item?.no}
      </TableCell>
      <TableCell align="left">
        {row?.item?.name}
      </TableCell>
      <TableCell align="left">
        {row?.requested_quantity}
      </TableCell>
      <TableCell align="left">
        {row?.shipped_quantity}
      </TableCell>
      <TableCell align="left">
        <TextField
          name="quantity"
          type="number"
          required
          value={remark}
          size="small"
          onChange={(e)=>{
            console.log(e.target.value);
            
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default CheckListRows;

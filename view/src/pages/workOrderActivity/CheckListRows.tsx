import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";

const CheckListRows = ({ row, handleUpdateActivity }) => {
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
      <TableCell align="left">
        {row.activity.name} - {row.activity.code}
      </TableCell>
      <TableCell align="left">
        <Checkbox
          checked={value}
          onChange={(event) => {
            setValue(event.target.checked);
            handleUpdateActivity(row.id, "value", event.target.checked);
          }}
          name="value"
          sx={{ transform: "scale(1.5)" }}
        />
      </TableCell>
      <TableCell align="left">
        <TextField
          name="remark"
          value={remark}
          onChange={(event) => setRemark(event.target.value)}
          onBlur={() => {
            if (remark !== row.remark) {
              handleUpdateActivity(row.id, "remark", remark);
            }
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default CheckListRows;

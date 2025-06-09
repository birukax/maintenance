import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../store/store";

const CheckListRows = ({ row, handleUpdateActivity }) => {
  const [remark, setRemark] = useState(row.remark || "");
  const [value, setValue] = useState(row.value || false);
    // const workOrderActivity = useSelector((state:AppState)=>state.workOrderActivity.workOrderActivity)

  useEffect(() => {
    setRemark(row.remark || "");
  }, [row.remark]);
  useEffect(() => {
    setValue(row.value || "");
  }, [row.value]);
  return (
    <TableRow key={row.id}>
      <TableCell align="left" title={row.description}>
        {row.description}
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
          required
          value={remark}
          size="small"
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

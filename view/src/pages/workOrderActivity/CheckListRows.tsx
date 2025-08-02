import { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField, Typography } from "@mui/material";

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
    <TableRow hover key={row.id}>
      <TableCell align="left" title={row.description}>
        <Typography >
          {row.description}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Checkbox
          size='large'
          checked={value}
          onChange={(event) => {
            setValue(event.target.checked);
            handleUpdateActivity(row.id, "value", event.target.checked);
          }}
          name="value"
        />
      </TableCell>
      <TableCell align="left">
        <TextField
          name="remark"
          required
          multiline
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

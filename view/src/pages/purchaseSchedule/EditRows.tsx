import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";

const EditRows = ({ row, handleUpdateSchedule }) => {
  const [quantity, setQuantity] = useState(row.quantity || 0);

  const [monthValue, setMonthValue] = useState({
    january: row.january || 0,
    february: row.february || 0,
    march: row.march || 0,
    april: row.april || 0,
    may: row.may || 0,
    june: row.june || 0,
    july: row.july || 0,
    august: row.august || 0,
    september: row.september || 0,
    october: row.october || 0,
    november: row.november || 0,
    december: row.december || 0,
  });
  useEffect(() => {
    setQuantity(
        Number(monthValue.january) +
          Number(monthValue.february) +
          Number(monthValue.march) +
          Number(monthValue.april) +
          Number(monthValue.may) +
          Number(monthValue.june) +
          Number(monthValue.july) +
          Number(monthValue.august) +
          Number(monthValue.september) +
          Number(monthValue.october) +
          Number(monthValue.november) +
          Number(monthValue.december)
    );
  }, [
    monthValue.january,
    monthValue.february,
    monthValue.march,
    monthValue.april,
    monthValue.may,
    monthValue.june,
    monthValue.july,
    monthValue.august,
    monthValue.september,
    monthValue.october,
    monthValue.november,
    monthValue.december,
  ]);

  return (
    <TableRow key={row.id}>
      <TableCell align="left" nowrap="true">
        {row.item.no}
      </TableCell>
      <TableCell align="left" nowrap="true">
        {row.item.name}
      </TableCell>
      <TableCell align="left" nowrap="true">
        {row.item.uom.name}
      </TableCell>
      <TableCell align="left">{row.item.inventory.balance}</TableCell>
      <TableCell align="left">{row.item.minimum_stock_level}</TableCell>
      <TableCell align="left">{row.year.no}</TableCell>
      <TableCell align="left">{quantity}</TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="january"
          type="number"
          value={monthValue.january}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, january: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "january",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="february"
          type="number"
          value={monthValue.february}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, february: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "february",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="march"
          type="number"
          value={monthValue.march}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, march: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "march",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="april"
          type="number"
          value={monthValue.april}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, april: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "april",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="may"
          type="number"
          value={monthValue.may}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, may: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "may",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="june"
          type="number"
          value={monthValue.june}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, june: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "june",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="july"
          type="number"
          value={monthValue.july}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, july: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "july",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="august"
          type="number"
          value={monthValue.august}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, august: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "august",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="september"
          type="number"
          value={monthValue.september}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, september: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "september",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="october"
          type="number"
          value={monthValue.october}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, october: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "october",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="november"
          type="number"
          value={monthValue.november}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, november: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "november",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="december"
          type="number"
          value={monthValue.december}
          onChange={(event) => {
            const value = Math.max(0, event.target.value);
            setMonthValue({ ...monthValue, december: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "december",
              Math.max(0, event.target.value)
            );
          }}
          sx={{ width: "110px", minWidth: "fit-content" }}
        />
      </TableCell>

      {/* <TableCell align="left">
        <TextField
          name="remark"
          value={remark}
          onChange={(event) => setRemark(event.target.value)}
          onBlur={() => {
            if (remark !== row.remark) {
              
            }
            onBlur={(event)=>{
            handleUpdateSchedule(row.id, "remark", remark);}}
          }}
        />
      </TableCell> */}
    </TableRow>
  );
};

export default EditRows;

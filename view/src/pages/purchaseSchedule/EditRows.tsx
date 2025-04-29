import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";

const CheckListRows = ({ row, handleUpdateSchedule }) => {


  const [monthValue,setMonthValue] = useState({
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
    // setRemark(row.remark || "");
  }, [monthValue]);


  return (
    <TableRow key={row.id}>
      <TableCell align="left">
        {row.item.name}
      </TableCell>
      <TableCell align="left">
        {row.item.uom.name}
      </TableCell>
      <TableCell align="left">
        {row.item.inventory.balance}
      </TableCell>
      <TableCell align="left">
        {row.item.minimum_stock_level}
      </TableCell>
      <TableCell align="left">
        {row.year}
      </TableCell>
      <TableCell align="left">
        {row.quantity}
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="january"
          type="number"
          value={monthValue.january}
          onChange={(event) => {
        setMonthValue({ ...monthValue, january: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "january", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="february"
          type="number"
          value={monthValue.february}
          onChange={(event) => {
        setMonthValue({ ...monthValue, february: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "february", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="march"
          type="number"
          value={monthValue.march}
          onChange={(event) => {
        setMonthValue({ ...monthValue, march: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "march", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="april"
          type="number"
          value={monthValue.april}
          onChange={(event) => {
        setMonthValue({ ...monthValue, april: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "april", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="may"
          type="number"
          value={monthValue.may}
          onChange={(event) => {
        setMonthValue({ ...monthValue, may: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "may", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="june"
          type="number"
          value={monthValue.june}
          onChange={(event) => {
        setMonthValue({ ...monthValue, june: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "june", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="july"
          type="number"
          value={monthValue.july}
          onChange={(event) => {
        setMonthValue({ ...monthValue, july: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "july", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="august"
          type="number"
          value={monthValue.august}
          onChange={(event) => {
        setMonthValue({ ...monthValue, august: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "august", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="september"
          type="number"
          value={monthValue.september}
          onChange={(event) => {
        setMonthValue({ ...monthValue, september: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "september", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="october"
          type="number"
          value={monthValue.october}
          onChange={(event) => {
        setMonthValue({ ...monthValue, october: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "october", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="november"
          type="number"
          value={monthValue.november}
          onChange={(event) => {
        setMonthValue({ ...monthValue, november: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "november", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
        />
      </TableCell>
      <TableCell align="left" style={{ padding: "8px" }}>
        <TextField
          name="december"
          type="number"
          value={monthValue.december}
          onChange={(event) => {
        setMonthValue({ ...monthValue, december: event.target.value });
        
          }}
          onBlur={(event)=>{
            handleUpdateSchedule(row.id, "december", event.target.value);
          }}
          sx={{width: "80px",minWidth:"fit-content"}}
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

export default CheckListRows;

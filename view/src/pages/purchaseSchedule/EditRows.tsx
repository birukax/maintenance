import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../store/store";

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
  const purchase_schedule = useSelector((state: AppState) => state.purchaseSchedule.purchaseSchedule)

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
      <TableCell align="left">{row.item?.inventory?.balance}</TableCell>
      <TableCell align="left">{row?.item?.minimum_stock_level}</TableCell>
      <TableCell align="left">{row?.year?.no}</TableCell>
      <TableCell align="left">{quantity}</TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="january"
          type="number"
          value={monthValue.january}
          helperText={purchase_schedule.error?.january || ""}
          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, january: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "january",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="february"
          type="number"
          value={monthValue.february}
          helperText={purchase_schedule.error?.february || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, february: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "february",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="march"
          type="number"
          value={monthValue.march}
          helperText={purchase_schedule.error?.march || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, march: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "march",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="april"
          type="number"
          value={monthValue.april}
          helperText={purchase_schedule.error?.april || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, april: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "april",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="may"
          type="number"
          value={monthValue.may}
          helperText={purchase_schedule.error?.may || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, may: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "may",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="june"
          type="number"
          value={monthValue.june}
          helperText={purchase_schedule.error?.june || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, june: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "june",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="july"
          type="number"
          value={monthValue.july}
          helperText={purchase_schedule.error?.july || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, july: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "july",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="august"
          type="number"
          value={monthValue.august}
          helperText={purchase_schedule.error?.august || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, august: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "august",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="september"
          type="number"
          value={monthValue.september}
          helperText={purchase_schedule.error?.september || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, september: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "september",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="october"
          type="number"
          value={monthValue.october}
          helperText={purchase_schedule.error?.october || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, october: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "october",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="november"
          type="number"
          value={monthValue.november}
          helperText={purchase_schedule.error?.november || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, november: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "november",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>
      <TableCell align="left" >
        <TextField
          size='small'
          name="december"
          type="number"
          value={monthValue.december}
          helperText={purchase_schedule.error?.december || ""}

          onChange={(event) => {
            const value = Math.max(0, event?.target?.value);
            setMonthValue({ ...monthValue, december: value });
          }}
          onBlur={(event) => {
            handleUpdateSchedule(
              row.id,
              "december",
              Math.max(0, event?.target?.value)
            );
          }}
          className='w-28'
        />
      </TableCell>


    </TableRow>
  );
};

export default EditRows;

import React, { useState, useEffect } from "react";
import { TableRow, TableCell, Checkbox, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../store/store";

const CheckListRows = ({ row, handleFormChange,index,errorCount,setErrorCount }) => {

  const [error, setError] = useState(false);
  const errorList=errorCount
  
    const transfer = useSelector((state:AppState)=>state.transfer.transfer)

  
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
        {row?.total_shipped_quantity}
      </TableCell>
      <TableCell align="left">
        {row?.remaining_quantity}
      </TableCell>
      <TableCell align="left">
        <TextField
          name="quantity"
          type="number"
          required
          size="small"
          inputProps={{ min: 0, max: row.remaining_quantity }}
          helperText={transfer.error?.quantity||""}
          style={error?{border:"1px solid red"}:{}}
          onChange={(e)=>{
            if(e.target.value>row.remaining_quantity){
              setError(true)
              errorList[index]=true
              setErrorCount([...errorList])
            }else{
              setError(false)
              errorList[index]=false
              setErrorCount([...errorList])
              handleFormChange({
              item_id:row?.item?.id,
              quantity:e.target.value
            })
            }
            
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default CheckListRows;

import { Dispatch, FC, SetStateAction, useState } from "react";
import { TableRow, TableCell, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/store";
import { Data } from "../../../store/types";

interface FormChangeProps {
  item_id: string | number, quantity: string | number | null
}

interface CheckListRowsProps {
  row: Data;
  handleFormChange: ({ item_id, quantity }: FormChangeProps) => void;
  index: number;
  errorCount: any;
  setErrorCount: Dispatch<SetStateAction<any>>
}

const CheckListRows: FC<CheckListRowsProps> = ({ row, handleFormChange, index, errorCount, setErrorCount }) => {

  const [error, setError] = useState(false);
  const errorList = errorCount

  const transfer = useSelector((state: AppState) => state.transfer.transfer)


  return (
    <TableRow key={row.id}>
      <TableCell align="left" key={row.id}>
        {row?.item?.no}
      </TableCell>
      <TableCell align="left">
        {row?.item?.name}
      </TableCell>
      <TableCell align="left">
        {row?.requested_quantity}
      </TableCell>
      <TableCell align="left">
        {row?.available_balance}
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
          size='small'
          name="quantity"
          type="number"
          required
          inputProps={{ min: 0, max: row.available_balance > row.remaining_quantity ? row.remaining_quantity : row.available_balance }}
          helperText={transfer.error?.quantity || ""}
          style={error ? { border: "1px solid red" } : {}}
          onChange={(e) => {
            if (e.target.value > row.remaining_quantity || e.target.value > row.available_balance) {
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

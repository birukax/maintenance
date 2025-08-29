import { Dispatch, FC, SetStateAction, useState } from "react";
import { TableRow, TableCell, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store/store";
import { type Data, type FormData } from "../../../../store/types";

interface ReceiveListRowsProps {
  row: Data;
  handleFormChange: (data: FormData) => Promise<void>;
  index: number;
  setErrorCount: Dispatch<SetStateAction<any>>
  errorCount: any;
}

const ReceiveListRows: FC<ReceiveListRowsProps> = ({ row, handleFormChange, index, errorCount, setErrorCount }) => {

  const [error, setError] = useState(false);
  const errorList = errorCount

  const purchaseRequest = useSelector((state: AppState) => state.purchaseRequest.purchaseRequest)


  return (
    <TableRow key={row.id}>
      <TableCell align="left" >
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
        {row?.remaining_quantity}
      </TableCell>
      <TableCell align="left">
        <TextField
          size='small'
          name="quantity"
          type="number"
          required
          inputProps={{ min: 0, max: row?.remaining_quantity }}
          helperText={purchaseRequest.error?.quantity || ""}
          style={error ? { border: "1px solid red" } : {}}
          onChange={(e) => {
            if (Number(e.target.value) > row?.remaining_quantity) {
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

export default ReceiveListRows;

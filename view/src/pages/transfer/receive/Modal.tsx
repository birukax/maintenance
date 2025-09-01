import { FC } from "react";
import { useDispatch } from "react-redux";
import { receiveTransfer } from "../../../store/slices/transferSlice";
import { AppDispatch } from "../../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,

} from "@mui/material";
import { Data } from "../../../store/types";
const style = {
  boxSizing: "border-box",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "fit-content",
  width: "40%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 2,
  maxHeight: "400px",
  overflow: "hidden",

};

interface ReceiveProps {
  entityState: Data;
  setReceiveModalOpen: (value: boolean) => void;
}

const Receive: FC<ReceiveProps> = ({ entityState, setReceiveModalOpen }) => {
  const dispatch = useDispatch<AppDispatch>();



  const handlereceiveTransfer = async (id: string | number) => {
    await dispatch(receiveTransfer(id)).unwrap()
    setReceiveModalOpen(false)
  }
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography color='primary' variant="h5" className="mb-2!">
        Receive Transfer
      </Typography>
      <Box
        sx={{ maxWidth: "100%", height: "100%" }}
      >
        <Table className='py-6! my-3!' size='small' sx={{ maxWidth: "100%", overflow: "scroll" }} aria-label={` table`}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography noWrap>Item</Typography>
              </TableCell>

              <TableCell>
                <Typography noWrap>Requested Date</Typography>
              </TableCell>

              <TableCell>
                <Typography noWrap>Requested Quantity</Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap>Shipped Quantity</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entityState &&
              entityState.data.transfer_items.filter((el: Data) => el.shipped_quantity > 0).map((row: Data, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography noWrap>{row.item.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography noWrap>{entityState?.data?.requested_date}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography noWrap>{row?.requested_quantity}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap>{row?.shipped_quantity}</Typography>
                  </TableCell>
                </TableRow>
              ))}

          </TableBody>
        </Table>
        <div className='w-fit! ml-auto'>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={entityState.loading}
            className="mt-4"
            onClick={() => handlereceiveTransfer(entityState.data.id)}
          >
            {entityState.loading ? (
              <CircularProgress size={24} />
            ) : (
              "Receive"
            )}
          </Button>
        </div>
        {entityState.error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {entityState.error?.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Receive;

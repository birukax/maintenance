import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { receiveTransfer } from "../../store/slices/transferSlice";
import { AppState, AppDispatch } from "../../store/store";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Autocomplete,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,

} from "@mui/material";
import { toast } from "react-toastify";
import { useEntityDetail } from "../../hooks/useEntityDetail";
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

const AddActivity = ({ entityState, setReceiveModalOpen }) => {
  const [formData, setFormData] = useState({
    activity_ids: [],
  });
  const { activities } = useSelector((state: AppState) => state.activity);
  const [error, setError] = useState(null);
  const dispatch = useDispatch<AppDispatch>();



  const handlereceiveTransfer = async (id) => {

    await dispatch(receiveTransfer({ id })).unwrap()
    setReceiveModalOpen(false)
  }
  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography color='primary' variant="h5" className="mb-2!">
        Receive Transfer
      </Typography>
      <Box
        sx={{ maxWidth: "100%", height: "100%", overflow: "scroll" }}
      >
        <Table className='my-3!' size='small' sx={{ maxWidth: "100%" }} aria-label={` table`}>
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
              entityState.data.transfer_items.filter(el => el.shipped_quantity > 0).map((row, index) => (
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
            "Receive All"
          )}
        </Button>
        {error && (
          <Typography variant="body2" className="mt-4 text-red-500">
            {error.detail}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default AddActivity;

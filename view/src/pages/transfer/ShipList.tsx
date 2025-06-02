import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransfer } from "../../store/slices/transferSlice";
import { updateWorkOrderActivity } from "../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import ShipListRows from "./ShipListRows";
import Submit from "./Submit";
import {
  Typography,
  Button,
  Modal,
  TableRow,
  TableBody,
  Table,
  TableHead,
  TableCell,
  TextField,
  Checkbox,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ShipList = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // from_location_id:entityState?.data?.from_location?.id,
    // to_location_id:entityState?.data?.to_location?.id,
    shipped_items:[]
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate()
  const renderButtons = () => (
    <>
      <>
        <Button
          variant="contained"
          className="bg-slate-700"
          sx={{ marginRight: ".5rem" }}
        >
          Submit
        </Button>
      </>
    </>
  );

  const handleRefresh = async () => {
    try {
      await dispatch(fetchTransfer(entityState?.id)).unwrap();
    } catch (error) {
      console.error("Failed to refresh work order:", error);
    }
  };

  const handleFormChange = async (e) => {
    
    setFormData(prev=>{
      return {
        ...prev,
        shipped_items:[...prev?.shipped_items,{[e.target.name]:e.target.value}]
      }
    })
  };

  console.log(entityState,"list");
  console.log(formData,"form");
  
  const renderDetails = (data) => (
    <>
      <Table sx={{ minWidth: 650 }} aria-label={` table`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography noWrap>Item No.</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Transfer Item</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Requested Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Shipped Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Ship</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data?.transfer_items?.map((row) => {
              if(row.remaining_quantity>0) return <ShipListRows
                key={row.id}
                row={row}
                handleFormChange={handleFormChange}
              />
})}
        </TableBody>
      </Table>
    </>
  );
  if (!entityState?.data) {
    return <Typography>The work order ship is not available</Typography>;
  } else {
    return (
      <GenericDetailPage
        titleBase="Transfer Ship"
        id={entityState.id}
        entityState={entityState}
        renderButtons={renderButtons}
        renderDetails={renderDetails}
        formDetail={true}
      />
    );
  }
};

export default ShipList;

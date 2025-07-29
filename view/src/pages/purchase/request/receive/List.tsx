import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPurchaseRequest, receivePurchaseRequest } from "../../../../store/slices/purchaseRequestSlice";
import { AppState, AppDispatch } from "../../../../store/store";
import { useEntityDetail } from "../../../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../../../components/GenericDetailPage";
import Rows from "./Rows";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ShipList = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.purchaseRequest.purchaseRequest,
    fetchDetailAction: fetchPurchaseRequest,
  });
  const [errorCount, setErrorCount] = useState([])
  const [formData, setFormData] = useState({
    date: null,
    received_items: []
  });
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()


  const handleRefresh = () => {
    try {
      dispatch(fetchPurchaseRequest(id))
    } catch (error) {
      return error

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(receivePurchaseRequest({ id, formData })).unwrap()
      navigate(`/purchase/detail/${id}`)
    } catch (error) {
      return error
    }
  }
  const renderButtons = () => (
    <>
      <>
        <Button
          size='small'
          disabled={errorCount.find(el => el === true) ? true : false || formData.received_items.filter((e) => e.quantity > 0).length === 0}
          variant="contained"
          className="bg-slate-700"
          sx={{ marginRight: ".5rem" }}
          onClick={handleSubmit}
        >
          Receive
        </Button>
      </>
    </>
  );



  const handleFormChange = async (data) => {

    let item = formData?.received_items?.find(el => el.item_id === data.item_id)
    if (!item) {

      setFormData(prev => {
        return {
          ...prev,
          received_items: [...prev?.received_items, data]
        }
      })
    } else {

      setFormData(prev => {
        return {
          ...prev,
          received_items: [...prev?.received_items?.filter(el => {
            if (el.item_id === data.item_id) {
              el.quantity = data.quantity
            }
            return el
          })]
        }
      })
    }

  };

  const renderDetails = (data) => (
    <>
      <Table size='small' sx={{ minWidth: 650 }} aria-label={` table`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography noWrap>Item No.</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Item</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>UoM</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Requested</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Received</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Remaining</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Receive</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data?.request_items?.map((row, index) => {
              if (row.remaining_quantity > 0) return <Rows
                setErrorCount={setErrorCount}
                errorCount={errorCount}
                key={row.id}
                row={row}
                index={index}
                handleFormChange={handleFormChange}
              />
            })}
          {
            data && data?.request_items?.every(el => el.remaining_quantity < 1) && <TableRow><Typography>No Shippment Left</Typography></TableRow>
          }
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

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransfer } from "../../store/slices/transferSlice";
import { updateWorkOrderActivity } from "../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import ShipListRows from "./ShipListRows";
import { shipTransfer } from "../../store/slices/transferSlice";
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
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });
  const [errorCount,setErrorCount]=useState([])
  const [formData, setFormData] = useState({
    shipped_items:[]
  });
  const {id}=useParams()
  const dispatch = useDispatch<AppDispatch>();
  const navigate=useNavigate()


  const handleRefresh=()=>{
    try {
      dispatch(fetchTransfer(id))
    } catch (error) {
      console.log("error",error);
      
    }
  }
  const handleSubmit=async (e)=>{
    e.preventDefault()
    try {
      await dispatch(shipTransfer({id,formData})).unwrap()
      navigate(`/transfer/detail/${id}`)
    } catch (error) {      
      return error
    }
  }
  const renderButtons = () => (
    <>
      <>
        <Button
        disabled={errorCount.find(el=>el===true)?true:false}
          variant="contained"
          className="bg-slate-700"
          sx={{ marginRight: ".5rem" }}
          onClick={handleSubmit}
        >
          Ship
        </Button>
      </>
    </>
  );

  

  const handleFormChange = async (data) => {
    
    let item=formData?.shipped_items?.find(el=>el.item_id===data.item_id)
    if(!item){
      
      setFormData(prev=>{
      return {
        ...prev,
        shipped_items:[...prev?.shipped_items,data]
      }
    })
    }else{
      
      setFormData(prev=>{
      return {
        ...prev,
        shipped_items:[...prev?.shipped_items?.filter(el=>{
          console.log("filttered",el);
          
          if(el.item_id===data.item_id){
             el.quantity=data.quantity
          }
            return el
        })]
      }
    })
    }
    
  };

  console.log(formData,"now");
  
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
              <Typography noWrap>Remaining Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Ship</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data?.transfer_items?.map((row,index) => {
              if(row.remaining_quantity>0) return <ShipListRows
                setErrorCount={setErrorCount}
                errorCount={errorCount}
                key={row.id}
                row={row}
                index={index}
                handleFormChange={handleFormChange}
              />
})}
{
  data && data?.transfer_items?.every(el=>el.remaining_quantity<1)&&<TableRow><Typography>No Shippment Left</Typography></TableRow>
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

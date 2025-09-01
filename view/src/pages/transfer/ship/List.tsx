import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchTransfer } from "../../../store/slices/transferSlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useEntityDetail } from "../../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../../components/GenericDetailPage";
import ShipListRows from "./Rows";
import { shipTransfer } from "../../../store/slices/transferSlice";
import {
  Typography,
  Button,
  TableRow,
  TableBody,
  Table,
  TableHead,
  TableCell,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { type Data, type FormData } from '../../../store/types';

const ShipList = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });
  const [errorCount, setErrorCount] = useState([])
  const [formData, setFormData] = useState<FormData>({
    shipped_items: []
  });
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      await dispatch(shipTransfer({ id, formData })).unwrap()
      navigate(`/transfer/detail/${id}`)
    } catch (error) {
      return error
    }
  }
  const renderButtons = () => (
    <>
      <>
        <Button
          size='small'
          disabled={errorCount.find(el => el === true) || formData.shipped_items.filter((e: Data) => e.quantity > 0).length === 0}
          variant="contained"
          className="bg-slate-700"
          sx={{ marginRight: ".5rem" }}
          onClick={() => handleSubmit()}
        >
          Ship
        </Button>
      </>
    </>
  );



  const handleFormChange = async (data: FormData) => {


    setFormData(prev => {
      const existingItem = prev.shipped_items.find((item: Data) => item.item_id === data.item_id);
      if (!existingItem) {
        return {
          ...prev,
          shipped_items: [...prev.shipped_items, data]
        }
      } else {
        return {
          ...prev,
          shipped_items: prev.shipped_items.map((item: Data) => {
            if (item.item_id === data.item_id) {
              return { ...item, quantity: data.quantity };
            }
            return item;
          })
        }
      }
    })

    // let item = formData?.shipped_items?.find(el => el.item_id === data.item_id)
    // if (!item) {

    //   setFormData(prev => {
    //     return {
    //       ...prev,
    //       shipped_items: [...prev?.shipped_items, data]
    //     }
    //   })
    // } else {

    //   setFormData(prev => {
    //     return {
    //       ...prev,
    //       shipped_items: [...prev?.shipped_items?.filter(el => {
    //         if (el.item_id === data.item_id) {
    //           el.quantity = data.quantity
    //         }
    //         return el
    //       })]
    //     }
    //   })
    // }

  };

  const renderDetails = (data: Data) => (
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
              <Typography noWrap>Requested</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Available</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Shipped</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Total Shipped</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Remaining</Typography>
            </TableCell>
            <TableCell>
              <Typography noWrap>Ship</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data?.transfer_items?.map((row: Data, index: number) => {
              if (row.remaining_quantity > 0) return <ShipListRows
                setErrorCount={setErrorCount}
                errorCount={errorCount}
                key={row.id}
                row={row}
                index={index}
                handleFormChange={handleFormChange}
              />
            })}
          {
            data && data?.transfer_items?.every((el: Data) => el.remaining_quantity < 1) && <TableRow><Typography>No Shippment Left</Typography></TableRow>
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

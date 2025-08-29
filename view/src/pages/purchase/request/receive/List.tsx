import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { fetchPurchaseRequest, receivePurchaseRequest } from "../../../../store/slices/purchaseRequestSlice";
import { AppState, AppDispatch } from "../../../../store/store";
import { useEntityDetail } from "../../../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../../../components/GenericDetailPage";
import Rows from "./Rows";
import {
  Typography,
  Button,
  TableRow,
  TableBody,
  FormControl,
  Table,
  TableHead,
  TableCell,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { type Data, type FormData } from '../../../../store/types';

const ReceiveList = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.purchaseRequest.purchaseRequest,
    fetchDetailAction: fetchPurchaseRequest,
  });
  const [errorCount, setErrorCount] = useState([])
  const [formData, setFormData] = useState<FormData>({
    date: '',
    received_items: []
  });
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()


  const handleDateChange = (value: dayjs.Dayjs | null) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : null;
    setFormData({
      ...formData,
      date: formattedDate,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await dispatch(receivePurchaseRequest({ id, formData })).unwrap()
      navigate(`/purchase-request/detail/${id}`)
    } catch (error) {
      return error
    }
  }

  const handleFormChange = async (data: FormData) => {

    setFormData(prev => {
      const existingItem = prev.received_items.find((item: Data) => item.item_id === data.item.id);
      if (!existingItem) {
        return {
          ...prev,
          received_items: [...prev.received_items, data]
        }
      } else {
        return {
          ...prev,
          received_items: prev.received_items.map((item: Data) => {
            if (item.item_id === data.item_id) {
              return { ...item, quantity: data.quantity };
            }
            return item;
          })
        }
      }
    })
    // const item = formData?.received_items?.find((el: Data) => el.item_id === data.item_id);
    // if (!item) {

    //   setFormData(prev => {
    //     return {
    //       ...prev,
    //       received_items: [...prev?.received_items, data]
    //     }
    //   })
    // } else {
    //   setFormData(prev => {
    //     return {
    //       ...prev,
    //       received_items: [...prev?.received_items?.filter(el => {
    //         if (el.item_id === data.item_id) {
    //           el.quantity = data.quantity
    //         }
    //         return el
    //       })]
    //     }
    //   })
    // }

  };

  const renderButtons = () => (
    <>
      <>
        <div className='flex gap-4 w-fit'>
          <Button
            size='small'
            disabled={errorCount.find(el => el === true) && true || formData.date == '' || formData.received_items.filter((e: Data) => e.quantity > 0).length === 0}
            variant="contained"
            className="bg-slate-700"
            sx={{ marginRight: ".5rem" }}
            onClick={() => handleSubmit}
          >
            Receive
          </Button>
          <FormControl size='small'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disableFuture
                label="Date"
                name="date"
                value={formData.date ? dayjs(formData.date) : null}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: "outlined",
                    fullWidth: true,
                    required: true,
                    disabled: entityState.loading,
                    helperText: entityState.error?.date,
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </div>
      </>
    </>
  );

  const renderDetails = (data: Data) => (
    <>

      <Table size='small' sx={{ minWidth: 650 }} aria-label={` table`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography noWrap>ID</Typography>
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
            data?.request_items?.map((row: Data, index: number) => {
              if (row.remaining_quantity > 0) return <Rows
                row={row}
                handleFormChange={handleFormChange}
                index={index}
                setErrorCount={setErrorCount}
                errorCount={errorCount}
              />
            })}
          {
            data && data?.request_items?.every((el: Data) => el.remaining_quantity < 1) && <TableRow><Typography>No item left to receive.</Typography></TableRow>
          }
        </TableBody>
      </Table>
    </>
  );

  if (!entityState?.data) {
    return <Typography>The Purchase receipt is not available</Typography>;
  } else {
    return (
      <GenericDetailPage
        titleBase="Purchase Request Receive"
        id={entityState.id}
        entityState={entityState}
        renderButtons={renderButtons}
        renderDetails={renderDetails}
        formDetail={true}
      />
    );
  }
};

export default ReceiveList;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { updateWorkOrderActivity } from "../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import EditRows from "./EditRows";
import Pagination from "../../components/Pagination";
// import Submit from "./Submit";
import {
  CircularProgress,
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
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchPurchaseSchedules, updatePurchaseSchedule } from "../../store/slices/purchaseScheduleSlice";
const Edit = () => {
  const [searchParams,setSearchParams]=useSearchParams()
  const [currentPage,setCurrentPage]=useState(searchParams.get("page")||1)
  const {year}=useParams()
const [loading,setLoading]=useState(true)
  const [params, setParams] = useState({
    year__no: year || new Date().getFullYear(),
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1,
  });

  const navigate=useNavigate()
  const { purchaseSchedules } = useSelector(
    (state: AppState) => state.purchaseSchedule
  );
  const dispatch = useDispatch<AppDispatch>();

  const renderButtons = () => <></>;

  const fetch= async ()=>{
    await dispatch(fetchPurchaseSchedules(params)).unwrap();
    setLoading(false)
  }
  useEffect(() => {
    fetch()    
  }, []);

const searchFilter = async (field, value) => {
    // Handle filter action here
    const parameters = {
      year__no: year,
      page: 1,
      [field]: value,
    };


    setSearchParams({ ...parameters });

    await dispatch(fetchPurchaseSchedules(parameters));
  };
  
  const handleRefresh = async () => {
    try {
      await dispatch(fetchPurchaseSchedules(params)).unwrap();
    } catch (error) {
      console.error("Failed to refresh work order:", error);
    }
  };

  const handlePurchaseSchedule = async (id, field, newValue) => {
    const formData = {
      [field]: newValue,
    };
    try {
      await dispatch(updatePurchaseSchedule({ id, formData })).unwrap();
      handleRefresh();
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };
  const purchaseScheduleColumns = [
    "Item No",
    "Item",
    "UoM",
    "Balance",
    "Min Stock Level",
    "Year",
    "Quantity",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
    return (
      <>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
        {purchaseSchedules.loading && <CircularProgress/>}
          <Button
            variant="contained"
            onClick={() => {
              navigate("/purchase-schedules")
            }}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
        </div>
        {!loading && <Table sx={{ minWidth: 650 }} aria-label={` table`}>
          <TableHead>
            <TableRow>
              {purchaseScheduleColumns.map((column) => (
                <TableCell key={column}>
                  <Typography noWrap>{column}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {purchaseSchedules?.data?.results?.map((row) => (
                <EditRows
                  key={row.id}
                  row={row}
                  handleUpdateSchedule={handlePurchaseSchedule}
                />
              ))
            }
          </TableBody>
        </Table>}
        
        <Pagination
        cur={currentPage}
        setCur={setCurrentPage}
        next={purchaseSchedules?.data?.next}
        prev={purchaseSchedules?.data?.previous}
        count={purchaseSchedules?.data?.count}
        searchByPage={searchFilter}
      />
      </>
    );
  
};

export default Edit;

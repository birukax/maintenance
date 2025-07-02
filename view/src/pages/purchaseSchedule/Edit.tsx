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
  Box,
  TableRow,
  TableBody,
  Table,
  TableHead,
  TableCell,
} from "@mui/material";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchPurchaseSchedules, updatePurchaseSchedule } from "../../store/slices/purchaseScheduleSlice";
const Edit = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1)
  const { year } = useParams()
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState({
    year__no: year || new Date().getFullYear(),
    search: searchParams.get("search") || "",
    page: searchParams.get("page") || 1,
  });

  const navigate = useNavigate()
  const { purchaseSchedules } = useSelector(
    (state: AppState) => state.purchaseSchedule
  );
  const dispatch = useDispatch<AppDispatch>();

  const renderButtons = () => <></>;

  const fetch = async () => {
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

    <div
      className='h-full flex flex-col'
    >
      <div className='flex gap-4 mb-4 items-center'>
        <div>
          <Button
            size='small'
            variant="contained"
            onClick={() => {
              navigate(`/purchase-schedules?year__no=${year}`)
            }}
          >
            Save
          </Button>
        </div>
        <div>
          <Typography color='warning' className='font-semibold! text-lg! uppercase'>
            <span className='text-black font-normal!'>Year: </span>
            {year}
          </Typography>
        </div>
        {purchaseSchedules.loading && <CircularProgress size={30} />}
      </div>
      <div className="flex-1 overflow-scroll">
        <Table stickyHeader size='small' className='table table-auto' aria-label={`table`}>
          <TableHead >
            <TableRow>
              {purchaseScheduleColumns.map((column) => (
                <TableCell key={column}>
                  <Typography noWrap>{column}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              purchaseSchedules?.data?.results?.map((row) => (
                <EditRows
                  key={row.id}
                  row={row}
                  handleUpdateSchedule={handlePurchaseSchedule}
                />
              ))

            }
          </TableBody>
        </Table>
      </div>

      <Pagination
        cur={currentPage}
        setCur={setCurrentPage}
        next={purchaseSchedules?.data?.next}
        prev={purchaseSchedules?.data?.previous}
        count={purchaseSchedules?.data?.count}
        searchByPage={searchFilter}
      />
    </div>
  );

};

export default Edit;

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { updateWorkOrderActivity } from "../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import CheckListRows from "./CheckListRows";
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
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const CheckList = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
  });
  const { tokens } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const renderButtons = () => (
    <>
      <>
        {/* <Modal
      open={activityModalOpen}
      onClose={handleActivityModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <AddActivity entityState={entityState} setModalOpen={setActivityModalOpen} />
    </Modal>
    <Button
      onClick={handleActivitdyModalOpen}
      variant="contained"
      className="bg-slate-700"
      sx={{marginRight:".5rem"}}
    >
      Add Activity
    </Button> */}
      </>

      {/* <Modal
        open={assignmodalOpen}
        onClose={handleAssignModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AssignUsers entityState={entityState} setModalOpen={setAssignModalOpen} />
      </Modal>
      <Button
        onClick={handleAssignModalOpen}
        variant="contained"
        className="bg-slate-700"
      >
        Assign User
      </Button> */}
    </>
  );

  const handleRefresh = async () => {
    try {
      await dispatch(fetchWorkOrder(entityState.id)).unwrap();
    } catch (error) {
      console.error("Failed to refresh work order:", error);
    }
  };

  const handleUpdateActivity = async (id, field, newValue) => {
    const formData = {
      [field]: newValue,
    };
    try {
      await dispatch(updateWorkOrderActivity({ id, formData })).unwrap();
      handleRefresh();
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  const renderDetails = (data) => (
    <>
      <Table sx={{ minWidth: 650 }} aria-label={` table`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography noWrap>Activity Name</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Value</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Remark</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.work_order_activities.map((row) => (
              <CheckListRows
                key={row.id}
                row={row}
                handleUpdateActivity={handleUpdateActivity}
              />
            ))}
        </TableBody>
      </Table>
    </>
  );

  return (
    <GenericDetailPage
      titleBase="WorkOrder Activity CheckList"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
      formDetail={true}
    />
  );
};

export default CheckList;

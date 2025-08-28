import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchWorkOrder } from "../../store/slices/workOrderSlice";
import { updateWorkOrderActivity } from "../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import CheckListRows from "./CheckListRows";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { type Data } from '../../store/types';

const CheckList = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.workOrder.workOrder,
    fetchDetailAction: fetchWorkOrder,
  });

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const handleSubmitModalOpen = () => setSubmitModalOpen(true);
  const handleSubmitModalClose = () => setSubmitModalOpen(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const renderButtons = () => (
    <>
      <>
        <Modal
          open={submitModalOpen}
          onClose={handleSubmitModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Submit entityState={entityState} setModalOpen={setSubmitModalOpen} />
        </Modal>
        <Button
          size='small'
          onClick={() => navigate(`/work-order/detail/${entityState.id}`)}
          variant="outlined"
          className="bg-slate-700"
          sx={{ marginRight: ".5rem" }}
        >
          Save
        </Button>
        <Button
          size='small'
          onClick={handleSubmitModalOpen}
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
    if (entityState.id) {
      await dispatch(fetchWorkOrder(entityState.id)).unwrap();
    }
  };

  const handleUpdateActivity = async (id: string | number, field: string, newValue: any) => {
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

  const renderDetails = (data: Data) => (
    <>
      <Table className='table table-auto' stickyHeader size='small' aria-label={` table`}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography noWrap>Activity Description</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Checked</Typography>
            </TableCell>

            <TableCell>
              <Typography noWrap>Remark</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.work_order_activities.map((row: Data) => (
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
  if (entityState?.data?.status !== "Assigned") {
    return <Typography>The work order checklist is not available</Typography>;
  } else {
    return (
      <GenericDetailPage
        titleBase="Work-Order Checklist"
        id={entityState.id}
        entityState={entityState}
        renderButtons={renderButtons}
        renderDetails={renderDetails}
        formDetail={true}
      />
    );
  }
};

export default CheckList;

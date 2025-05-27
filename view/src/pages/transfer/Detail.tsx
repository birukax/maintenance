import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchTransfer } from "../../store/slices/transferSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Modal, Checkbox, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import AddActivityModal from "./AddActivityModal";
import AssignUsers from "./AssignUsers";

const Detail = () => {
  const navigate=useNavigate()
  const {id}=useParams()
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transfer.transfer,
    fetchDetailAction: fetchTransfer,
  });
  const start = () => {
    return dayjs(
      `${entityState.data.start_date}T${entityState.data.start_time}`
    ).format("YYYY/MM/DD HH:mm a");
  };
  const end = () => {
    return dayjs(
      `${entityState.data.end_date}T${entityState.data.end_time}`
    ).format("YYYY/MM/DD HH:mm a");
  };
  const [assignmodalOpen, setAssignModalOpen] = useState(false);
  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);

  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const handleActivityModalOpen = () => setActivityModalOpen(true);
  const handleActivityModalClose = () => setActivityModalOpen(false);


  
  const renderButtons = () => (
    <>
      {entityState.data?.status === "Created" &&
        entityState.data?.work_order_activities.length === 0 && (
          <>
            
            {
            
            entityState.data.work_order_type?.scheduled ?
                <>
                <Modal
              open={activityModalOpen}
              onClose={handleActivityModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AddActivityModal
                entityState={entityState}
                setModalOpen={setActivityModalOpen}
              />
            </Modal>
                <Button
              onClick={handleActivityModalOpen}
              variant="contained"
              className="bg-slate-700"
              sx={{ mr: 1 }}
            >
              Add Activity
            </Button>
                </>
                :
            <Button
              onClick={()=>navigate(`/work-order/${id}/add-activities`)}
              variant="contained"
              className="bg-slate-700"
              sx={{ mr: 1 }}
            >
              Add Activity
            </Button>
            }
            
          </>

        )}
      {(entityState.data?.status === "Created" ||
        entityState.data?.status === "Assigned") && (
          <>
            <Modal
              open={assignmodalOpen}
              onClose={handleAssignModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <AssignUsers
                entityState={entityState}
                setModalOpen={setAssignModalOpen}
              />
            </Modal>
            <Button
              onClick={handleAssignModalOpen}
              variant="contained"
              className="bg-slate-700"
              sx={{ mr: 1 }}
            >
              Assign User
            </Button>
          </>
        )}
      {entityState.data?.status === "Assigned" && (
        <>
          <Button
            component={Link}
            to={`/work-order/check-list/${entityState.id}`}
            variant="contained"
            sx={{ mr: 1 }}
          >
            Check-List
          </Button>
        </>
      )}
    </>
  );

  console.log(entityState);
  

  const renderDetails = (data) => (
    <>

      <h2>Primary Information</h2>
      <div className="rw">
        <div className="clmn">

          <Typography variant="h6">Requested By:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.requested_by?.username}
          </Typography>
        </div>


        <div className="clmn">

          <Typography variant="h6" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>Transfer Items:<div>Qty</div></Typography>
          {data?.transfer_items?.map(item=><Typography variant="body1" className="text-slate-500 mb-2"  style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>{item?.item?.name}</span> <span>{item?.requested_quantity}</span>
          </Typography>)}
          
        </div>

        <div className="clmn">
          <Typography variant="h6">Transfer Location:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.from_location.name} - {data?.to_location?.name}
          </Typography>
        </div>


        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.status}
          </Typography>
        </div>
        {data?.approved_by.name?
        <div className="clmn">

          <Typography variant="h6">Approved By:</Typography>
             <Typography
                variant="body1"
                className="text-slate-500 mb-2"
              >
                {data?.approved_by.name}
              </Typography>
            
        </div>:""}
        {data?.approved_date?
        <div className="clmn">

          <Typography variant="h6">Approved Date:</Typography>
             <Typography
                variant="body1"
                className="text-slate-500 mb-2"
              >
                {data?.approved_date}
              </Typography>
            
        </div>:""}
      </div>


      <h2>Timeline</h2>
      <div className="rw timeline">
        <div className="clmn">

          <Typography variant="h6">Requested Date:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {entityState?.data?.requested_date}
          </Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {entityState?.data?.start_time}

          </Typography>
        </div>

        {
          entityState?.data?.shipment_date?
          <div className="clmn">

          <Typography variant="h6">Shipment Date:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {entityState?.data?.shipment_date}
          </Typography>
        </div>:
          ""}

{data?.total_time_taken?
        <div className="clmn">

          <Typography variant="h6">Total Time Taken:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.total_time_taken}
          </Typography>
        </div>:""}


      </div>




    </>
  );

  return (
    <GenericDetailPage
      titleBase="Transfer"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

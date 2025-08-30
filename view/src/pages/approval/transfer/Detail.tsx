import { useState } from "react";
import { fetchTransferApproval } from "../../../store/slices/transferApprovalSlice";
import { AppState } from "../../../store/store";
import { useEntityDetail } from "../../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../../components/GenericDetailPage";
import { Typography, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import Action from './Action';
import { Data } from "../../../store/types";
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.transferApproval.transferApproval,
    fetchDetailAction: fetchTransferApproval,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);


  const renderButtons = () => (
    <>
      {
        entityState?.data?.status === 'PENDING' &&
        <>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Action
              entityState={entityState}
              setModalOpen={setModalOpen}
            />
          </Modal>
          <div className='flex gap-2'>
            <Button
              size='small'
              onClick={handleModalOpen}
              variant="contained"
            >
              Actions
            </Button>
          </div>
        </>
      }
    </>
  );

  const renderDetails = (data: Data) => (
    <>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Transfer ID:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.transfer?.id}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.status}
          </Typography>
        </div>

        <div className="clmn">
          <Typography variant="h6">Requested by:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.transfer?.requested_by?.username}
          </Typography>
        </div>
        {
          data?.by &&
          <div className="clmn">
            {data?.status === 'APPROVED' &&
              <Typography variant="h6">Approved by:</Typography>
            }
            {data?.status === 'REJECTED' &&
              <Typography variant="h6">Rejected by:</Typography>
            }
            <Typography variant="body1" className="text-slate-500 mb-2">
              {data?.by?.username}
            </Typography>
          </div>
        }

        <div className="clmn">
          <Typography variant="h6">From:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.transfer?.from_location?.name}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">To:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.transfer?.to_location?.name}
          </Typography>
        </div>
      </div>
      <div className="rw">

        <div className="clmn activities-clmn" style={{ maxHeight: "500px" }}>

          <Typography variant="h6">Requested Items:</Typography>
          <Table size='small' sx={{ width: "100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>ID</Typography>
                </TableCell>
                <TableCell >
                  <Typography noWrap>Name</Typography>
                </TableCell>
                <TableCell >
                  <Typography noWrap>UoM</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Quantity</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.transfer?.transfer_items?.length > 0 ? data?.transfer?.transfer_items?.map((transfer_item: Data) => {
                return (
                  <TableRow key={transfer_item?.id}>
                    <TableCell><Link to={`/work-order/detail/${transfer_item?.id}`} type="link"> {transfer_item?.item?.no}</Link></TableCell>
                    <TableCell>{transfer_item?.item?.name}</TableCell>
                    <TableCell>{transfer_item?.item?.uom.code}</TableCell>
                    <TableCell>{transfer_item?.requested_quantity}</TableCell>
                  </TableRow>
                );
              })
                : <TableRow>
                  <TableCell className='border-none!'>
                    <Typography color='primary' className='ml-6! '>
                      There are no activities assigned to this work order.
                    </Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Transfer Approval"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

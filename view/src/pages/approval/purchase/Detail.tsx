import React, { useState } from "react";
import { fetchPurchaseApproval } from "../../../store/slices/purchaseApprovalSlice";
import { AppState } from "../../../store/store";
import { useEntityDetail } from "../../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../../components/GenericDetailPage";
import { Typography, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import Action from './Action';
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.purchaseApproval.purchaseApproval,
    fetchDetailAction: fetchPurchaseApproval,
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

  const renderDetails = (data) => (
    <>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Purchase ID:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.purchase_request?.id}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.status}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Priority:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.purchase_request?.priority}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Requested by:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.purchase_request?.requested_by?.username}
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
          <Typography variant="h6">Location:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.purchase_request?.location?.name}
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
              {data?.purchase_request?.request_items?.length > 0 ? data?.purchase_request?.request_items?.map((request_item) => {
                return (
                  <TableRow key={request_item?.id}>
                    <TableCell><Link to={`/work-order/detail/${request_item?.id}`} type="link"> {request_item?.item?.no}</Link></TableCell>
                    <TableCell>{request_item?.item?.name}</TableCell>
                    <TableCell>{request_item?.item?.uom.code}</TableCell>
                    <TableCell>{request_item?.requested_quantity}</TableCell>
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
      titleBase="Purchase Request Approval"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

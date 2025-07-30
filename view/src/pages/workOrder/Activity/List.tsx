// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchWorkOrderActivities, deleteWorkOrderActivity } from "../../../store/slices/workOrderActivitySlice";

import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams, Link } from "react-router-dom"
import { Button, ButtonGroup, CircularProgress, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import CreateActivity from "./Create";
import DeleteActivity from "./Delete";
import DeleteIcon from '@mui/icons-material/Delete';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import EditIcon from '@mui/icons-material/Edit';
import EditActivity from "./Edit";
const headers = [
  { header: "Description", accessor: "description" },
  { header: "Value", accessor: "value" },
];


const List: React.FC = () => {

  const { id } = useParams()
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.workOrderActivity.workOrderActivities
  );
  const formDate = useState({
    active: ""
  })
  const [params, setParams] = useState({
    // search:searchParams.get("search") ||"",
    no_pagination: true,
    work_order__id: id
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchWorkOrderActivities(params));
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchWorkOrderActivities(params));
    }
  }

  const handleDeleteActivity = async (id) => {
    await dispatch(deleteWorkOrderActivity(id));
    if (!entityState.error) {
      handleRefresh()
      handledeleteModalClose()
    }
  }
  const [assignmodalOpen, setAssignModalOpen] = useState(false);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  const [deletemodalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState("");

  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);
  const handledeleteModalOpen = () => setDeleteModalOpen(true);
  const handledeleteModalClose = () => setDeleteModalOpen(false);
  const handleeditModalOpen = () => setEditModalOpen(true);
  const handleeditModalClose = () => setEditModalOpen(false);

  const disableActivity = async (id, active) => {
    const formData = {
      active: !active
    }

    await dispatch(updateActivity({ id, formData }));
    if (!activity.error) {
      handleRefresh()
    }
  }


  const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);


  return (
    <>
      <div
        className="flex gap-8 justify-between table-filters"
        style={{
          maxWidth: "100%",
          minWidth: "fit-content",
          maxHeight: "fit-content",
        }}
      >
        <Modal
          open={assignmodalOpen}
          onClose={handleAssignModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <CreateActivity
            entityState={entityState}
            setModalOpen={setAssignModalOpen}
            handleRefresh={handleRefresh}
          />
        </Modal>
        <Modal
          open={editmodalOpen}
          onClose={handleeditModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <EditActivity
            entityState={entityState}
            setModalOpen={setEditModalOpen}
            handleRefresh={handleRefresh}
            editId={editId} />
        </Modal>
        <Modal
          open={deletemodalOpen}
          onClose={handledeleteModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DeleteActivity
            handleDeleteActivity={handleDeleteActivity}
            handledeleteModalClose={handledeleteModalClose}
            deleteId={deleteId}
            workOrderActivity={entityState}
          />
        </Modal>
        <Typography variant="h5" className="font-bold ">

        </Typography>
        <div >
          {entityState.loading && <CircularProgress size={30} />}

          <Button
            size='small'
            variant="outlined"
            onClick={handleAssignModalOpen}
          >
            New
          </Button>
          <Button
            component={Link}
            to={`/work-order/detail/${id}`}
            type='button'
            size='small'
            variant='contained'
            fullWidth
            disabled={entityState.loading}

          >
            Save
          </Button>
        </div>
      </div>
      {entityState.error && (
        <Typography variant="body2" color="error" className="mb-2">
          {/* <ToastContainer/> */}
        </Typography>
      )}

      <div className="table-container">
        <Table
          size='small'
          aria-label={`Activity table`}
          className="table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography >No</Typography>
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={index}>
                  <Typography >{header.header}</Typography>
                </TableCell>
              ))}
              <TableCell align="left">
                <Typography >Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entityState?.data && entityState?.data.length > 0
              ? entityState?.data?.map((row, index) => (
                <TableRow
                  key={index}
                >
                  <TableCell
                    scope="row"
                    align="left"
                    size="small"
                  >
                    <Typography noWrap>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  {headers.map((col) => {
                    return (
                      <TableCell
                        key={col.header}
                        scope="row"
                        align="left"
                        size="small"
                      >
                        <Typography className={`${col.header === "Description" && !row?.active ? "Disable" : ""}`} >
                          {col.renderCell
                            ? col.renderCell(row)
                            : col.accessor
                              ? String(getNestedValue(row, String(col.accessor)))
                              : "N/A"}
                        </Typography>
                      </TableCell>
                    );
                  })}

                  <TableCell align="left">
                    <ButtonGroup
                      variant="contained"
                      size="small"
                      sx={{ display: "flex", gap: 1, boxShadow: 0 }}
                    >
                      {/* <IconButton aria-label="disable" title="Disable" onClick={() => {
                        disableActivity(row.id, row.active)
                      }}>
                        <BlockIcon color='action' />
                      </IconButton> */}
                      <IconButton aria-label="edit" title="Edit" onClick={() => {
                        setEditId(row.id)
                        handleeditModalOpen()
                      }}>
                        <EditIcon color='primary' />
                      </IconButton>
                      <IconButton aria-label="delete" title="Delete" onClick={() => {
                        setDeleteId(row.id)
                        handledeleteModalOpen()
                      }}>
                        <DeleteIcon color='warning' />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>

                </TableRow>
              ))
              : !entityState.loading && (
                <TableRow>
                  <TableCell align="left" rowSpan={1}>
                    No data available.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      {/* <Pagination
        cur={currentPage}
        setCur={setCurrentPage}
        next={entityState?.data?.next}
        prev={entityState?.data?.previous}
        count={entityState?.data?.count}
        searchByPage={searchFilter}
      /> */}
    </>
  );
};

export default List;

// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchWorkOrderActivities } from "../../../store/slices/workOrderActivitySlice";
import { AppState, AppDispatch } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom"
import { Button, ButtonGroup, CircularProgress, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import CreateActivity from "./Create";
// import DeleteActivity from "./Delete";
import EditIcon from '@mui/icons-material/Edit';
import EditActivity from "./Edit";
import { type Data, type FetchParams } from '../../../store/types';

const headers = [
  { header: "Description", accessor: "description" },
  { header: "Value", accessor: "value" },
];


const List: React.FC = () => {

  const { id } = useParams()
  const entityState = useSelector(
    (state: AppState) => state.workOrderActivity.workOrderActivities
  );

  const [params] = useState<FetchParams>({
    // search:searchParams.get("search") ||"",
    no_pagination: true,
    work_order__id: id
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchWorkOrderActivities(params));

  }, []);

  const handleRefresh = () => {
    dispatch(fetchWorkOrderActivities(params));

  }

  // const handleDeleteActivity = async (id: string | number) => {
  //   await dispatch(deleteWorkOrderActivity(id));
  //   if (!entityState.error) {
  //     handleRefresh()
  //     handleDeleteModalClose()
  //   }
  // }
  const [assignmodalOpen, setAssignModalOpen] = useState(false);
  const [editmodalOpen, setEditModalOpen] = useState(false);
  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [deleteId, setDeleteId] = useState("");
  const [editId, setEditId] = useState<string | number | undefined>("");

  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);
  // const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  // const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);

  // const disableActivity = async (id: string | number, active: boolean) => {
  //   const formData = {
  //     active: !active
  //   }
  //   await dispatch(updateActivity({ id, formData }));
  //   if (!entityState.error) {
  //     handleRefresh()
  //   }
  // }


  const getNestedValue = (obj: any, path: any) =>
    path.split(".").reduce((acc: any, part: any) => acc && acc[part], obj);


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
            setModalOpen={setAssignModalOpen}
            handleRefresh={handleRefresh}
          />
        </Modal>
        <Modal
          open={editmodalOpen}
          onClose={handleEditModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <EditActivity
            setModalOpen={setEditModalOpen}
            handleRefresh={handleRefresh}
            editId={editId} />
        </Modal>
        {/* <Modal
          open={deleteModalOpen}
          onClose={handleDeleteModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <DeleteActivity
            handleDeleteActivity={handleDeleteActivity}
            handledeleteModalClose={handleDeleteModalClose}
            deleteId={deleteId}
            workOrderActivity={entityState}
          />
        </Modal>
        <Typography variant="h5" className="font-bold ">

        </Typography> */}
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
              {headers.map((header: any, index: number) => (
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
            {Array.isArray(entityState?.data) && entityState?.data.length > 0
              ? entityState?.data?.map((row: Data, index: number) => (
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
                  {headers.map((col: any) => {
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
                      <IconButton aria-label="edit" title="Edit" onClick={() => {
                        setEditId(row.id)
                        handleEditModalOpen()
                      }}>
                        <EditIcon color='primary' />
                      </IconButton>
                      {/* <IconButton aria-label="delete" title="Delete" onClick={() => {
                        setDeleteId(row.id)
                        handleDeleteModalOpen()
                      }}>
                        <DeleteIcon color='warning' />
                      </IconButton> */}
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

    </>
  );
};

export default List;

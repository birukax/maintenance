// src/pages/List.tsx
import React, { useEffect, useState } from "react";
import { fetchActivities } from "../../store/slices/activitySlice";
import { updateActivity } from "../../store/slices/activitySlice";
import { AppState, AppDispatch } from "../../store/store";
import { GenericListPage } from "../../components/GenericListPage";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom"
import { Button, ButtonGroup, CircularProgress, IconButton, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Pagination from "../../components/Pagination";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateActivity from "./CreateActivity";
import DeleteIcon from '@mui/icons-material/Delete';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import EditIcon from '@mui/icons-material/Edit';
const headers = [
  { header: "Description", accessor: "description" },
  { header: "Status", accessor: "active" },
];


const List: React.FC = () => {

  const { id } = useParams()
  const { tokens } = useSelector((state: AppState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyWord, setKeyWord] = useState("")
  const entityState = useSelector(
    (state: AppState) => state.activity.activities
  );
  const activity = useSelector((state: AppState) => state.activity.activity);
  const formDate=useState({
    active:""
  })
  const [params, setParams] = useState({
    // search:searchParams.get("search") ||"",
    no_pagination: true,
    schedule__id: id
  })
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tokens) {
      dispatch(fetchActivities(params));
    }
  }, []);

  const handleRefresh = () => {
    if (tokens) {
      dispatch(fetchActivities(params));
    }
  }
  const [assignmodalOpen, setAssignModalOpen] = useState(false);

  const handleAssignModalOpen = () => setAssignModalOpen(true);
  const handleAssignModalClose = () => setAssignModalOpen(false);

  const disableActivity=async (id,active)=>{
      const formData={
        active:!active
      }
      console.log(formData);
      
          await dispatch(updateActivity({id,formData}));
          if(!activity.error){
            handleRefresh()
          }
  }
  console.log(entityState);
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
        <Typography variant="h5" className="font-bold ">
          {/* {title}{" "}
          {yearFilter && (
            <sub
              style={{
                fontSize: "large",
                color: "red",
                marginInlineStart: "1rem",
              }}
              className="year-margin"
            >
              {" "}
              <span style={{ color: "black" }}> Year:</span>
              {searchParams.get("year__no")}
            </sub>
          )} */}
        </Typography>
        <div style={{ maxHeight: "fit-content" }}>

          <Button
            // component={Link}
            // to={createRoute}
            variant="outlined"
            sx={{ mr: 1, padding: ".5rem 2rem", maxHeight: "40px" }}
            onClick={() => setAssignModalOpen(true)}
          >
            New
          </Button>
          {/* {onEdit && entityState.data?.count > 0 && (
            <Button variant="outlined" onClick={() => onEdit(searchParams.get("year__no"))} sx={{ mr: 1 }}>
              Edit
            </Button>
          )} */}
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={entityState.loading}
            className="btn-refresh"
            sx={{ maxHeight: "40px" }}
          >
            Refresh
          </Button>
        </div>
      </div>
      {entityState.loading && <CircularProgress />}
      {entityState.error && (
        <Typography variant="body2" color="error" className="mb-2">
          {/* <ToastContainer/> */}
        </Typography>
      )}

      <div className="table-container">
        <Table
          sx={{ minWidth: 650, maxHeight: "40px" }}
          aria-label={`ACtivity table`}
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
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    size="small"
                    sx={{ padding: 1.5 }}
                  >
                    <Typography noWrap>
                      {index + 1}
                    </Typography>
                  </TableCell>
                  {headers.map((col) => {
                    return (
                      <TableCell
                        key={col.header}
                        component="th"
                        scope="row"
                        align="left"
                        size="small"
                        sx={{ padding: 1.5 }}
                      >
                        <Typography className={`${col.header==="Description" && !row?.active?"diactive":""}`} sx={{fontSize:18}}>
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
                      <IconButton aria-label="disable" title="Disable" onClick={()=>{
                        disableActivity(row.id,row.active)
                        }}>
                        <LayersClearIcon sx={{fontSize:25}}/>
                      </IconButton>
                      <IconButton aria-label="edit" title="Edit" >
                        <EditIcon sx={{fontSize:25,fill:"#3c83c1"}}/>
                      </IconButton>
                      <IconButton aria-label="delete" title="Delete" >
                        <DeleteIcon sx={{fontSize:25,fill:"#ca4335"}}/>
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

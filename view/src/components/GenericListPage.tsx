import React, { useEffect, useState } from "react";
import { AppState } from "../store/store";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';

import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  Button,
  ButtonGroup,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Pagination from "./Pagination";

export interface ColumnDefination {
  header: string;
  accessor?: string;
  renderCell?: (row) => React.ReactNode;
}

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

export const GenericListPage = ({
  title,
  entityState,
  columns,
  createRoute = "",
  hasDetail = true,
  hasApproval = false,
  detailRouteBase = "",
  onRefresh,
  onEdit,
  yearFilter,
  onApprove = null,
  onReject = null,
  getKey,
  searchFilter,
  keyWord,
  setKeyWord,
}) => {
  const headers = columns.map((col) => col.header);
  const { tokens } = useSelector((state: AppState) => state.auth);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage,setCurrentPage]=useState(searchParams.get("page")||1)
  if (!tokens) {
    return <Typography>Unauthorized</Typography>;
  }

  if (entityState?.error?.data?.code === "token_not_valid") {
    navigate("/login");
  }

  if (typeof entityState.error === "string") {
    toast.error(entityState.error);
  } else {
    if (
      entityState.error !== null &&
      entityState.error.code !== "token_not_valid"
    ) {
      toast.error(JSON.stringify(entityState.error));
    }
  }
  
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
        <Typography variant="h5" className="font-bold ">
          {title}{" "}
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
              {searchParams.get("year__no") }
            </sub>
          )}
        </Typography>
        <div style={{ maxHeight: "fit-content" }}>
          {searchFilter && (
            <div
              style={{
                display: "flex",
                gap: "0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                label="Search"
                name="search"
                className="mb-8"
                size="small"
                variant="outlined"
                fullWidth
                value={keyWord}
                onChange={(e) => setKeyWord(e.target.value)}
                sx={{
                  minWidth: "250px",
                  maxHeight: "40px",
                  border: "none",
                  "& .MuiOutlinedInput-root": {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    height: "100%",
                    maxHeight: "40px",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => searchFilter("search", keyWord)}
                sx={{
                  mr: 1,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  height: "40px",
                  border: "1px solid #5d4037",
                }}
              >
                <SearchIcon />
              </Button>
            </div>
          )}
          {yearFilter && (
            <TextField
              select
              onChange={(e) => yearFilter("year__no", e.target.value)}
              variant="outlined"
              size="small"
              focused
              sx={{
                marginRight: "8px",
                minWidth: "130px",
                outlineColor: "blue",
                maxHeight: "40px",
              }}
              value={searchParams.get("year__no") !=="null" && searchParams.get("year__no") || new Date().getFullYear()}
              className="year-filter"
            >
              {Array.from({ length: 5 }, (_, i) => 2025 + i).map((year) => (
                <MenuItem key={year} value={year} sx={{ fontWeight: "bold" }}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          )}
          {createRoute && (
            <Button
              component={Link}
              to={createRoute}
              variant="outlined"
              sx={{ mr: 1, padding: ".5rem 2rem", maxHeight: "40px" }}
            >
              New
            </Button>
          )}
          {onEdit && entityState.data?.count > 0 && (
              <Button variant="outlined" onClick={()=>onEdit(searchParams.get("year__no"))} sx={{ mr: 1 }}>
                Edit
              </Button>
            )}
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
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
          aria-label={`${title} table`}
          className="table"
        >
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>
                  <Typography >{header}</Typography>
                </TableCell>
              ))}
              {(hasDetail || hasApproval) && (
                <TableCell align="left">
                  <Typography >Action</Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {entityState?.data?.results && entityState?.data?.count > 0
              ? entityState?.data?.results?.map((row) => (
                  <TableRow
                    key={getKey(row)}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {columns.map((col) => {
                      return (
                        <TableCell
                          key={col.header}
                          component="th"
                          scope="row"
                          align="left"
                          size="small"
                          sx={{padding:1.5}}
                        >
                          <Typography noWrap>
                            {col.renderCell
                            ? col.renderCell(row)
                            : col.accessor
                            ? String(getNestedValue(row, String(col.accessor)))
                            : "N/A"}
                          </Typography>
                        </TableCell>
                      );
                    })}

                    {hasDetail && (
                      <TableCell align="left">
                        <Button
                          component={Link}
                          to={`${detailRouteBase}/${getKey(row)}`}
                          size="small"
                        >
                          Detail
                        </Button>
                      </TableCell>
                    )}
                    {hasApproval && row.status === "PENDING" && (
                      <TableCell align="left">
                        <ButtonGroup
                          variant="contained"
                          size="small"
                          sx={{ display: "flex", gap: 1, boxShadow: 0 }}
                        >
                          <Button
                            onClick={() => onApprove(row.id)}
                            disabled={entityState.loading}
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => onReject(row.id)}
                            disabled={entityState.loading}
                          >
                            Reject
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              : !entityState.loading && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="left" rowSpan={1}>
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        cur={currentPage}
        setCur={setCurrentPage}
        next={entityState?.data?.next}
        prev={entityState?.data?.previous}
        count={entityState?.data?.count}
        searchByPage={searchFilter}
      />
    </>
  );
};

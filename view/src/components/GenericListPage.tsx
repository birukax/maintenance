import React, { useEffect, useState } from "react";
import { AppState } from "../store/store";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
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
  FormControl,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
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
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1)
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
    <div className='flex flex-col h-full'>
      <div
        className="flex flex-wrap gap-8 justify-between table-filters mb-2"

      >
        <div>
          <Typography color='warning' variant="h6" className="tracking-tight! uppercase">
            {title}{" "}
            {yearFilter && (
              <sub
                style={{
                  marginInlineStart: "0.5rem",
                }}
                className="year-margin text-lg  tracking-wide"
              >
                {" "}
                <span style={{ color: "black" }}> Year:  </span>
                {searchParams.get("year__no")}
              </sub>
            )}
          </Typography>

        </div>
        <div className='flex flex-wrap items-center'>

          <div>

            {entityState.loading && <CircularProgress size={30} />}
          </div>
          <div className='items-center'>

            <IconButton
              color='primary'
              size='small'
              onClick={onRefresh}
              disabled={entityState.loading}
              className="btn-refresh"
            >
              <RefreshIcon />
            </IconButton>

          </div>

          {searchFilter && (

            <div className='flex'>
              <FormControl size='small'
                className='w-48 sm:w-54 '

              >
                <TextField

                  color='primary'
                  label="Search"
                  name="search"
                  size="small"
                  variant="outlined"
                  fullWidth
                  value={keyWord}
                  onChange={(e) => setKeyWord(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }
                  }}
                />
              </FormControl>
              <Button
                disabled={entityState.loading}
                size='small'
                variant="contained"
                className='rounded-tr-full! rounded-br-full!'
                onClick={() => searchFilter("search", keyWord)}
              >
                <SearchIcon />
              </Button>
            </div>
          )}
          {yearFilter && (
            <TextField
              color='primary'
              className='year-filter '
              select
              onChange={(e) => yearFilter("year__no", e.target.value)}
              variant="outlined"
              size="small"
              focused
              sx={{
                marginRight: "8px",
                minWidth: "130px",
                outlineColor: "blue",
              }}
              value={searchParams.get("year__no") !== "null" && searchParams.get("year__no") || new Date().getFullYear()}
            >
              {Array.from({ length: 5 }, (_, i) => 2025 + i).map((year) => (
                <MenuItem key={year} value={year} >
                  {year}
                </MenuItem>
              ))}
            </TextField>
          )}

          {createRoute && (
            <Button
              disabled={entityState.loading}
              component={Link}
              to={createRoute}
              variant="contained"
              size='medium'
            >
              New
            </Button>
          )}
          {onEdit && entityState.data?.count > 0 && (
            <Button
              disabled={entityState.loading}
              size='medium'
              variant="outlined"
              onClick={() => onEdit(searchParams.get("year__no"))}
            >
              Edit
            </Button>
          )}

        </div>
      </div>
      {/* {entityState.error && (
        <Typography variant="body2" color="error" className="mb-2">
          <ToastContainer/>
        </Typography>
      )} */}

      <div className="table-container flex-1">
        <Table stickyHeader size='small'
          aria-label={`${title} table`}
          className="table table-auto"
        >
          <TableHead >
            <TableRow>
              {headers.map((header) => (
                <TableCell size='small' key={header}>
                  <Typography >{header}</Typography>
                </TableCell>
              ))}
              {(hasDetail || hasApproval) && (
                <TableCell size='small' align="left">
                  <Typography >Action</Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {entityState?.data?.results && entityState?.data?.count > 0
              ? entityState?.data?.results?.map((row) => (
                <TableRow hover
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
                        sx={{ padding: 1 }}
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
                        variant='text'
                        color='warning'
                        className='hover:underline!'
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
                          variant='contained'
                          onClick={() => onApprove(row.id)}
                          disabled={entityState.loading}
                        >
                          <CheckIcon />
                        </Button>
                        <Button
                          variant='outlined'
                          onClick={() => onReject(row.id)}
                          disabled={entityState.loading}
                        >
                          <ClearIcon />
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
    </div>
  );
};

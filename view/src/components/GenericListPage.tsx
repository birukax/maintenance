import React from "react";
import { AppState } from "../store/store";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

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
  extraColumns = [],
  createRoute = "",
  hasDetail = true,
  detailRouteBase = "",
  onRefresh,
  getKey,
}) => {
  const headers = columns.map((col) => col.header);
  const extraHeaders = extraColumns.map((extraColumn) => extraColumn.headers);
  const { tokens } = useSelector((state: AppState) => state.auth);
  const navigate = useNavigate();

  if (!tokens) {
    return <Typography>Unauthorized</Typography>;
  }

  if (entityState?.error?.code === "token_not_valid") {
    navigate("/login");
  }
  return (
    <>
      <div className="flex gap-8">
        <Typography variant="h5" className="font-bold">
          {title}
        </Typography>
        <div>
          {createRoute && (
            <Button
              component={Link}
              to={createRoute}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              New
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={entityState.loading}
          >
            Refresh
          </Button>
        </div>
      </div>
      {entityState.loading && <CircularProgress />}
      {entityState.error && (
        <Typography variant="body2" color="error" className="mb-2">
          {typeof entityState.error === "string"
            ? entityState.error
            : JSON.stringify(entityState.error)}
        </Typography>
      )}

      <Table sx={{ minWidth: 650 }} aria-label={`${title} table`}>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>
                <Typography noWrap>{header}</Typography>
              </TableCell>
            ))}
            {extraHeaders.map((header) => (
              <TableCell key={header}>
                <Typography noWrap>{header}</Typography>
              </TableCell>
            ))}
            {hasDetail && (
              <TableCell align="right">
                <Typography noWrap>Detail</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {entityState.data && entityState.data.length > 0
            ? entityState.data.map((row) => (
                <TableRow
                  key={getKey(row)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.header} component="th" scope="row">
                      {col.renderCell
                        ? col.renderCell(row)
                        : col.accessor
                        ? getNestedValue(row, String(col.accessor))
                        : "N/A"}
                    </TableCell>
                  ))}
                  {extraColumns &&
                    extraColumns.map((extraColumn) => {
                      const schedule = row.monthly_purchase_schedules.find(
                        (s) => s.month === extraColumn.number
                      );

                      return (
                        <TableCell component="th" scope="row">
                          {schedule ? schedule.quantity : "0.00"}
                        </TableCell>
                      );
                    })}
                  {hasDetail && (
                    <TableCell align="right">
                      <Button
                        component={Link}
                        to={`${detailRouteBase}/${getKey(row)}`}
                        size="small"
                      >
                        Detail
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            : !entityState.loading && (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </>
  );
};

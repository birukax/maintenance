import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

const ListTable = ({ headers, children }) => {
  return (
    <>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header}>
              <Typography noWrap>{header}</Typography>
            </TableCell>
          ))}
          <TableCell>
            <Typography noWrap>Actions</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      {children}
    </>
  );
};

export default ListTable;

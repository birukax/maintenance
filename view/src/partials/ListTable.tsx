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
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>
                <Typography noWrap>{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {children}
      </Table>
    </>
  );
};

export default ListTable;

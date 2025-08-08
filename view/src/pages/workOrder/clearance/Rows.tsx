import { TableRow, TableCell, IconButton, Typography, FormControl, Checkbox, Collapse, TextField } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
const Row = ({ row, formData, onRowChange }) => {
    const [open, setOpen] = useState(false);
    const clearance = formData.work_order_clearances.find(c => c.id === row.id) || {};

    return <React.Fragment>
        <TableRow>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>
                <Typography>
                    {row?.description}
                </Typography>
            </TableCell>
            <TableCell >
                <FormControl>
                    <Checkbox
                        name='vlaue'
                        size='large'
                        checked={!!clearance.value}
                        onChange={(e) => {
                            onRowChange(row.id, 'value', e.target.checked)
                        }}
                    />
                </FormControl>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                <Collapse in={open} timeout='auto' unmountOnExit>
                    <FormControl className='mt-1 w-full'>
                        <TextField
                            name='remark'
                            label='Remark'
                            size='small'
                            multiline
                            fullWidth
                            variant='outlined'
                            value={clearance.remark || ''}
                            onChange={e => onRowChange(row.id, 'remark', e.target.value)}
                        >
                        </TextField>
                    </FormControl>
                </Collapse>
            </TableCell>
        </TableRow>

    </React.Fragment >
}

export default Row;
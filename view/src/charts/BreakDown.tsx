import { PieChart } from '@mui/x-charts/PieChart';
import { fetchBreakdowns } from "../store/slices/breakdownSlice";
import { useEffect, useState } from "react";
import { AppState, AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Box, Button } from '@mui/material';

const BreakdownChart = () => {
    const { breakdowns } = useSelector((state: AppState) => state.breakdown);

    const dispatch = useDispatch<AppDispatch>();
    const [dateFilter, setDateFilter] = useState(
        {
            dateStart: '',
            dateEnd: '',
        }
    );

    let params = {
        no_pagination: 'true',
        start_date__gte: null,
        start_date__lte: null,
        end_date: null,
    }


    useEffect(() => {
        if (dateFilter.dateStart) params.start_date__gte = dateFilter.dateStart;
        if (dateFilter.dateEnd) params.start_date__lte = dateFilter.dateEnd;
        dispatch(fetchBreakdowns(params));
    }, [dispatch, dateFilter]);

    
    console.log(breakdowns);
    

    return (
        <>
            <Box display='flex' gap={2} mb={2}>
                <div>

                    <TextField
                        label='Date Start'
                        type='date'
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        value={dateFilter.dateStart}
                        onChange={e => setDateFilter({ ...dateFilter, dateStart: e.target.value })}
                    />
                </div>
                <div>
                    <TextField
                        label='Date End'
                        type='date'
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        value={dateFilter.dateEnd}
                        onChange={e => setDateFilter({ ...dateFilter, dateEnd: e.target.value })}
                    />
                </div>
                <div>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={() => {
                            setDateFilter({
                                dateStart: '',
                                dateEnd: '',
                            });
                        }}
                    > Clear</Button>
                </div>

            </Box>
             <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={200}
      height={200}
    />
        </>
    )
}
export default BreakdownChart;
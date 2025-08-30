import { BarChart } from '@mui/x-charts/BarChart';
import { fetchWorkOrders } from "../store/slices/workOrderSlice";
import { useEffect, useState } from "react";
import { AppState, AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { TextField, Box, Button } from '@mui/material';
import { FetchParams } from '../store/types';

const WorkOrderChart = () => {
    const { workOrders } = useSelector((state: AppState) => state.workOrder);

    const dispatch = useDispatch<AppDispatch>();
    const [dateFilter, setDateFilter] = useState(
        {
            dateStart: '',
            dateEnd: '',
        }
    );

    const params: FetchParams = {
        no_pagination: 'true',
        start_date__gte: null,
        start_date__lte: null,
        end_date: null,
    }


    useEffect(() => {
        if (dateFilter.dateStart) params.start_date__gte = dateFilter.dateStart;
        if (dateFilter.dateEnd) params.start_date__lte = dateFilter.dateEnd;
        dispatch(fetchWorkOrders(params));
    }, [dispatch, dateFilter]);

    const dataArray = Array.isArray(workOrders.data) ? workOrders.data : [];

    const typeSet = new Set<string>();
    const statusSet = new Set<string>();
    dataArray.forEach((wo) => {
        typeSet.add(wo.work_order_type?.code || 'Unknown');
        statusSet.add(wo.status || 'Unknown');

    });
    const woTypeLabels = Array.from(typeSet);
    const statusLabels = Array.from(statusSet);

    const result: Record<string, Record<string, number>> = {};
    woTypeLabels.forEach(type => {
        result[type] = {};
        statusLabels.forEach(status => {
            result[type][status] = 0;
        });
    });
    dataArray.forEach((wo) => {
        const type = `${wo.work_order_type?.code}` || 'Unknown';
        const status = wo.status || 'Unknown';
        result[type][status] = (result[type][status] || 0) + 1;
    })

    const series = statusLabels.map(status => ({
        label: status,
        data: woTypeLabels.map(type => result[type][status] || 0),
        stack: 'true'
    }))




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
            <BarChart
                xAxis={[
                    {
                        id: 'woType',
                        data: woTypeLabels,
                        label: 'Work Orders'
                    },
                ]}
                series={series}
                height={300}
            />
        </>
    )
}
export default WorkOrderChart;
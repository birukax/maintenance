import React from "react";
import { useSelector } from "react-redux";
import { fetchPurchaseSchedule } from "../../store/slices/purchaseScheduleSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Grid, Paper } from "@mui/material";
import { MONTH_NAMES } from "../../utils/choices";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) =>
      state.purchaseSchedule.purchaseSchedule,
    fetchDetailAction: fetchPurchaseSchedule,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/purchase-schedule/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>

    <div className="rw">
      <div className="clmn">
        <Typography variant="h6">Item:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.name}
      </Typography>
      
      </div>
      <div className="clmn">
<Typography variant="h6">UoM:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.uom.name}
      </Typography>
      </div>
    </div>
      
      
      
<h2>Timeline</h2>
<div className="rw">
  <div className="clmn">
    <Typography variant="h6">Schedule:</Typography>
      <Typography variant="body1" className="text-slate-500">
        <Grid
          container
          spacing={{ xs: 2, md: 3, lg: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {MONTH_NAMES.map(([monthNumber, monthName]) => {
            const schedule = data.monthly_purchase_schedules.find(
              (s) => s.month === monthNumber
            );

            return (
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                <Paper sx={{padding:".5rem",borderBottomLeftRadius:"0",borderBottomRightRadius:"0"}}>{monthName}</Paper>
                <Paper  sx={{padding:".5rem",borderTopLeftRadius:"0",borderTopRightRadius:"0",borderBottomLeftRadius:"0",borderBottomRightRadius:"0"}}>{schedule ? schedule.quantity : 0.0}</Paper>
              </Grid>
            );
          })}
        </Grid>
      </Typography>
  </div>
</div>

<h2>Details</h2>
      <div className="rw">
        <div className="clmn">
<Typography variant="h6">Current Balance:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.item.inventory.balance}
      </Typography>
      

      

        </div>
        <div className="clmn">
<Typography variant="h6">Minimum Stock Level:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.minimum_stock_level}
      </Typography>

        </div>
        <div className="clmn">

<Typography variant="h6">Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.quantity}
      </Typography>
        </div>
      </div>
      
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Purchase Schedule"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

import { fetchConsumption } from "../../store/slices/consumptionSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.consumption.consumption,
    fetchDetailAction: fetchConsumption,
  });
  const renderButtons = () => <></>;

  const renderDetails = (data) => (
    <>

    <h2>Primary Information</h2>
    <div className="rw">
      <div className="clmn">
        <Typography variant="h6">Name:</Typography>
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
      
      <h2>Detail</h2>
      <div className="rw">
        <div className="clmn">
<Typography variant="h6">Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.quantity}
      </Typography>

        </div>
        <div className="clmn">
<Typography variant="h6">Reason:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.reason}
      </Typography>

        </div>
        <div className="clmn">

<Typography variant="h6">Consumption Date:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.date}
      </Typography>
        </div>
      </div>
      
      
      
    </>
  );
  return (
    <GenericDetailPage
      titleBase="Consumption"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

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
      <Typography variant="h6">Name:</Typography>
      <Typography variant="body1" className="text-slate-500 mb-2">
        {data.name}
      </Typography>
      <Typography variant="h6">Quantity:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.quantity}
      </Typography>
      <Typography variant="h6">Reason:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.reason}
      </Typography>
      <Typography variant="h6">Consumption:</Typography>
      <Typography variant="body1" className="text-slate-500">
        {data.consumption}
      </Typography>
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

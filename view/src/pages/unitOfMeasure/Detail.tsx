import { fetchUnitOfMeasure } from "../../store/slices/unitOfMeasureSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.unitOfMeasure.unitOfMeasure,
    fetchDetailAction: fetchUnitOfMeasure,
  });

  const renderButtons = () => (
    <>
      <Button
        size='small'
        variant="contained"
        component={Link}
        startIcon={<EditIcon />}
        to={`/unit-of-measure/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data) => (
    <>
      <h2>Primary Information</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Code:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.code}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.name}
          </Typography>
        </div>
      </div>

    </>
  );
  return (
    <GenericDetailPage
      titleBase="Unit of Measure"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

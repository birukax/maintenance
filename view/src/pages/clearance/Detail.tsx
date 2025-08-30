import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { fetchClearance } from "../../store/slices/clearanceSlice";
import { Data } from "../../store/types";
const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.clearance.clearance,
    fetchDetailAction: fetchClearance,
  });
  const renderButtons = () => (
    <>
      <Button
        size='small'
        variant="contained"
        component={Link}
        startIcon={<EditIcon />}
        to={`/clearance/edit/${entityState.id}`}
      >
        Edit
      </Button>
    </>
  );


  console.log(entityState);

  const renderDetails = (data: Data) => (
    <>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Active:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.active ? "True" : "False"}
          </Typography>

        </div>
        <div className="clmn">
          <Typography variant="h6">Break Down:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.breakdown ? "True" : "False"}
          </Typography>

        </div>
      </div>

      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Scheduled:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.scheduled ? "True" : "False"}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Description:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.description}
          </Typography>
        </div>
      </div>

    </>
  );
  return (
    <GenericDetailPage
      titleBase="Clerance"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

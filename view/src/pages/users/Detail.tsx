import { fetchProfile } from "../../store/slices/profileSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { type Data } from '../../store/types';

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.profile.profile,
    fetchDetailAction: fetchProfile,
  });

  const renderButtons = () => (
    <>
      <Button
        size='small'
        startIcon={<EditIcon />}
        variant="contained"
        component={Link}
        to={`/user/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  const renderDetails = (data: Data) => (
    <>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Username:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data?.user?.username}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Email:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.user?.email}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Phone No:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.phone_no}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Role:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.role}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data?.user?.is_active ? "Active" : "Inactive"}
          </Typography>
        </div>
      </div>


    </>
  );


  return (
    <GenericDetailPage
      titleBase="User"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

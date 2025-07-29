
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Delete = ({ handleDeleteActivity, handledeleteModalClose, deleteId, workOrderActivity }) => {

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      {/* <Typography variant="h5" color='primary' className="mb-2! ">
        Delete Activity
      </Typography> */}
      <Box
        className="w-full"
      >
        <Typography color='primary' variant='h6' >
          Are you sure you want to delete this activity?
        </Typography>
        <Box className='flex gap-4 mt-4 justify-end' >
          <Button
            size='small'
            variant="contained"
            onClick={handledeleteModalClose}
          >
            {workOrderActivity.loading ? (
              <CircularProgress size={24} />
            ) : (
              "No"
            )}
          </Button>

          <Button
            size='small'
            variant="outlined"
            onClick={() => handleDeleteActivity(deleteId)}
          >
            {workOrderActivity.loading ? (
              <CircularProgress size={24} />
            ) : (
              "Yes"
            )}
          </Button></Box>
      </Box>
    </Container>
  );
};

export default Delete;

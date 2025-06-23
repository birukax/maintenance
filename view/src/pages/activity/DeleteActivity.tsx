
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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DeleteActivity = ({ handleDeleteActivity,handledeleteModalClose,deleteId,activity}) => {

  return (
    <Container sx={style} className="flex flex-col items-center justify-center">
      <Typography variant="h4" className="mb-6 text-gray-800">
        Delete Activity
      </Typography>
      <Box
        className="form-gap"
      >
       <Typography variant="h6">
        Are you sure you want to delete this activity?
       </Typography>
       <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem"}}>
        <Button
                   variant="outlined"
                   sx={{ mr: 1, padding: ".5rem 2rem", maxHeight: "40px" }}
                   onClick={handledeleteModalClose}
                 >
                   {activity.loading ? (
            <CircularProgress size={24} />
          ) : (
            "Cancel"
          )}
                 </Button>
                 
                 <Button
                   variant="outlined"
                   sx={{ mr: 1, padding: ".5rem 2rem", maxHeight: "40px",backgroundColor:"#ca4335",color:"white"}}
                   onClick={()=>handleDeleteActivity(deleteId)}
                 >
                   {activity.loading ? (
                               <CircularProgress size={24} />
                             ) : (
                               "Delete"
                             )}
                 </Button></Box>
      </Box>
    </Container>
  );
};

export default DeleteActivity;

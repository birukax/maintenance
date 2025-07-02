import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {fetchUserProfile } from "../../store/slices/profileSlice";
import { AppDispatch, AppState } from "../../store/store";
import { Typography, Button, Container, Box, CircularProgress } from "@mui/material";
import { Link, useParams } from "react-router-dom";

const Detail = () => {
  // const { id } = useParams()
  const entityState = useSelector((state: AppState) => state.profile.profile)
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {

    dispatch(fetchUserProfile())

  }, [])
  console.log(entityState);

  const renderButtons = () => (
    <>
      <Button
        size='small'
        variant="contained"
        component={Link}
        to={`/profile/password/change`}
        className="bg-slate-700"
      >
        Change Password
      </Button>
    </>
  );

  const renderDetails = (data) => (


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
        
      </div>


    </>
  );


  return (
    <Container>
      <Typography variant="h6" color='warning' className="mb-2! uppercase tracking-tight!">
        Profile Detail
      </Typography>

      {(entityState.loading) && <CircularProgress />}

      {(!entityState.loading) && !entityState.error && entityState.data && (
        <>
          <Box>{renderButtons()}</Box>
          <Box className="detail-container">{renderDetails(entityState.data)}</Box>
        </>
      )}

    </Container>
  );
};

export default Detail;

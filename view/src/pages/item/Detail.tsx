import React from "react";
import { useSelector } from "react-redux";
import { fetchItem } from "../../store/slices/itemSlice";
import { AppState } from "../../store/store";
import { useEntityDetail } from "../../hooks/useEntityDetail";
import { GenericDetailPage } from "../../components/GenericDetailPage";
import { Typography, Button, Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import { Link } from "react-router-dom";

const Detail = () => {
  const entityState = useEntityDetail({
    detailSelector: (state: AppState) => state.item.item,
    fetchDetailAction: fetchItem,
  });
  const renderButtons = () => (
    <>
      <Button
        variant="contained"
        component={Link}
        to={`/item/edit/${entityState.id}`}
        className="bg-slate-700"
      >
        Edit
      </Button>
    </>
  );

  console.log(entityState);
  
  const renderDetails = (data) => (
    <>
    <h2>Primary Information</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">ID:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.no}
          </Typography>
        </div>
        <div className="clmn"><Typography variant="h6">Name:</Typography>
          <Typography variant="body1" className="text-slate-500 mb-2">
            {data.name}
          </Typography>
        </div>
        <div className="clmn"><Typography variant="h6">Type:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.type}
          </Typography>


        </div>
        <div className="clmn">
          <Typography variant="h6">Category:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.category}
          </Typography></div>
        <div className="clmn">
          <Typography variant="h6">Unit of Measure:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.uom && data.uom.name}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Minimum Stock Level:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.minimum_stock_level}
          </Typography>
        </div>
      </div>

      <h2>Location</h2>
      <div className="rw">
        <div className="clmn">
          <Typography variant="h6">Location:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.shelf && data.shelf?.location?.name}
          </Typography>
        </div>
        <div className="clmn">
          <Typography variant="h6">Shelf:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.shelf && data.shelf?.name}
          </Typography>
        </div>
        <div className="clmn"><Typography variant="h6">Shelf Row:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.row && data.row?.name}
          </Typography>
          </div>
        <div className="clmn"><Typography variant="h6">Shelf Box:</Typography>
          <Typography variant="body1" className="text-slate-500">
            {data.box && data.box?.name}
          </Typography>
          </div>
      </div>
      <h2>Detail</h2>
      <div className="rw">
        <div className="clmn" style={{width:"100%",overflow:"scroll"}}>
        <Typography variant="h6">Suppliers:</Typography>
          <Table sx={{ width:"100%" }} className="table">
            <TableHead>
              <TableRow>
                <TableCell >
                  <Typography noWrap>Supplier</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Email</Typography>
                </TableCell>
                <TableCell>
                  <Typography noWrap>Phone No</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {data.suppliers && data.suppliers?.map((supplier, index) => {
              return (
                  <TableRow key={supplier.id}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone_no}</TableCell>
                  </TableRow>
              );
            })}
                </TableBody>
          </Table>
          </div>
      </div>

    </>
  );

  return (
    <GenericDetailPage
      titleBase="Item"
      id={entityState.id}
      entityState={entityState}
      renderButtons={renderButtons}
      renderDetails={renderDetails}
    />
  );
};

export default Detail;

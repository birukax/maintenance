import { IconButton } from '@mui/material'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

function Pagination(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const ContainerStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: ".5rem",
  };
  const nop = 2;
  const totalPages = Math.ceil((props?.count || 0) / nop);
  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

  // Helper to generate page numbers with dots
  const getDisplayPages = () => {
    if (totalPages <= 5) {
      return pageNumbers;
    }
    if (props.cur <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (props.cur >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', props.cur - 1, props.cur, props.cur + 1, '...', totalPages];
  };

  const currentPagin = (pgNum) => {
    props.setCur(pgNum);
  };
  useEffect(()=>{
    if(searchParams.get("page") !== null){
      props.setCur(Number(searchParams.get("page")))
    }
  },[])
  return (
    <div className='pagination' style={ContainerStyle}>
      {props?.prev !== "null" &&
        <IconButton onClick={() => {
          setSearchParams({ ...Object.fromEntries(searchParams), page: props?.cur - 1 });
          props.searchByPage("page", props.cur - 1);
          currentPagin(props.cur - 1);
        }}
          sx={{ border: "1px solid #5d4037", borderRadius: "5px", padding: "3px", height: "30px", width: "30px" }}
        >
          <ArrowBackIosNewOutlinedIcon sx={{ fontSize: "16px" }} />
        </IconButton>}
      {getDisplayPages().map((pgNumber, idx) =>
        pgNumber === '...' ? (
          <li key={`dots-${idx}`} className="disabled" style={{ pointerEvents: 'none',listStyle:"none"}}>
            <span className="page-link">...</span>
          </li>
        ) : (
          <li
            key={pgNumber}
            className={`page-item ${props.cur === pgNumber ? "active" : ""} `}
            onClick={() => {
              currentPagin(pgNumber);
              props.searchByPage("page", pgNumber);
            }}
          >
            <a
              className="page-link"
              id={`pages pagination${pgNumber}`}
            >
              {pgNumber}
            </a>
          </li>
        )
      )}
      {props.next !== "null" &&
        <IconButton size='small' onClick={() => {
          setSearchParams({ ...Object.fromEntries(searchParams), page: props?.cur + 1 });
          props.searchByPage("page", props.cur + 1);
          currentPagin(props.cur + 1);
        }} sx={{ border: "1px solid #5d4037", borderRadius: "5px", padding: "3px", height: "30px", width: "30px" }}>
          <ArrowForwardIosOutlinedIcon sx={{ fontSize: "16px" }} />
        </IconButton>}
    </div>
  )
}

export default Pagination

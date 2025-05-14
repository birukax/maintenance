import { Button } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
function Pagination(props) {

    const [searchParams,setSearchParams]=useSearchParams()
    const ContainerStyle={
        width:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"flex-start",
        gap:".5rem",
    }
    const nop=5
    const pageNumbers = [...Array(Math.ceil((props?.count || 0)/nop) + 1).keys()].slice(1);
  

  const currentPagin = (pgNum) => {
    props.setCur(pgNum);
  };
    console.log("count",props.count)
    console.log("pn",pageNumbers)

  return (
    <div className='pagination' style={ContainerStyle}>
                {props?.prev!==null &&
            <Button variant="outlined" onClick={()=>{
                setSearchParams({...searchParams,page:props?.cur-1})
                props.searchByPage("page",props.cur-1)
                currentPagin(props.cur-1)
                }} sx={{ mr: 1 }}>
                <ArrowBackIosNewOutlinedIcon/>
              </Button>}
              {pageNumbers.map((pgNumber) => (
          <li
            key={pgNumber}
            className={`page-item ${props.cur == pgNumber ? "active" : ""} `}
            onClick={() => {
                currentPagin(pgNumber)
                props.searchByPage("page",pgNumber)
            }}
          >
            <a
              className="page-link"
              id={`pages pagination${pgNumber}`}
            >
              {pgNumber}
            </a>
          </li>
        ))}
      {props.next!==null &&
            <Button variant="outlined" onClick={()=>{
                setSearchParams({...searchParams,page:props?.cur+1})
                props.searchByPage("page",props.cur+1)
                currentPagin(props.cur+1)
                }} sx={{ mr: 1 }}>
                <ArrowForwardIosOutlinedIcon/>
              </Button>}
    </div>
  )
}

export default Pagination

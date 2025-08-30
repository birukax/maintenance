import { Typography, Container } from "@mui/material";
// import WorkOrderChart from '../charts/WorkOrder';
// import BreakdownChart from "../charts/BreakDown";
const Dashboard = () => {
  return (
    <Container className="flex flex-col items-center mt-8">

      <Typography variant="h6" className="mb-4" mb={4}>
        Dashboard
      </Typography>
      {/* <div>
        <WorkOrderChart />
        <BreakdownChart />
      </div> */}
    </Container>
  )
}

export default Dashboard;
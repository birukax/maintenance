// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import OtherRoutes from "./routes/OtherRoutes";
import ItemRoutes from "./routes/ItemRoutes";
import ReturnRoutes from "./routes/ReturnRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import MachineRoutes from "./routes/MachineRoutes";
import LocationRoutes from "./routes/LocationRoutes";
import ActivityRoutes from "./routes/ActivityRoutes";
import WorkOrderRoutes from "./routes/WorkOrderRoutes";
import EquipmentRoutes from "./routes/EquipmentRoutes";
import ScheduleRoutes from "./routes/ScheduleRoutes";
import ConsumptionRoutes from "./routes/ConsumptionRoutes";
import ActivityTypeRoutes from "./routes/ActivityTypeRoutes";
import WorkOrderTypeRoutes from "./routes/WorkOrderTypeRoutes";
import UnitOfMeasureRoutes from "./routes/UnitOfMeasureRoutes";
import PurchaseRequestRoutes from "./routes/PurchaseRequestRoutes";
import PurchaseScheduleRoutes from "./routes/PurchaseScheduleRoutes";
import BreakdownRoutes from "./routes/BreakdownRoutes";

import "./App.css";
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {OtherRoutes}
      {ItemRoutes}
      {ReturnRoutes}
      {ContactRoutes}
      {MachineRoutes}
      {ActivityRoutes}
      {LocationRoutes}
      {WorkOrderRoutes}
      {ScheduleRoutes}
      {EquipmentRoutes}
      {ConsumptionRoutes}
      {ActivityTypeRoutes}
      {UnitOfMeasureRoutes}
      {WorkOrderTypeRoutes}
      {PurchaseRequestRoutes}
      {PurchaseScheduleRoutes}
      {BreakdownRoutes}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;

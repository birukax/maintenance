// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import OtherRoutes from "./routes/OtherRoutes";
import ApprovalRoutes from "./routes/ApprovalRoutes";
import ItemRoutes from "./routes/ItemRoutes";
import ReturnRoutes from "./routes/ReturnRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import MachineRoutes from "./routes/MachineRoutes";
import plantRoutes from "./routes/PlantRoutes";
import areaRoutes from "./routes/AreaRoutes";
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
import ProfileRoutes from "./routes/ProfileRoutes";
import ShelfRoutes from "./routes/ShelfRoutes";
import ShelfRowRoutes from "./routes/ShelfRowRoutes";
import ShelfBoxRoutes from "./routes/ShelfBoxRoutes";
import LocationRoutes from "./routes/LocationRoutes";
import TransferRoutes from "./routes/transferRoutes";

import "./App.css";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {OtherRoutes}
      {ApprovalRoutes}
      {ItemRoutes}
      {TransferRoutes}
      {ReturnRoutes}
      {ContactRoutes}
      {ProfileRoutes}
      {MachineRoutes}
      {ActivityRoutes}
      {plantRoutes}
      {ShelfRoutes}
      {ShelfRowRoutes}
      {ShelfBoxRoutes}
      {LocationRoutes}
      {areaRoutes}
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

// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ItemRoutes from "./routes/ItemRoutes";
import areaRoutes from "./routes/AreaRoutes";
import OtherRoutes from "./routes/OtherRoutes";
import ShelfRoutes from "./routes/ShelfRoutes";
import plantRoutes from "./routes/PlantRoutes";
import ReturnRoutes from "./routes/ReturnRoutes";
import ProfileRoutes from "./routes/ProfileRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import MachineRoutes from "./routes/MachineRoutes";
import ApprovalRoutes from "./routes/ApprovalRoutes";
import ActivityRoutes from "./routes/ActivityRoutes";
import ScheduleRoutes from "./routes/ScheduleRoutes";
import ShelfRowRoutes from "./routes/ShelfRowRoutes";
import ShelfBoxRoutes from "./routes/ShelfBoxRoutes";
import LocationRoutes from "./routes/LocationRoutes";
import TransferRoutes from "./routes/transferRoutes";
import ClearanceRoutes from "./routes/ClearanceRoutes";
import WorkOrderRoutes from "./routes/WorkOrderRoutes";
import EquipmentRoutes from "./routes/EquipmentRoutes";
import BreakdownRoutes from "./routes/BreakdownRoutes";
import ConsumptionRoutes from "./routes/ConsumptionRoutes";
import ActivityTypeRoutes from "./routes/ActivityTypeRoutes";
import WorkOrderTypeRoutes from "./routes/WorkOrderTypeRoutes";
import UnitOfMeasureRoutes from "./routes/UnitOfMeasureRoutes";
import PurchaseRequestRoutes from "./routes/PurchaseRequestRoutes";
import PurchaseScheduleRoutes from "./routes/PurchaseScheduleRoutes";

import "./App.css";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {ItemRoutes}
      {areaRoutes}
      {plantRoutes}
      {ShelfRoutes}
      {OtherRoutes}
      {ReturnRoutes}
      {ContactRoutes}
      {ProfileRoutes}
      {MachineRoutes}
      {ApprovalRoutes}
      {TransferRoutes}
      {ActivityRoutes}
      {ShelfRowRoutes}
      {ShelfBoxRoutes}
      {LocationRoutes}
      {ScheduleRoutes}
      {ClearanceRoutes}
      {BreakdownRoutes}
      {WorkOrderRoutes}
      {EquipmentRoutes}
      {ConsumptionRoutes}
      {ActivityTypeRoutes}
      {UnitOfMeasureRoutes}
      {WorkOrderTypeRoutes}
      {PurchaseRequestRoutes}
      {PurchaseScheduleRoutes}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;

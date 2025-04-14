// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ItemRoutes from "./routes/ItemRoutes";
import ContactRoutes from "./routes/ContactRoutes";
import PurchaseRequestRoutes from "./routes/PurchaseRequestRoutes";
import PurchaseScheduleRoutes from "./routes/PurchaseScheduleRoutes";
import UnitOfMeasureRoutes from "./routes/UnitOfMeasureRoutes";
import ConsumptionRoutes from "./routes/ConsumptionRoutes";
import ReturnRoutes from "./routes/ReturnRoutes";
import LocationRoutes from "./routes/LocationRoutes";
import ActivityRoutes from "./routes/ActivityRoutes";
import MachineRoutes from "./routes/MachineRoutes";
import EquipmentRoutes from "./routes/EquipmentRoutes";
import OtherRoutes from "./routes/OtherRoutes";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {ItemRoutes}
      {ContactRoutes}
      {ActivityRoutes}
      {PurchaseRequestRoutes}
      {PurchaseScheduleRoutes}
      {UnitOfMeasureRoutes}
      {ConsumptionRoutes}
      {ReturnRoutes}
      {LocationRoutes}
      {MachineRoutes}
      {EquipmentRoutes}
      {OtherRoutes}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;

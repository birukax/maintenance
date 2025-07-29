// src/routes/OtherRoutes.tsx
import { Route } from 'react-router-dom';
import PurchaseApprovalList from "../pages/approval/purchase/List";
import PurchaseApprovalDetail from "../pages/approval/purchase/Detail";
import TransferApprovalList from "../pages/approval/transfer/List";
import TransferApprovalDetail from "../pages/approval/transfer/Detail";
import ProtectedRoute from "../components/ProtectedRoute";

const ApprovalRoutes = [
    <Route
        key="purchase/approval/list"
        path="/purchase-approvals"
        element={
            <ProtectedRoute>
                <PurchaseApprovalList />
            </ProtectedRoute>
        }
    />, <Route
        key='/purchase-approval-detail'
        path='/purchase/approval/detail/:id'
        element={
            <ProtectedRoute>
                <PurchaseApprovalDetail />
            </ProtectedRoute>
        } />,
    <Route
        key="transfer/approval/list"
        path="/transfer-approvals"
        element={
            <ProtectedRoute>
                <TransferApprovalList />
            </ProtectedRoute>
        }
    />,
    <Route
        key='/transfer-approval-detail'
        path='/transfer/approval/detail/:id'
        element={
            <ProtectedRoute>
                <TransferApprovalDetail />
            </ProtectedRoute>
        } />
];

export default ApprovalRoutes;
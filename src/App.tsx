import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SonnerToaster, Toaster, TooltipProvider } from "@/components/ui";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard/page";
import { ActivityLog } from "./pages/ActivityLogs/ActivityLog";
import InwardRequest from "./pages/Transactions/InwardRequest";
import OutwardRequest from "./pages/Transactions/OutwardRequest";
import TaskDetail from "./pages/Transactions/TaskDetail";
import { UserManagement } from "./pages/Masters/UserManagement/page";
import UserCreate from "./pages/Masters/UserManagement/Create";
import UserDetail from "./pages/Masters/UserManagement/Detail";
import UserEdit from "./pages/Masters/UserManagement/Edit";
import { ItemMaster } from "./pages/Masters/ItemMaster/page";
import ItemEdit from "./pages/Masters/ItemMaster/Edit";
import { LocationMaster } from "./pages/Masters/BinMaster/page";
import { HSTMaster } from "./pages/Masters/HSTMaster/page";
import HSTEdit from "./pages/Masters/HSTMaster/Edit";
import { WarehouseMaster } from "./pages/Masters/WarehouseMaster/page";
import { PackageMaster } from "./pages/Masters/PackageMaster/page";
import { FloorMaster } from "./pages/Masters/FloorMaster/page";
import FloorCreate from "./pages/Masters/FloorMaster/Create";
import FloorEdit from "./pages/Masters/FloorMaster/Edit";
import MasterDetail from "./pages/Masters/MasterDetail";
import SettingsPage from "./pages/SettingsPage";
import { DispatchHistory } from "./pages/DispatchHistory/DispatchHistory";
import { InwardHistory } from "./pages/Transactions/InwardHistory";
import { OutwardHistory } from "./pages/Transactions/OutwardHistory";
import { Login } from "./pages/Login/page";
import PutawayPage from "./pages/Transactions/GinManagement/PutawayPage";
import FlowThroughPage from "./pages/Transactions/GinManagement/FlowThroughPage";
import GinDetail from "./pages/Transactions/GinManagement/Detail";
import GinEdit from "./pages/Transactions/GinManagement/Edit";
import GinHeaderEdit from "./pages/Transactions/GinManagement/HeaderEdit";
import GinCreate from "./pages/Transactions/GinManagement/Create";
import GinCreateLine from "./pages/Transactions/GinManagement/CreateLine";
import OutwardListPage from "./pages/Transactions/Outward/OutwardListPage";
import OutwardPicklistPage from "./pages/Transactions/OutwardPicklist/page";
import OutwardPicklistDetail from "./pages/Transactions/OutwardPicklist/Detail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/activity-logs" element={<ActivityLog />} />
                    <Route
                      path="/transactions/InwardRequest"
                      element={<InwardRequest />}
                    />
                    <Route
                      path="/transactions/gin/picklist"
                      element={<OutwardListPage />}
                    />
                    <Route
                      path="/transactions/OutwardRequest"
                      element={<OutwardRequest />}
                    />
                    <Route
                      path="/transactions/tasks/:id"
                      element={<TaskDetail />}
                    />
                    <Route
                      path="/transactions/dispatch-history"
                      element={<DispatchHistory />}
                    />
                    <Route
                      path="/transactions/inward-history"
                      element={<InwardHistory />}
                    />
                    <Route
                      path="/transactions/outward-history"
                      element={<OutwardHistory />}
                    />
                    <Route
                      path="/transactions/gin/picklist"
                      element={<OutwardListPage />}
                    />
                    <Route
                      path="/transactions/gin/picklist/:docEntry"
                      element={<OutwardPicklistDetail />}
                    />
                    <Route
                      path="/transactions/gin/putaway"
                      element={<PutawayPage />}
                    />
                    <Route
                      path="/transactions/gin/flow-through"
                      element={<FlowThroughPage />}
                    />
                    <Route
                      path="/transactions/gin/view/:headerId"
                      element={<GinDetail />}
                    />
                    <Route
                      path="/transactions/gin/view/gp/:gpNumber"
                      element={<GinDetail />}
                    />
                    <Route
                      path="/transactions/gin/view/:headerId/:lineId"
                      element={<GinDetail />}
                    />
                    <Route
                      path="/transactions/gin/edit/:headerId"
                      element={<GinEdit />}
                    />
                    <Route
                      path="/transactions/gin/edit/:headerId/:lineId"
                      element={<GinEdit />}
                    />
                    <Route
                      path="/transactions/gin/create"
                      element={<GinCreate />}
                    />
                    <Route
                      path="/transactions/gin/create-line"
                      element={<GinCreateLine />}
                    />
                    <Route path="/masters/users" element={<UserManagement />} />
                    <Route
                      path="/masters/users/create"
                      element={<UserCreate />}
                    />
                    <Route path="/masters/users/:id" element={<UserDetail />} />
                    <Route
                      path="/masters/users/:id/edit"
                      element={<UserEdit />}
                    />
                    <Route path="/masters/items" element={<ItemMaster />} />

                    <Route
                      path="/masters/items/:id/edit"
                      element={<ItemEdit />}
                    />
                    <Route
                      path="/masters/items/:id"
                      element={<MasterDetail />}
                    />
                    <Route path="/masters/bins" element={<LocationMaster />} />
                    <Route path="/masters/hst" element={<HSTMaster />} />
                    <Route
                      path="/masters/hst/:id/edit"
                      element={<HSTEdit />}
                    />
                    <Route path="/masters/hst/:id" element={<MasterDetail />} />
                    <Route
                      path="/masters/warehouses"
                      element={<WarehouseMaster />}
                    />
                    <Route
                      path="/masters/warehouses/:id"
                      element={<MasterDetail />}
                    />
                    <Route
                      path="/masters/packaging"
                      element={<PackageMaster />}
                    />
                    <Route
                      path="/masters/packaging/:id"
                      element={<MasterDetail />}
                    />
                    <Route path="/masters/floors" element={<FloorMaster />} />
                    <Route
                      path="/masters/floors/create"
                      element={<FloorCreate />}
                    />
                    <Route
                      path="/masters/floors/:id/edit"
                      element={<FloorEdit />}
                    />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

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
import { LocationMaster } from "./pages/Masters/BinMaster/page";
import { HSTMaster } from "./pages/Masters/HSTMaster/page";
import { WarehouseMaster } from "./pages/Masters/WarehouseMaster/page";
import SettingsPage from "./pages/SettingsPage";
import { DispatchHistory } from "./pages/DispatchHistory/DispatchHistory";
import { Login } from "./pages/Login/page";
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
                    <Route path="/masters/bins" element={<LocationMaster />} />
                    <Route path="/masters/hst" element={<HSTMaster />} />
                    <Route
                      path="/masters/warehouses"
                      element={<WarehouseMaster />}
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

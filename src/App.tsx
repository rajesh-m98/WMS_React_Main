import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SonnerToaster, Toaster, TooltipProvider } from "@/components/ui";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard/page";
import InwardRequest from "./pages/InwardRequest";
import OutwardRequest from "./pages/OutwardRequest";
import InwardPickList from "./pages/InwardPickList";
import OutwardPickList from "./pages/OutwardPickList";
import InwardHistory from "./pages/InwardHistory";
import OutwardHistory from "./pages/OutwardHistory";
import TaskDetail from "./pages/TaskDetail";
import { UserManagement } from "./pages/UserManagement/page";
import UserCreate from "./pages/UserManagement/Create";
import UserDetail from "./pages/UserManagement/Detail";
import UserEdit from "./pages/UserManagement/Edit";
import { ItemMaster } from "./pages/ItemMaster/page";
import { LocationMaster } from "./pages/BinMaster/page";
import { HSTMaster } from "./pages/HSTMaster/page";
import { WarehouseMaster } from "./pages/WarehouseMaster/page";
import SettingsPage from "./pages/SettingsPage";
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
                    <Route
                      path="/transactions/InwardRequest"
                      element={<InwardRequest />}
                    />
                    <Route
                      path="/transactions/OutwardRequest"
                      element={<OutwardRequest />}
                    />
                    <Route
                      path="/transactions/picklist/inward"
                      element={<InwardPickList />}
                    />
                    <Route
                      path="/transactions/picklist/outward"
                      element={<OutwardPickList />}
                    />
                    <Route
                      path="/transactions/putaway-inward"
                      element={<InwardHistory />}
                    />
                    <Route
                      path="/transactions/putaway-inward/:id"
                      element={<TaskDetail />}
                    />
                    <Route
                      path="/transactions/putaway-outward"
                      element={<OutwardHistory />}
                    />
                    <Route
                      path="/transactions/putaway-outward/:id"
                      element={<TaskDetail />}
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

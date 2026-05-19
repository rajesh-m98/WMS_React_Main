import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SonnerToaster, Toaster, TooltipProvider } from "@/components/ui";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard/page";
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
import MasterDetail from "./pages/Masters/MasterDetail";
import { PackageList } from "./pages/Masters/PackageMaster/PackageList";
import { CreatePackage } from "./pages/Masters/PackageMaster/CreatePackage";
import PackageDetail from "./pages/Masters/PackageMaster/PackageDetail";
import { FloorMaster } from "./pages/Masters/FloorMaster/page";
import FloorCreate from "./pages/Masters/FloorMaster/Create";
import FloorEdit from "./pages/Masters/FloorMaster/Edit";
import SettingsPage from "./pages/SettingsPage";
import { DispatchHistory } from "./pages/Transactions/Dispatch/History";
import { DispatchDetail } from "./pages/Transactions/Dispatch/Detail";
import { InwardHistory } from "./pages/Transactions/InwardHistory";
import { OutwardHistory } from "./pages/Transactions/OutwardHistory";
import { Login } from "./pages/Login/page";
import PutawayPage from "./pages/Transactions/GinManagement/PutawayPage";
import FlowThroughPage from "./pages/Transactions/GinManagement/FlowThroughPage";
import GinHeaderListPage from "./pages/Transactions/GinManagement/GinHeaderListPage";
import GinDetail from "./pages/Transactions/GinManagement/Detail";
import GinEdit from "./pages/Transactions/GinManagement/Edit";
import GinHeaderEdit from "./pages/Transactions/GinManagement/HeaderEdit";
import GinCreate from "./pages/Transactions/GinManagement/Create";
import GinCreateLine from "./pages/Transactions/GinManagement/CreateLine";
import OutwardListPage from "./pages/Transactions/Outward/OutwardListPage";
import OutwardPicklistPage from "./pages/Transactions/OutwardPicklist/page";
import OutwardPicklistDetail from "./pages/Transactions/OutwardPicklist/Detail";
import FlowthroughTransferPage from "./pages/Transactions/FlowthroughTransfer/FlowthroughTransferPage";
import PicklistGenerationPage from "./pages/Transactions/PicklistGeneration/PicklistGenerationPage";
import FlowthroughDispatchDetailPage from "./pages/Transactions/FlowthroughDispatch/FlowthroughDispatchDetailPage";
import OnwardPicklistPage from "./pages/Transactions/PicklistSorting/OnwardPicklistPage";
import OnwardPicklistDetailPage from "./pages/Transactions/PicklistSorting/OnwardPicklistDetailPage";
import PicklistDispatchPage from "./pages/Transactions/PicklistDispatch/PicklistDispatchPage";
import PicklistDispatchDetailPage from "./pages/Transactions/PicklistDispatch/PicklistDispatchDetailPage";
import NotFound from "./pages/NotFound";
import PutawayLocationDetail from "./pages/Transactions/GinManagement/PutawayLocationDetail";
import PicklistGenerationDetailPage from "./pages/Transactions/PicklistGeneration/PicklistGenerationDetailPage";
import FlowthroughTransferDetailPage from "./pages/Transactions/FlowthroughTransfer/FlowthroughTransferDetailPage";
import FlowthroughDispatchPage from "./pages/Transactions/FlowthroughDispatch/FlowthroughDispatchPage";
import ManualPicklistResultPage from "./pages/Transactions/PicklistGeneration/ManualPicklistResultPage";

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
                      path="/transactions/dispatch/:whsCode"
                      element={<DispatchDetail />}
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
                      path="/transactions/flow-through/transfer"
                      element={<FlowthroughTransferPage />}
                    />
                    <Route
                      path="/transactions/flow-through/transfer/:id"
                      element={<FlowthroughTransferDetailPage />}
                    />
                    <Route
                      path="/transactions/picklist/generation"
                      element={<PicklistGenerationPage />}
                    />
                    <Route
                      path="/transactions/picklist/generation/:id"
                      element={<PicklistGenerationDetailPage />}
                    />
                    <Route
                      path="/transactions/picklist/manual-result"
                      element={<ManualPicklistResultPage />}
                    />
                    <Route
                      path="/transactions/ft-dispatch/warehouse/:whsCode"
                      element={<FlowthroughDispatchDetailPage />}
                    />
                    <Route
                      path="/transactions/ft-dispatch"
                      element={<FlowthroughDispatchPage />}
                    />
                    <Route
                      path="/transactions/picklist/sorting"
                      element={<OnwardPicklistPage />}
                    />
                    <Route
                      path="/transactions/picklist/sorting/:id"
                      element={<OnwardPicklistDetailPage />}
                    />
                    <Route
                      path="/transactions/picklist/dispatch"
                      element={<PicklistDispatchPage />}
                    />
                    <Route
                      path="/transactions/picklist/dispatch/warehouse/:whsCode"
                      element={<PicklistDispatchDetailPage />}
                    />
                    <Route
                      path="/transactions/gin/:type/headers/:gpNumber"
                      element={<GinHeaderListPage />}
                    />
                    <Route
                      path="/transactions/gin/view/:type/:headerId"
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
                      path="/transactions/gin/putaway-location/:headerId/:lineId"
                      element={<PutawayLocationDetail />}
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
                    <Route path="/masters/hst/:id/edit" element={<HSTEdit />} />
                    <Route path="/masters/hst/:id" element={<MasterDetail />} />
                    <Route
                      path="/masters/warehouses"
                      element={<WarehouseMaster />}
                    />
                    <Route
                      path="/masters/warehouses/:id"
                      element={<MasterDetail />}
                    />
                    <Route path="/masters/packages" element={<PackageList />} />
                    <Route
                      path="/masters/packages/create"
                      element={<CreatePackage />}
                    />
                    <Route
                      path="/masters/packages/detail/:whsCode"
                      element={<PackageDetail />}
                    />
                    <Route
                      path="/masters/packages/:id"
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

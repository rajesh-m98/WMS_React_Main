import {
  LayoutDashboard,
  Home,
  Settings,
  ArrowLeftRight,
  PackagePlus,
  PackageMinus,
  ClipboardList,
  ClipboardCheck,
  History,
  Archive,
  Users,
  Box,
  Grid3X3,
  Smartphone,
  Warehouse,
  ChevronDown,
  Activity,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui";
import { useAppDispatch } from "@/app/store";
import {
  handleFetchInwardRequests,
  handleFetchOutwardRequests,
} from "@/app/manager/requestManager";
import {
  fetchInwardPickLists,
  fetchOutwardPickLists,
} from "@/app/store/picklistSlice";
import {
  fetchInwardHistory,
  fetchOutwardHistory,
} from "@/app/store/historySlice";
import { handleFetchBins } from "@/app/manager/binManager";
import { handleFetchUsers } from "@/app/manager/masterManager";
import { handleFetchAllItems } from "@/app/manager/itemManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";
import { handleFetchAllHST } from "@/app/manager/hstManager";
import { handleFetchDispatchHistory } from "@/app/manager/dispatchManager";
import { handleFetchPutawayHistory } from "@/app/manager/putawayManager";

export function AppSidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isItemActive = (url: string) => {
    return location.pathname.startsWith(url);
  };

  const handleSidebarClick = (url: string) => {
    // Standard params for initial load
    const params = { page: 1, size: 10, search: "" };

    switch (url) {
      case "/masters/users":
        dispatch(handleFetchUsers({ companyid: 1 }));
        break;
      case "/masters/hst":
        dispatch(handleFetchAllHST({ companyid: 1 }));
        break;
      case "/masters/bins":
        dispatch(handleFetchBins());
        break;
      case "/masters/items":
        dispatch(handleFetchAllItems());
        break;
      case "/masters/warehouses":
        dispatch(handleFetchAllWarehouses());
        break;
      case "/transactions/dispatch-history":
        dispatch(handleFetchDispatchHistory({ page: 1, size: 15 }));
        break;
      case "/transactions/inward-history":
        dispatch(handleFetchPutawayHistory("inward", { page: 1, size: 15 }));
        break;
      case "/transactions/outward-history":
        dispatch(handleFetchPutawayHistory("outward", { page: 1, size: 15 }));
        break;

      // Transactions
      case "/transactions/InwardRequest":
        break;
      case "/transactions/OutwardRequest":
        break;
      default:
        break;
    }
  };

  const SubMenuItem = ({
    title,
    url,
    icon: Icon,
  }: {
    title: string;
    url: string;
    icon: any;
  }) => (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isItemActive(url)}>
        <NavLink
          to={url}
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl table-cell-bold transition-all duration-300 ${
            isItemActive(url)
              ? "bg-blue-600 text-white shadow-md shadow-blue-100/50"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
          }`}
          activeClassName=""
          onClick={() => handleSidebarClick(url)}
        >
          <Icon
            className={`icon-sm shrink-0 transition-colors ${isItemActive(url) ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
          />
          <div className="whitespace-nowrap relative z-10">{title}</div>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );

  return (
    <Sidebar className="border-r border-border bg-white selection:bg-blue-100">
      <SidebarHeader className="h-[72px] flex flex-row items-center px-6 border-b border-border gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200/60 ring-2 ring-blue-50">
          <Box className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div className="flex flex-col">
          <h1 className="heading-section !text-2xl">WMS</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3.5 py-8 gap-6 scrollbar-hide">
        {/* Dashboard Section */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isItemActive("/dashboard")}>
              <NavLink
                to="/dashboard"
                className={`flex items-center gap-3.5 px-4 py-4 rounded-lg transition-all duration-300 ${
                  isItemActive("/dashboard")
                    ? "bg-blue-600 text-white font-bold shadow-xl shadow-blue-200/80 scale-[1.02]"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                activeClassName=""
                onClick={() => handleSidebarClick("/dashboard")}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${isItemActive("/dashboard") ? "bg-white/20" : "bg-slate-100 group-hover:bg-blue-100/50"}`}
                >
                  <Home
                    className={`icon-base shrink-0 ${isItemActive("/dashboard") ? "text-black" : "text-slate-500 group-hover:text-blue-600"}`}
                  />
                </div>
                <span className="body-strong">Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Master Data Section */}
        <SidebarGroup className="p-0">
          <Collapsible defaultOpen={true} className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-slate-50/80 rounded-2xl transition-all group/btn">
                <div className="flex items-center gap-3.5">
                  <div className="p-1.5 rounded-xl bg-slate-100 group-hover/btn:bg-blue-100/50 transition-colors">
                    <Settings className="icon-base text-slate-500 group-hover/btn:text-blue-600" />
                  </div>
                  <span className="body-strong !text-slate-800">Masters</span>
                </div>
                <ChevronDown className="icon-sm text-slate-400 group-data-[state=open]/collapsible:rotate-180 transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
              <SidebarMenuSub className="mt-2 space-y-1 ml-3 border-l-2 border-slate-100 pb-2">
                <SubMenuItem
                  title="User Master"
                  url="/masters/users"
                  icon={Users}
                />
                <SubMenuItem
                  title="HHT Master"
                  url="/masters/hst"
                  icon={Smartphone}
                />
                <SubMenuItem
                  title="Location Master"
                  url="/masters/bins"
                  icon={Grid3X3}
                />
                <SubMenuItem
                  title="Item Master"
                  url="/masters/items"
                  icon={Box}
                />
                <SubMenuItem
                  title="Warehouse Master"
                  url="/masters/warehouses"
                  icon={Warehouse}
                />
                <SubMenuItem
                  title="Package Master"
                  url="/masters/packaging"
                  icon={Archive}
                />
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Transactions Section */}
        <SidebarGroup className="p-0">
          <Collapsible defaultOpen={true} className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="flex items-center justify-between w-full px-4 py-3.5 hover:bg-slate-50/80 rounded-2xl transition-all group/btn">
                <div className="flex items-center gap-3.5">
                  <div className="p-1.5 rounded-xl bg-slate-100 group-hover/btn:bg-blue-100/50 transition-colors">
                    <ArrowLeftRight className="icon-base text-slate-500 group-hover/btn:text-blue-600" />
                  </div>
                  <span className="body-strong !text-slate-800">
                    Transactions
                  </span>
                </div>
                <ChevronDown className="icon-sm text-slate-400 group-data-[state=open]/collapsible:rotate-180 transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
              <SidebarMenuSub className="mt-2 space-y-1 ml-3 border-l-2 border-slate-100 pb-2">
                <SubMenuItem
                  title="Inward Putaway"
                  url="/transactions/inward-history"
                  icon={PackagePlus}
                />
                <SubMenuItem
                  title="Outward Picklist"
                  url="/transactions/outward-history"
                  icon={PackageMinus}
                />
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Activity Logs Section */}
        <SidebarMenu className="mt-2 caption-small px-4">
          System Auditing
        </SidebarMenu>
        <SidebarMenu>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isItemActive("/activity-logs")}
            >
              <NavLink
                to="/activity-logs"
                className={`flex items-center gap-3.5 px-4 py-4 rounded-lg transition-all duration-300 ${
                  isItemActive("/activity-logs")
                    ? "bg-blue-600 text-white font-bold shadow-xl shadow-blue-200/80 scale-[1.02]"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                activeClassName=""
                onClick={() => handleSidebarClick("/activity-logs")}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${isItemActive("/activity-logs") ? "bg-white/20" : "bg-slate-100 group-hover:bg-blue-100/50"}`}
                >
                  <Activity
                    className={`icon-base shrink-0 ${isItemActive("/activity-logs") ? "text-slate-700" : "text-slate-500 group-hover:text-blue-600"}`}
                  />
                </div>
                <span className="body-strong">Activity Logs</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem> */}

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isItemActive("/transactions/dispatch-history")}
            >
              <NavLink
                to="/transactions/dispatch-history"
                className={`flex items-center gap-3.5 px-4 py-4 rounded-lg transition-all duration-300 ${
                  isItemActive("/transactions/dispatch-history")
                    ? "bg-blue-600 text-white font-bold shadow-xl shadow-blue-200/80 scale-[1.02]"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
                activeClassName=""
                onClick={() =>
                  handleSidebarClick("/transactions/dispatch-history")
                }
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${isItemActive("/transactions/dispatch-history") ? "bg-white/20" : "bg-slate-100 group-hover:bg-blue-100/50"}`}
                >
                  <ClipboardList
                    className={`icon-base shrink-0 ${isItemActive("/transactions/dispatch-history") ? "text-slate-700" : "text-slate-500 group-hover:text-blue-600"}`}
                  />
                </div>
                <span className="body-strong">Dispatch History</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

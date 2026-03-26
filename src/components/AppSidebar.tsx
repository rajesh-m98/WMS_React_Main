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
  fetchInwardRequests,
  fetchOutwardRequests,
} from "@/app/store/requestSlice";
import {
  fetchInwardPickLists,
  fetchOutwardPickLists,
} from "@/app/store/picklistSlice";
import {
  fetchInwardHistory,
  fetchOutwardHistory,
} from "@/app/store/historySlice";
import { handleFetchDashboardData } from "@/app/manager/dashboardManager";
import { handleFetchBins } from "@/app/manager/binManager";
import { handleFetchUsers } from "@/app/manager/masterManager";
import { handleFetchAllItems } from "@/app/manager/itemManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";
import { handleFetchAllHST } from "@/app/manager/hstManager";

export function AppSidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isItemActive = (url: string) => {
    return location.pathname === url;
  };

  const handleSidebarClick = (url: string) => {
    // Standard params for initial load
    const params = { page: 1, size: 10, search: "" };

    switch (url) {
      // Dashboard
      case "/dashboard":
        dispatch(handleFetchDashboardData());
        break;

      // Masters
      case "/masters/users":
        dispatch(handleFetchUsers(1));
        break;
      case "/masters/hst":
        dispatch(handleFetchAllHST(1));
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

      // Transactions
      case "/transactions/InwardRequest":
        dispatch(
          fetchInwardRequests({ ...params, from_date: "", to_date: "" }),
        );
        break;
      case "/transactions/OutwardRequest":
        dispatch(
          fetchOutwardRequests({ ...params, from_date: "", to_date: "" }),
        );
        break;
      case "/transactions/picklist/inward":
        dispatch(fetchInwardPickLists(params));
        break;
      case "/transactions/picklist/outward":
        dispatch(fetchOutwardPickLists(params));
        break;
      case "/transactions/putaway-inward":
        dispatch(fetchInwardHistory({ page: 1, size: 10 }));
        break;
      case "/transactions/putaway-outward":
        dispatch(fetchOutwardHistory({ page: 1, size: 10 }));
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
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-[13px] transition-all duration-300 ${
            isItemActive(url)
              ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-100/50"
              : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
          }`}
          activeClassName=""
          onClick={() => handleSidebarClick(url)}
        >
          <Icon
            className={`h-4 w-4 shrink-0 transition-colors ${isItemActive(url) ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
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
          <h1
            className="text-xl font-black text-slate-900 tracking-tighter leading-none"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            WMS
          </h1>
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
                    className={`h-5 w-5 shrink-0 ${isItemActive("/dashboard") ? "text-black" : "text-slate-500 group-hover:text-blue-600"}`}
                  />
                </div>
                <span className="text-[15px] font-bold tracking-tight">
                  Dashboard
                </span>
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
                    <Settings className="h-5 w-5 text-slate-500 group-hover/btn:text-blue-600" />
                  </div>
                  <span className="text-[15px] font-bold text-slate-800 tracking-tight">
                    Masters
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 group-data-[state=open]/collapsible:rotate-180 transition-transform" />
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
                  title="HST Master"
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
                    <ArrowLeftRight className="h-5 w-5 text-slate-500 group-hover/btn:text-blue-600" />
                  </div>
                  <span className="text-[15px] font-bold text-slate-800 tracking-tight">
                    Transactions
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 group-data-[state=open]/collapsible:rotate-180 transition-transform" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
              <SidebarMenuSub className="mt-2 space-y-1 ml-3 border-l-2 border-slate-100 pb-2">
                <SubMenuItem
                  title="Inward Putaway"
                  url="/transactions/putaway-inward"
                  icon={History}
                />
                <SubMenuItem
                  title="Outward PickList"
                  url="/transactions/picklist/outward"
                  icon={ClipboardCheck}
                />
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Activity Logs Section */}
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
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
                    className={`h-5 w-5 shrink-0 ${isItemActive("/activity-logs") ? "text-slate-700" : "text-slate-500 group-hover:text-blue-600"}`}
                  />
                </div>
                <span className="text-[15px] font-bold tracking-tight">
                  Activity Logs
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

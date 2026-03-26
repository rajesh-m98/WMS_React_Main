import { SidebarProvider } from "@/components/ui";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, MapPin, Settings, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setSignOut } from "@/app/store/authSlice";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(setSignOut());
    navigate("/login");
  };

  const userEmail = userData?.email || "admin@wms.com";
  const initials = userEmail.charAt(0).toUpperCase();

  const getPageInfo = (path: string) => {
    if (path.includes("/masters/users/create"))
      return { title: "Add User", description: "Create a new system user" };
    if (path.includes("/masters/users/"))
      return { title: "User Details", description: "View system user details" };
    if (
      path.includes("/transactions/putaway-inward/") ||
      path.includes("/transactions/putaway-outward/")
    )
      return {
        title: "Task Details",
        description: "Comprehensive View of Execution and Item Audit",
      };

    const pageData: { [key: string]: { title: string; description: string } } =
      {
        "/dashboard": {
          title: "Dashboard",
          description: "Overview of warehouse operations and activity",
        },
        "/masters/users": {
          title: "User Master",
          description: "Manage application users and their roles",
        },
        "/masters/hst": {
          title: "HST Master",
          description: "Manage handheld terminal devices",
        },
        "/masters/bins": {
          title: "Bin Master",
          description: "Manage warehouse bin locations",
        },
        "/masters/items": {
          title: "Item Master",
          description: "Manage inventory items and attributes",
        },
        "/masters/warehouses": {
          title: "Warehouse Master",
          description: "Manage warehouse facilities",
        },
        "/transactions/InwardRequest": {
          title: "Inward Request",
          description: "Create and manage inward warehouse requests",
        },
        "/transactions/OutwardRequest": {
          title: "Outward Request",
          description: "Create and manage outward warehouse requests",
        },
        "/transactions/picklist/inward": {
          title: "Inward PickList",
          description: "Manage picklists for inward items",
        },
        "/transactions/picklist/outward": {
          title: "Outward PickList",
          description: "Manage picklists for outward items",
        },
        "/transactions/putaway-inward": {
          title: "Inward History",
          description: "View history of inward transactions",
        },
        "/transactions/putaway-outward": {
          title: "Outward History",
          description: "View history of outward transactions",
        },
      };
    return (
      pageData[path] || {
        title: "WMS",
        description: "Warehouse Management System",
      }
    );
  };

  const { title, description } = getPageInfo(location.pathname);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[72px] flex items-center justify-between border-b border-border bg-card px-8 shrink-0">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-blue-600 tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 rounded-xl hover:bg-slate-50 p-1.5 pr-4 transition-all duration-300 border border-transparent hover:border-slate-100 shadow-sm active:scale-[0.98]">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-100">
                      {initials}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-bold text-slate-900 leading-tight">
                        Admin
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 leading-tight uppercase tracking-wider">
                        Super User
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-2 rounded-2xl shadow-xl border-slate-100 animate-in zoom-in-95 duration-200"
                >
                  <div className="px-2 py-3 mb-2 bg-slate-50/50 rounded-xl">
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">
                      Account Status
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {userEmail}
                    </p>
                  </div>
                  <DropdownMenuItem
                    className="gap-3 py-2.5 px-3 rounded-xl cursor-pointer text-slate-600 hover:text-blue-600 hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                    onClick={() => navigate("/settings")}
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium text-sm">My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-3 py-2.5 px-3 rounded-xl cursor-pointer text-slate-600 hover:text-blue-600 hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="font-medium text-sm">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-slate-100" />
                  <DropdownMenuItem
                    className="gap-3 py-2.5 px-3 rounded-xl cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="font-bold text-sm">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-slate-50/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

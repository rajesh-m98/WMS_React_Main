import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  ChevronLeft,
  Pencil,
  Smartphone,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  MailCheck,
  UserIcon,
  Clock,
  Loader2,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Overlays/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchUserById } from "@/app/manager/masterManager";
import config from "./UserConfig.json";

const UserDetail = () => {
  const strings = config.strings.detail;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    currentUser: user,
    loading,
    error,
  } = useAppSelector((state) => state.master.users);

  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(handleFetchUserById(Number(id)));
    }
  }, [id, dispatch]);

  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500 font-medium">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="uppercase  text-[10px] font-black">
          Fetching user profile...
        </p>
      </div>
    );

  if (error || !user)
    return (
      <div className="p-20 text-center">
        <p className="text-rose-500 font-black uppercase tracking-widest mb-4">
          {error || "User not found"}
        </p>
        <Button onClick={() => navigate("/masters/users")}>
          Back to Users
        </Button>
      </div>
    );

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-4 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/masters/users")}
            className="rounded-full hover:bg-slate-100 shadow-lg shadow-slate-250/100 h-10 w-10 transition-all border border-slate-100 bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h2 className="heading-section !text-2xl">{strings.title}</h2>
            <p className="caption-small !text-slate-400 italic uppercase">
              ID: {user.userid}
            </p>
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl px-6 body-strong transition-all active:scale-95"
          onClick={() => setShowPermissions(true)}
        >
          <ShieldCheck className="icon-sm mr-2" /> View Permissions
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-5 p-2">
        {/* Left Column: Personal Information (7 Columns) */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="border-0 shadow-lg shadow-slate-250/100 rounded-2xl overflow-hidden bg-white h-full">
            <CardHeader className="bg-slate-50/50 border-b border-b-2 border-slate-200 py-3 px-6">
              <CardTitle className="caption-medium !text-slate-500 flex items-center gap-2 uppercase tracking-widest leading-none">
                <UserIcon className="icon-sm" /> {strings.personalSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-y-7 gap-x-10">
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.fullName}
                </p>
                <p className="body-strong !text-slate-800 uppercase leading-tight">
                  {user.firstname} {user.lastname}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.email}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 decoration-blue-500/30 underline-offset-4">
                  <Mail className="icon-sm text-blue-500" /> {user.email || "-"}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.phone}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3">
                  <Phone className="icon-sm text-indigo-500" />{" "}
                  {user.mobile_number || "-"}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  Department
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                  <Building2 className="icon-sm text-slate-400" />{" "}
                  {user.department || "-"}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.role}
                </p>
                <div className="flex pt-1">
                  {Number(user.role) === 2 ? (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-100 hover:bg-purple-200 hover:text-purple-800 transition-colors px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
                      Super User
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-100 hover:bg-blue-200 hover:text-blue-800 transition-colors px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
                      Operator
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.status}
                </p>
                <div className="flex pt-1">
                  <Badge
                    className={`px-4 py-1 rounded-full border-0 text-[10px] font-black transition-colors uppercase tracking-tight ${
                      user.status?.toLowerCase() === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  Emp ID
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                  <ShieldCheck className="icon-sm text-slate-400" />{" "}
                  {user.employee_id || "-"}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  Username
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                  <UserIcon className="icon-sm text-slate-400" />{" "}
                  {user.username || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Workplace & Access (5 Columns) */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="border-0 shadow-lg shadow-slate-250/100 rounded-2xl overflow-hidden bg-white h-full flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b border-b-2 border-slate-200 py-3 px-6">
              <CardTitle className="caption-medium !text-slate-500 flex items-center gap-2 uppercase tracking-widest leading-none">
                <Building2 className="icon-sm" />{" "}
                {strings.workplaceSection || "Workplace & Access"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-grow flex flex-col space-y-8">
              {/* Primary Facility Info */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5">
                  <p className="label-bold !text-slate-400 tracking-widest uppercase">
                    {strings.labels.warehouse}
                  </p>
                  <div className="space-y-1">
                    <p className="body-strong !text-slate-800 uppercase text-sm">
                      {user.db_warehouse?.warehouse_name || "Not Assigned"}
                    </p>
                    <p className="caption-small text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block">
                      {user.db_warehouse?.warehouse_code || "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5 text-right">
                  <p className="label-bold !text-slate-400 tracking-widest uppercase">
                    Reporting Manager
                  </p>
                  <p className="body-strong !text-slate-800 uppercase text-sm">
                    {user.reportingmanager || "No Manager"}
                  </p>
                  <p className="caption-small !text-slate-400">
                    Outlet: {user.outlet || "-"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="label-bold !text-slate-400 tracking-widest uppercase">
                    GST Number
                  </p>
                  <p className="body-strong !text-slate-800 text-sm">
                    {user.db_warehouse?.gstnumber || "-"}
                  </p>
                </div>
                <div className="space-y-1.5 text-right">
                  <p className="label-bold !text-slate-400 tracking-widest uppercase">
                    Branch Detail
                  </p>
                  <p className="body-strong !text-slate-800 uppercase text-sm">
                    {user.db_warehouse?.bplname || "-"}
                  </p>
                  <p className="caption-small !text-slate-400">
                    BPL ID: {user.db_warehouse?.bplid || "-"}
                  </p>
                </div>
              </div>

              {/* Address Section */}
              <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 h-1 bg-blue-600 rounded-full" />
                  <p className="label-bold text-slate-900 tracking-widest uppercase text-xs">
                    Facility Location
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="label-bold !text-slate-400 text-[10px] uppercase">
                      Street / Area
                    </p>
                    <p className="text-[13px] font-bold text-slate-700 leading-snug">
                      {user.db_warehouse?.location} <br />
                      {user.db_warehouse?.street} <br />
                      {user.db_warehouse?.block}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="label-bold !text-slate-400 text-[10px] uppercase">
                      City / ZIP
                    </p>
                    <p className="text-[13px] font-bold text-slate-700">
                      {user.db_warehouse?.city} <br />
                      {user.db_warehouse?.state} - {user.db_warehouse?.zipcode}
                      <br />
                      {user.db_warehouse?.country}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Permissions Modal */}
      <AlertDialog open={showPermissions} onOpenChange={setShowPermissions}>
        <AlertDialogContent className="max-w-xl rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
          <AlertDialogHeader className="bg-slate-900 p-8 text-white text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
            <AlertDialogTitle className="flex items-center gap-4 text-2xl font-black uppercase tracking-tight relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 transition-transform hover:scale-105">
                <ListChecks className="h-6 w-6 text-white" />
              </div>
              Module Access Audit
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2 ml-1 relative z-10">
              Assigned Permissions Profile for:{" "}
              <span className="text-blue-400">{user.username}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-8 bg-white overflow-y-auto max-h-[500px] scrollbar-premium">
            <div className="grid grid-cols-1 gap-8">
              {user.permission && user.permission.length > 0 ? (
                user.permission.map((perm, index) => (
                  <div key={perm.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`px-4 py-1.5 rounded-full border-0 label-bold !tracking-widest capitalize ${
                          perm.operation_type?.toLowerCase() === "write"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {perm.operation_type} Access
                      </Badge>
                      <div className="h-[2px] flex-1 bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {perm.operation_pages.map((page, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300"
                        >
                          <div
                            className={`h-2 w-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] ${
                              perm.operation_type?.toLowerCase() === "write"
                                ? "bg-rose-500 shadow-rose-200"
                                : "bg-blue-500 shadow-blue-200"
                            }`}
                          />
                          <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                            {page.replace(/_/g, " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
                  <ShieldCheck className="h-20 w-20 text-slate-300" />
                  <p className="text-center text-slate-400 text-sm font-black uppercase tracking-widest">
                    No permissions assigned
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-4">
            <AlertDialogAction
              onClick={() => setShowPermissions(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-[0.98] transition-all border-0"
            >
              close{" "}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDetail;

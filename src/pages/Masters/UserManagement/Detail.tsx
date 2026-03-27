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
          className="bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-300 rounded-xl px-6 body-strong shadow-lg shadow-slate-200 transition-all active:scale-95"
          onClick={() => navigate(`/masters/users/${id}/edit`)}
        >
          <Pencil className="icon-sm mr-2" /> {strings.editBtn}
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
                  {user.username}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.email}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 decoration-blue-500/30 underline-offset-4">
                  <Mail className="icon-sm text-blue-500" />{" "}
                  {user.email_id || "-"}
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
                  {strings.labels.joined}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                  <Clock className="icon-sm text-slate-400" />{" "}
                  {new Date(user.created_at || "").toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.role}
                </p>
                <div className="flex pt-1">
                  {Number(user.role) === 2 ? (
                    <Badge className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 hover:text-purple-800 transition-colors px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
                      Super User
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 hover:text-blue-800 transition-colors px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
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
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.identity || "Identity"}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                  <ShieldCheck className="icon-sm text-slate-400" />{" "}
                  {user.userid || "-"}
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="label-bold !text-slate-400 tracking-widest">
                  {strings.labels.updated || "Last Update"}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                  <Clock className="icon-sm text-slate-400" />{" "}
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString()
                    : "-"}
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
            <CardContent className="p-6 flex-grow flex flex-col">
              {/* Workplace Details Section */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <p className="label-bold !text-slate-400 tracking-widest">
                    {strings.labels.warehouse}
                  </p>
                  <div className="space-y-1.5">
                    <p className="body-strong !text-slate-800 uppercase leading-none">
                      {user.db_warehouse?.warehouse_name || "Not Assigned"}
                    </p>
                    <p className="caption-small text-blue-600 bg-blue-50/50 inline-block px-3 py-1 rounded border border-blue-100 tracking-tighter">
                      CODE: {user.db_warehouse?.warehouse_code || "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="label-bold !text-slate-400 tracking-widest">
                    {strings.labels.device}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="body-strong !text-slate-800 uppercase leading-none">
                        {user.db_device?.device_type || "No Device"}
                      </p>
                      <p className="caption-small !text-slate-400 tracking-widest leading-none">
                        SN: {user.db_device?.device_serial_number || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative mb-8">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-b-2 border-slate-200"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-white pr-4 label-bold !text-slate-400 tracking-widest">
                    {strings.quickActions}
                  </span>
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-b-2 border-slate-200 group transition-all hover:bg-white hover:shadow-md hover:border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="body-strong !text-slate-700 tracking-tight uppercase leading-none">
                      {strings.actions.permissions}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPermissions(true)}
                    className="caption-medium text-blue-600 transition-colors hover:text-blue-700"
                  >
                    {strings.actions.view}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-b-2 border-slate-200 group transition-all hover:bg-white hover:shadow-md hover:border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <MailCheck className="w-5 h-5" />
                    </div>
                    <span className="body-strong !text-slate-700 tracking-tight uppercase leading-none">
                      {strings.actions.resetPassword}
                    </span>
                  </div>
                  <button className="caption-medium text-blue-600 transition-colors hover:text-blue-700">
                    {strings.actions.send}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Permissions Modal */}
      <AlertDialog open={showPermissions} onOpenChange={setShowPermissions}>
        <AlertDialogContent className="max-w-md rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
          <AlertDialogHeader className="bg-slate-900 p-6 text-white text-left">
            <AlertDialogTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-tight">
              <ListChecks className="h-6 w-6 text-blue-400" />
              User Module Access
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
              Currently assigned permissions for {user.username}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-6 bg-white overflow-y-auto max-h-[400px]">
            <div className="grid grid-cols-1 gap-2">
              {user.permission ? (
                user.permission.split(",").map((perm, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
                      {perm.trim()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-slate-400 text-sm font-black uppercase tracking-widest">
                  No permissions assigned
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter className="p-4 bg-slate-50 border-t border-slate-100">
            <AlertDialogAction
              onClick={() => setShowPermissions(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDetail;

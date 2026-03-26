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
} from "lucide-react";
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

  useEffect(() => {
    if (id) {
      dispatch(handleFetchUserById(Number(id)));
    }
  }, [id, dispatch]);

  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500 font-medium">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="uppercase tracking-[0.2em] text-[10px] font-black">
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
    <div className="space-y-3 max-w-7xl mx-auto pb-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/masters/users")}
            className="rounded-full hover:bg-slate-100 h-10 w-10 transition-all border border-slate-100 bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h2 className="heading-section !text-2xl">
              {strings.title}
            </h2>
            <p className="caption-small !text-slate-400 italic">
              ID: {user.userid}
            </p>
          </div>
        </div>
        <Button
          className="bg-slate-900 hover:bg-slate-800 rounded-xl px-6 body-strong shadow-lg shadow-slate-200 transition-all active:scale-95"
          onClick={() => navigate(`/masters/users/${id}/edit`)}
        >
          <Pencil className="icon-sm mr-2" /> {strings.editBtn}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white h-full flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <UserIcon className="icon-sm" /> {strings.personalSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 flex-1">
              <div className="space-y-1">
                <p className="caption-small !text-slate-400">
                  {strings.labels.fullName}
                </p>
                <p className="body-strong !text-slate-800">
                  {user.username}
                </p>
              </div>
              <div className="space-y-1">
                <p className="caption-small !text-slate-400">
                  {strings.labels.email}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3 decoration-blue-500/30 underline-offset-4">
                  <Mail className="icon-sm text-blue-500" />{" "}
                  {user.email_id || "No email provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="caption-small !text-slate-400">
                  {strings.labels.phone}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3">
                  <Phone className="icon-sm text-indigo-500" />{" "}
                  {user.mobile_number || "No mobile provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="caption-small !text-slate-400">
                  {strings.labels.role}
                </p>
                <div className="flex pt-1">
                  {Number(user.role) === 2 ? (
                    <Badge className="bg-purple-50 text-purple-700 border-purple-100 px-4 py-1.5 caption-small !text-[10px]">
                      Super User
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-50 text-blue-700 border-blue-100 px-4 py-1.5 caption-small !text-[10px]">
                      Operator
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="caption-small !text-slate-400">
                  {strings.labels.status}
                </p>
                <div className="flex pt-1">
                  <Badge
                    className={`px-4 py-1.5 border-0 caption-small !text-[10px] ${user.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="caption-small !text-slate-400">
                  {strings.labels.joined}
                </p>
                <p className="body-strong !text-slate-800 flex items-center gap-3">
                  <Clock className="icon-sm text-slate-400" />{" "}
                  {new Date(user.created_at || "").toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary Card */}
        <div className="space-y-6 flex flex-col h-full justify-between">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-slate-900 text-white relative flex-1 min-h-[350px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-24 -mt-24 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full -ml-16 -mb-16 blur-2xl opacity-30" />
            <CardContent className="h-full p-6 flex flex-col items-center justify-center relative z-10 space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="w-28 h-28 rounded-full border-[6px] border-slate-800 flex items-center justify-center bg-slate-800 text-4xl font-black shadow-2xl relative z-10">
                  {user.username?.charAt(0)}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  {user.username}
                </h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                  {Number(user.role) === 2
                    ? strings.roleAdministrator.toUpperCase()
                    : strings.roleOperator.toUpperCase()}
                </p>
              </div>
              <div className="w-full pt-8 border-t border-slate-800 space-y-5">
                <div className="flex justify-between items-center px-4">
                  <span className="caption-small !text-slate-500">
                    {strings.labels.identity}
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 caption-small !text-[9px]">
                    VERIFIED
                  </Badge>
                </div>
                <div className="flex justify-between items-center px-4">
                  <Clock className="icon-sm text-slate-500" />
                  <span className="caption-small !text-slate-400 !tracking-wider">
                    {strings.labels.updated.toUpperCase()}:{" "}
                    {new Date(user.updated_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Workplace Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
                    {strings.labels.warehouse}
                  </p>
                  <div className="space-y-1">
                    <p className="text-base font-black text-slate-800">
                      {user.db_warehouse?.warehouse_name || "Not Assigned"}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100">
                      CODE: {user.db_warehouse?.warehouse_code || "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
                    {strings.labels.device}
                  </p>
                  <div className="flex items-center gap-4 pb-6">
                    <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50">
                      <Smartphone className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-black text-slate-800">
                        {user.db_device?.device_type || "No Device"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                        SN: {user.db_device?.device_serial_number || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white h-full">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                {strings.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-1">
              <button className="w-full h-14 flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all text-left group border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight uppercase">
                    {strings.actions.permissions}
                  </span>
                </div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.1em] group-hover:translate-x-1 transition-transform">
                  {strings.actions.view}
                </span>
              </button>
              <button className="w-full h-14 flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all text-left group border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <MailCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black text-slate-700 tracking-tight uppercase">
                    {strings.actions.resetPassword}
                  </span>
                </div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-[0.1em] group-hover:translate-x-1 transition-transform">
                  {strings.actions.send}
                </span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

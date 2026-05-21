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

  const getPermissionLabel = (key: string) => {
    const perm = config.strings.permissions.find((p: any) => p.key === key);
    return perm ? perm.label : key.replace(/_/g, " ");
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-4 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/masters/users")}
            className="rounded-full bg-slate-300 border-1 border-slate-400 shadow-lg shadow-slate-300 h-10 w-10 transition-all bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h2 className="heading-section !text-2xl">{strings.title}</h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-2 items-start">
        <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl bg-white h-full">
          <CardHeader className="bg-slate-50/50 border-b border-b-2 border-slate-200 py-4 px-6">
            <CardTitle className="caption-medium !text-slate-500 flex items-center gap-2 uppercase tracking-widest leading-none">
              <UserIcon className="icon-sm" /> USER INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10">
            <div className="space-y-1.5">
              <p className="label-bold !text-slate-400 tracking-widest uppercase">
                User Name
              </p>
              <p className="body-strong !text-slate-800 uppercase leading-tight">
                {user.userid}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="label-bold !text-slate-400 tracking-widest uppercase">
                Emp ID
              </p>
              <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                <ShieldCheck className="icon-sm text-slate-400" />{" "}
                {user.employee_id || "-"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="label-bold !text-slate-400 tracking-widest uppercase">
                Department
              </p>
              <p className="body-strong !text-slate-800 flex items-center gap-3 uppercase">
                <Building2 className="icon-sm text-slate-400" />{" "}
                {user.department || "-"}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="label-bold !text-slate-400 tracking-widest uppercase">
                System Role
              </p>
              <div className="flex pt-1">
                {Number(user.role) === 1 ? (
                  <Badge className="bg-slate-100 text-slate-700 px-4 py-1 rounded-lg text-xs font-black uppercase tracking-tight border-0">
                    Admin
                  </Badge>
                ) : Number(user.role) === 2 ? (
                  <Badge className="bg-purple-100 text-purple-700 px-4 py-1 rounded-lg text-xs font-black uppercase tracking-tight border-0">
                    Super User
                  </Badge>
                ) : Number(user.role) === 4 ? (
                  <Badge className="bg-orange-100 text-orange-700 px-4 py-1 rounded-lg text-xs font-black uppercase tracking-tight border-0">
                    Warehouse User
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-700 px-4 py-1 rounded-lg text-xs font-black uppercase tracking-tight border-0">
                    Standard User
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="label-bold !text-slate-400 tracking-widest uppercase">
                Status
              </p>
              <div className="flex pt-1">
                <Badge
                  className={`px-4 py-1 rounded-lg border-0 text-[11px] font-black uppercase tracking-tight ${
                    user.status === "Y" ||
                    user.status?.toLowerCase() === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {user.status === "Y" ||
                  user.status?.toLowerCase() === "active"
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl bg-white h-full">
          <CardHeader className="bg-slate-50/50 border-b border-b-2 border-slate-200 py-4 px-6">
            <CardTitle className="caption-medium !text-slate-500 flex items-center gap-2 uppercase tracking-widest leading-none">
              <ListChecks className="icon-sm" /> MODULE ACCESS PERMISSIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-8">
              {user.permission && user.permission.length > 0 ? (
                user.permission.map((perm, index) => (
                  <div key={perm.id || index} className="space-y-4">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {perm.operation_pages.map((page, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-200 group hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300"
                        >
                          <div
                            className={`h-2 w-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] ${
                              perm.operation_type?.toLowerCase() === "write"
                                ? "bg-rose-500 shadow-rose-200"
                                : "bg-blue-500 shadow-blue-200"
                            }`}
                          />
                          <span className="text-xs font-black text-slate-700 uppercase tracking-tight">
                            {getPermissionLabel(page)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDetail;

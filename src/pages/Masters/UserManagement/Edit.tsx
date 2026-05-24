import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronLeft, Save, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchUserById,
  handleUpdateUser,
} from "@/app/manager/masterManager";
import config from "./UserConfig.json";

const permissionsList = config.strings.permissions;

const UserEdit = () => {
  const strings = config.strings.edit;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, loading: fetchLoading } = useAppSelector(
    (state) => state.master.users,
  );
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    userid: "",
    employee_id: "",
    firstname: "",
    lastname: "",
    username: "",
    email_id: "",
    mobile_number: "",
    password: "",
    role: "3",
    warehouse: "1",
    department: "",
    status: "Active",
  });

  const [readPages, setReadPages] = useState<string[]>([]);
  const [writePages, setWritePages] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(handleFetchUserById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.ID || 0,
        userid: currentUser.USERID || "",
        employee_id: currentUser.EMPLOYEE_ID || "",
        firstname: currentUser.FIRSTNAME || "",
        lastname: currentUser.LASTNAME || "",
        username: currentUser.USERNAME || "",
        email_id: currentUser.EMAIL || "",
        mobile_number: currentUser.MOBILE_NUMBER?.toString() || "",
        password: currentUser.PASSWORD || "",
        role: currentUser.ROLE?.toString() || "3",
        warehouse: currentUser.WAREHOUSE_ID?.toString() || "1",
        department: currentUser.DEPARTMENT || "",
        status:
          currentUser.STATUS === "Y" ||
          currentUser.STATUS?.toLowerCase() === "active"
            ? "Active"
            : "Inactive",
      });

      if (currentUser.permission && Array.isArray(currentUser.permission)) {
        const permissions = currentUser.permission.flatMap(
          (perm) => perm.OperationPages || [],
        );
        setReadPages(permissions.filter((p) => p.endsWith("_read")));
        setWritePages(permissions.filter((p) => p.endsWith("_write")));
      }
    }
  }, [currentUser]);

  const togglePermission = (page: string, type: "read" | "write") => {
    if (type === "read") {
      setReadPages((prev) =>
        prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
      );
    } else {
      setWritePages((prev) =>
        prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
      );
    }
  };

  const toggleAll = (type: "read" | "write") => {
    const list = type === "read" ? readPages : writePages;
    const setter = type === "read" ? setReadPages : setWritePages;

    if (list.length === permissionsList.length) {
      setter([]);
    } else {
      setter(permissionsList.map((p: any) => p.key));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const permission = [];
    if (readPages.length > 0) {
      permission.push({
        operation_type: "read",
        OperationPages: readPages,
      });
    }
    if (writePages.length > 0) {
      permission.push({
        operation_type: "write",
        OperationPages: writePages,
      });
    }

    // In a real implementation this would call an update API
    setTimeout(() => {
      setLoading(false);
      const payload = {
        id: Number(formData.id),
        userid: formData.userid,
        username: formData.username,
        firstname: formData.firstname,
        employee_id: formData.employee_id,
        lastname: formData.lastname,
        email_id: formData.email_id,
        mobile_number: formData.mobile_number,
        password: formData.password,
        role: Number(formData.role),
        warehouse: Number(formData.warehouse),
        department: formData.department,
        status: formData.status === "Active",
        permissions: permission,
      };
      dispatch(handleUpdateUser(payload));
      navigate("/masters/users");
    }, 800);
  };

  if (fetchLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500 font-medium">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="uppercase  text-[10px] font-black">
          Loading user data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full bg-slate-300 border-1 border-slate-400 shadow-lg shadow-slate-300 h-10 w-10 transition-all bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div>
          <h2 className="heading-section !text-2xl">{strings.title}</h2>
          <p className="caption-small !text-slate-400 italic">
            ID: {formData.userid}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-3 px-6">
              <CardTitle className="text-2xl text-slate-500 flex items-center gap-2">
                <ShieldCheck className="icon-md w-5 h-5" /> USER DATA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    User Name
                  </Label>
                  <Input
                    value={formData.userid}
                    disabled
                    className="rounded-xl h-11 bg-slate-50 border-[2px] border-slate-200 body-strong text-sm text-slate-750 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    Employee ID
                  </Label>
                  <Input
                    placeholder="EMP-001"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong text-sm text-slate-750"
                    required
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_id: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    System Role
                  </Label>
                  <Input
                    value="Warehouse User"
                    disabled
                    className="rounded-xl h-11 bg-slate-50 border-[2px] border-slate-200 body-strong text-sm text-slate-750 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    Update Password
                  </Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    autoComplete="new-password"
                    placeholder="Leave blank to keep same"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong text-sm text-slate-750"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    Department
                  </Label>
                  <Input
                    placeholder="Operations"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong text-sm text-slate-750"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    Status
                  </Label>
                  <div className="flex bg-slate-100 p-1 rounded-xl h-11 border border-slate-200">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: "Active" })
                      }
                      className={`flex-1 rounded-lg body-strong text-sm transition-all ${
                        formData.status === "Active"
                          ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: "Inactive" })
                      }
                      className={`flex-1 rounded-lg body-strong text-sm transition-all ${
                        formData.status === "Inactive"
                          ? "bg-white text-rose-600 shadow-sm border border-slate-200/50"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-4 px-8">
              <CardTitle className="text-2xl text-slate-500 flex items-center justify-between">
                <span>USER PERMISSIONS</span>
                <div className="flex items-center gap-3">
                  <span className="body-strong text-sm text-slate-500 uppercase tracking-widest">
                    Select All
                  </span>
                  <Checkbox
                    className="h-7 w-7 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    checked={readPages.length === permissionsList.length}
                    onCheckedChange={() => toggleAll("read")}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                {permissionsList.map((p: any) => (
                  <label
                    key={p.key}
                    htmlFor={p.key}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <span className="body-strong text-sm !text-slate-800 uppercase">
                      {p.label}
                    </span>
                    <Checkbox
                      id={p.key}
                      className="h-5 w-5 border-slate-300 bg-white data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all rounded-md shadow-sm"
                      checked={readPages.includes(p.key)}
                      onCheckedChange={() => togglePermission(p.key, "read")}
                    />
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-xl px-10 shadow-md shadow-slate-400 bg-white hover:bg-red-500 hover:text-white text-black transition-all body-strong uppercase tracking-widest text-xs h-11"
          >
            {strings.cancelBtn}
          </Button>
          <Button
            type="submit"
            className="px-12 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 body-strong text-white uppercase text-xs h-11 transition-all active:scale-95"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader2 className="animate-spin icon-sm" />
            ) : (
              <>
                <Save className="icon-base mr-3" /> {strings.saveBtn}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;

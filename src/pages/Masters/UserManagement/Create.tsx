import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  ChevronLeft,
  Save,
  UserPlus,
  Laptop,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/store";
import { handleCreateUser } from "@/app/manager/masterManager";
import config from "./UserConfig.json";

const permissionsList = config.strings.permissions;

const UserCreate = () => {
  const strings = config.strings.create;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    employee_id: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    mobile_number: "",
    role: "4", // Warehouse Picker
    password: "",
    device: "0",
    outlet: "1",
    department: "",
    status: "Active",
  });

  const [readPages, setReadPages] = useState<string[]>([]);
  const [writePages, setWritePages] = useState<string[]>([]);

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

    const payload = {
      companyid: 1,
      warehouse_id: Number(formData.outlet),
      userid: formData.userId,
      employee_id: formData.employee_id,
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.username,
      email_id: formData.email,
      password: formData.password,
      mobile_number: formData.mobile_number || "0",
      role: Number(formData.role),
      device_id: Number(formData.device),
      mobile_token: "",
      status: formData.status,
      department: formData.department,
      permission: permission,
    };

    const success = await dispatch(handleCreateUser(payload));
    setLoading(false);

    if (success) {
      toast.success("User created successfully");
      navigate("/masters/users");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 mb-2">
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

      <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-200 py-3 px-6">
              <CardTitle className="text-2xl text-slate-500 flex items-center gap-2">
                <UserPlus className="icon-md w-5 h-5" /> USER DATA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold text-slate-800 uppercase text-sm">
                    User Name
                  </Label>
                  <Input
                    placeholder="Enter Your User Name"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong text-sm text-slate-750"
                    required
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
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
                    Access Password
                  </Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong text-sm text-slate-750"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                  <Input
                    value="Active"
                    disabled
                    className="rounded-xl h-11 bg-slate-50 border-[2px] border-slate-200 body-strong text-sm text-slate-750 cursor-not-allowed"
                  />
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
            onClick={() => navigate("/masters/users")}
            className="rounded-xl px-10 shadow-md shadow-slate-400 bg-white hover:bg-red-500 hover:text-white text-black transition-all body-strong uppercase tracking-widest text-xs h-11"
          >
            {strings.discardBtn}
          </Button>
          <Button
            type="submit"
            className="px-12 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 body-strong text-white uppercase text-xs h-11 transition-all active:scale-95"
            disabled={loading}
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

export default UserCreate;

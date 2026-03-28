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
    role: "3", // Standard User
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
        operation_pages: readPages,
      });
    }
    if (writePages.length > 0) {
      permission.push({
        operation_type: "write",
        operation_pages: writePages,
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
          className="rounded-full hover:bg-slate-100 h-10 w-10 transition-all border border-slate-100 bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div>
          <h2 className="heading-section !text-2xl">{strings.title}</h2>
          <p className="label-bold !text-slate-400 italic">
            {strings.subtitle.toUpperCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <UserPlus className="icon-sm" /> Personal & Account Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    User ID
                  </Label>
                  <Input
                    placeholder="e.g. USR006"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
                    required
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Employee ID
                  </Label>
                  <Input
                    placeholder="EMP-001"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
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
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    First Name
                  </Label>
                  <Input
                    placeholder="John"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.firstname}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Last Name
                  </Label>
                  <Input
                    placeholder="Doe"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Username
                  </Label>
                  <Input
                    placeholder="johndoe"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    autoComplete="off"
                    placeholder="john@example.com"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+91 9876543210"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.mobile_number}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile_number: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    System Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Super User</SelectItem>
                      <SelectItem value="3">Standard User</SelectItem>
                      <SelectItem value="4">Warehouse Picker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Access Password
                  </Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <Building2 className="icon-sm" /> Facility mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Department
                  </Label>
                  <Input
                    placeholder="Operations"
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Warehouse Outlet
                  </Label>
                  <Select
                    value={formData.outlet}
                    onValueChange={(v) =>
                      setFormData({ ...formData, outlet: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="1">Main Warehouse (Global)</SelectItem>
                      <SelectItem value="2">Central Hub - MUM01</SelectItem>
                      <SelectItem value="3">North Hub - DEL01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                  Assigned Device
                </Label>
                <Select
                  value={formData.device}
                  onValueChange={(v) =>
                    setFormData({ ...formData, device: v })
                  }
                >
                  <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="0">Auto-Assign Later</SelectItem>
                    <SelectItem value="1">Device 01 - Scanner</SelectItem>
                    <SelectItem value="2">Device 02 - Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="caption-small !text-slate-900">System Note</p>
                <p className="body-main !text-sm !text-slate-500 leading-relaxed italic">
                  New users are created with 'Active' status by default. Initial permissions must be audited after saving.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
            <CardTitle className="caption-small !text-slate-500 flex items-center justify-between">
              <span>Module Access Matrix</span>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Read Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">Write Mode</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <div className="min-w-[1000px]">
                  {/* Header Row: Module Names */}
                  <div className="grid grid-cols-[180px_repeat(8,1fr)] bg-slate-50 border-b border-slate-100 items-center">
                    <div className="p-4 border-r border-slate-100">
                      <span className="body-strong !text-slate-500 uppercase tracking-widest !text-[11px]">
                        Modules \ Access
                      </span>
                    </div>
                    {permissionsList.map((p: any) => (
                      <div key={p.key} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                        <span className="body-strong !text-[11px] !text-slate-800 uppercase tracking-tighter">
                          {p.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Read Access Row */}
                  <div className="grid grid-cols-[180px_repeat(8,1fr)] items-center border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <div className="p-4 bg-slate-50/50 border-r border-slate-100 flex items-center justify-between">
                      <span className="body-strong !text-blue-600 uppercase tracking-widest !text-[10px]">
                        Read Access
                      </span>
                      <Checkbox
                        className="h-4 w-4 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        checked={readPages.length === permissionsList.length}
                        onCheckedChange={() => toggleAll("read")}
                      />
                    </div>
                    {permissionsList.map((p: any) => (
                      <div key={p.key} className="p-4 flex justify-center border-r border-slate-50 last:border-r-0">
                        <Checkbox
                          className="h-6 w-6 border-slate-200 bg-slate-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all rounded-lg"
                          checked={readPages.includes(p.key)}
                          onCheckedChange={() => togglePermission(p.key, "read")}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Write Access Row */}
                  <div className="grid grid-cols-[180px_repeat(8,1fr)] items-center hover:bg-slate-50/30 transition-colors">
                    <div className="p-4 bg-slate-50/50 border-r border-slate-100 flex items-center justify-between">
                      <span className="body-strong !text-emerald-600 uppercase tracking-widest !text-[10px]">
                        Write Access
                      </span>
                      <Checkbox
                        className="h-4 w-4 border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        checked={writePages.length === permissionsList.length}
                        onCheckedChange={() => toggleAll("write")}
                      />
                    </div>
                    {permissionsList.map((p: any) => (
                      <div key={p.key} className="p-4 flex justify-center border-r border-slate-50 last:border-r-0">
                        <Checkbox
                          className="h-6 w-6 border-slate-200 bg-slate-50 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 transition-all rounded-lg"
                          checked={writePages.includes(p.key)}
                          onCheckedChange={() => togglePermission(p.key, "write")}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/masters/users")}
            className="rounded-xl px-10 transition-all body-strong uppercase tracking-widest text-xs h-11 hover:bg-slate-100"
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

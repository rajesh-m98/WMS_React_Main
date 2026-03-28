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
import { handleFetchUserById } from "@/app/manager/masterManager";
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
    userid: "",
    employee_id: "",
    firstname: "",
    lastname: "",
    username: "",
    email_id: "",
    mobile_number: "",
    role: "3",
    warehouse: "1",
    department: "",
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
        userid: currentUser.userid || "",
        employee_id: currentUser.employee_id || "",
        firstname: currentUser.firstname || "",
        lastname: currentUser.lastname || "",
        username: currentUser.username || "",
        email_id: currentUser.email || "",
        mobile_number: currentUser.mobile_number?.toString() || "",
        role: currentUser.role?.toString() || "3",
        warehouse: currentUser.warehouse_id?.toString() || "1",
        department: currentUser.department || "",
      });

      if (currentUser.permission && Array.isArray(currentUser.permission)) {
        const read =
          currentUser.permission.find((p) => p.operation_type === "read")
            ?.operation_pages || [];
        const write =
          currentUser.permission.find((p) => p.operation_type === "write")
            ?.operation_pages || [];
        setReadPages(read);
        setWritePages(write);
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
        operation_pages: readPages,
      });
    }
    if (writePages.length > 0) {
      permission.push({
        operation_type: "write",
        operation_pages: writePages,
      });
    }

    // In a real implementation this would call an update API
    setTimeout(() => {
      setLoading(false);
      toast.success("User updated successfully");
      console.log("Updated permissions:", permission);
      navigate(`/masters/users/${id}`);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full hover:bg-slate-100 h-10 w-10 transition-all border border-slate-100 bg-white"
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <ShieldCheck className="icon-sm text-blue-600" /> Account & Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">User ID</Label>
                  <Input
                    value={formData.userid}
                    readOnly
                    className="rounded-xl h-11 border-slate-200 bg-slate-100/50 font-mono body-strong !text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">Employee ID</Label>
                  <Input
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-mono body-strong !text-slate-900"
                    placeholder="EMP-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">First Name</Label>
                  <Input
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">Last Name</Label>
                  <Input
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="caption-small !text-slate-400">Email Address</Label>
                <Input
                  type="email"
                  value={formData.email_id}
                  onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
                  className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">Username</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">System Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 body-strong !text-slate-900">
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
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Save className="icon-sm text-emerald-600" />
                </div> Facility Mapping
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="caption-small !text-slate-400">Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                  placeholder="e.g. Operations"
                />
              </div>

              <div className="space-y-2">
                <Label className="caption-small !text-slate-400">Assigned Warehouse</Label>
                <Select
                  value={formData.warehouse}
                  onValueChange={(v) => setFormData({ ...formData, warehouse: v })}
                >
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 body-strong !text-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="1">Main Warehouse (Global)</SelectItem>
                    <SelectItem value="2">Central Hub - MUM01</SelectItem>
                    <SelectItem value="3">North Hub - DEL01</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="caption-small !text-slate-900">Update Note</p>
                <p className="body-main !text-sm !text-slate-500 leading-relaxed italic">
                  Modifying warehouse associations may temporarily affect real-time stock visibility for this user.
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
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Read Mode
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Write Mode
                  </span>
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
                      <div
                        key={p.key}
                        className="p-4 text-center border-r border-slate-100 last:border-r-0"
                      >
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
                      <div
                        key={p.key}
                        className="p-4 flex justify-center border-r border-slate-50 last:border-r-0"
                      >
                        <Checkbox
                          className="h-6 w-6 border-slate-200 bg-slate-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all rounded-lg"
                          checked={readPages.includes(p.key)}
                          onCheckedChange={() =>
                            togglePermission(p.key, "read")
                          }
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
                      <div
                        key={p.key}
                        className="p-4 flex justify-center border-r border-slate-50 last:border-r-0"
                      >
                        <Checkbox
                          className="h-6 w-6 border-slate-200 bg-slate-50 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 transition-all rounded-lg"
                          checked={writePages.includes(p.key)}
                          onCheckedChange={() =>
                            togglePermission(p.key, "write")
                          }
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
            onClick={() => navigate(-1)}
            className="rounded-xl px-10 transition-all body-strong uppercase tracking-widest text-xs h-11 hover:bg-slate-100"
          >
            {strings.cancelBtn}
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

export default UserEdit;

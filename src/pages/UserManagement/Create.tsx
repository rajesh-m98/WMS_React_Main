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
import { ChevronLeft, Save, UserPlus, Laptop, Building2, Loader2 } from "lucide-react";
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
    fullName: "",
    email: "",
    role: "3", // Standard User
    password: "",
    device: "0",
    outlet: "1",
    status: "Active",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      const current = prev[module] || [];
      if (checked) {
        return { ...prev, [module]: [...current, action] };
      } else {
        return { ...prev, [module]: current.filter(a => a !== action) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const permissionString = Object.entries(selectedPermissions)
      .map(([mod, acts]) => `${mod}:[${acts.join(",")}]`)
      .join(";");

    const payload = {
      companyid: 1,
      warehouse_id: Number(formData.outlet),
      userid: formData.userId,
      username: formData.fullName,
      email_id: formData.email,
      password: formData.password,
      mobile_number: 0, // Placeholder as per API
      role: Number(formData.role),
      device_id: Number(formData.device),
      mobile_token: "",
      status: formData.status,
      permission: permissionString
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
          <h2 className="heading-section !text-2xl">
            {strings.title}
          </h2>
          <p className="caption-small !text-slate-400 italic">
            {strings.subtitle.toUpperCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <UserPlus className="icon-sm" /> {strings.basicSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">{strings.labels.userId}</Label>
                  <Input 
                    placeholder="e.g. USR006" 
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono" 
                    required 
                    value={formData.userId}
                    onChange={e => setFormData({ ...formData, userId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">{strings.labels.fullName}</Label>
                  <Input 
                    placeholder="John Doe" 
                    autoComplete="off"
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900" 
                    required 
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">{strings.labels.email}</Label>
                  <Input 
                    type="email" 
                    autoComplete="off"
                    placeholder="john@example.com" 
                    className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="caption-small !text-slate-400">{strings.labels.role}</Label>
                  <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
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
              </div>
              <div className="space-y-2">
                <Label className="caption-small !text-slate-400">{strings.labels.password}</Label>
                <Input 
                  type="password" 
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900" 
                  required 
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3 px-6">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <Building2 className="icon-sm" /> {strings.mappingSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Laptop className="icon-base" />
                    </div>
                   <div className="flex-1 space-y-2">
                      <Label className="caption-small !text-slate-400">{strings.labels.device}</Label>
                      <Select value={formData.device} onValueChange={v => setFormData({ ...formData, device: v })}>
                        <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="0">Auto-Assign Later</SelectItem>
                          <SelectItem value="1">Device 01 - Scanner (Mumbai)</SelectItem>
                          <SelectItem value="2">Device 02 - Tablet (Mumbai)</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <Building2 className="icon-base" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="caption-small !text-slate-400">{strings.labels.outlet}</Label>
                    <Select value={formData.outlet} onValueChange={v => setFormData({ ...formData, outlet: v })}>
                      <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Main Warehouse (Global)</SelectItem>
                        <SelectItem value="2">Central Hub - MUM01</SelectItem>
                        <SelectItem value="3">North Hub - DEL01</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="caption-small !text-slate-900">{strings.notes.initTitle}</p>
                <p className="body-main !text-sm !text-slate-500 leading-relaxed italic">
                  {strings.notes.initDesc}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
            <CardTitle className="caption-small !text-slate-500">Module Access Permissions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="grid grid-cols-5 bg-slate-50 p-4 border-b border-slate-100">
                <div className="col-span-1 pl-2 body-strong !text-slate-500 uppercase tracking-widest !text-xs">Feature / Module</div>
                <div className="text-center body-strong !text-slate-500 uppercase tracking-widest !text-xs">View</div>
                <div className="text-center body-strong !text-slate-500 uppercase tracking-widest !text-xs">Create</div>
                <div className="text-center body-strong !text-slate-500 uppercase tracking-widest !text-xs">Edit</div>
                <div className="text-center body-strong !text-slate-500 uppercase tracking-widest !text-xs">Remove</div>
              </div>
              <div className="divide-y divide-slate-50 bg-white">
                {permissionsList.map((p) => (
                  <div
                    key={p}
                    className="grid grid-cols-5 p-3 items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="col-span-1 body-strong !text-sm px-2 !text-slate-800">
                      {p}
                    </div>
                    <div className="flex justify-center">
                      <Checkbox 
                        id={`${p}-view`} 
                        className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" 
                        onCheckedChange={(checked) => handlePermissionChange(p, "view", !!checked)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Checkbox 
                        id={`${p}-add`} 
                        className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" 
                        onCheckedChange={(checked) => handlePermissionChange(p, "create", !!checked)}
                      />
                    </div>
                    <div className="flex justify-center">
                       <Checkbox 
                        id={`${p}-edit`} 
                        className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" 
                        onCheckedChange={(checked) => handlePermissionChange(p, "edit", !!checked)}
                      />
                    </div>
                    <div className="flex justify-center">
                       <Checkbox 
                        id={`${p}-delete`} 
                        className="h-5 w-5 rounded-md border-slate-200 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500" 
                        onCheckedChange={(checked) => handlePermissionChange(p, "delete", !!checked)}
                      />
                    </div>
                  </div>
                ))}
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
            className="px-12 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 body-strong text-white uppercase tracking-[0.15em] text-xs h-11 transition-all active:scale-95"
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

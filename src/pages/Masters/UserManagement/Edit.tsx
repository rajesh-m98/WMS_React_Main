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
    username: "",
    email_id: "",
    mobile_number: "",
    role: "1",
    warehouse: "1",
  });

  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});

  const parsePermissions = (permString: string) => {
    if (!permString) return {};
    const perms: Record<string, string[]> = {};
    permString.split(";").forEach((item) => {
      const parts = item.split(":[");
      if (parts.length === 2) {
        const mod = parts[0];
        const acts = parts[1].replace("]", "").split(",");
        perms[mod] = acts.filter((a) => a !== "");
      }
    });
    return perms;
  };

  useEffect(() => {
    if (id) {
      dispatch(handleFetchUserById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        userid: currentUser.userid || "",
        username: currentUser.username || "",
        email_id: currentUser.email_id || "",
        mobile_number: currentUser.mobile_number?.toString() || "",
        role: currentUser.role?.toString() || "3",
        warehouse: currentUser.warehouse_id?.toString() || "1",
      });
      setSelectedPermissions(parsePermissions(currentUser.permission || ""));
    }
  }, [currentUser]);

  const handlePermissionChange = (
    module: string,
    action: string,
    checked: boolean,
  ) => {
    setSelectedPermissions((prev) => {
      const current = prev[module] || [];
      if (checked) {
        if (current.includes(action)) return prev;
        return { ...prev, [module]: [...current, action] };
      } else {
        if (!current.includes(action)) return prev;
        return { ...prev, [module]: current.filter((a) => a !== action) };
      }
    });
  };

  const toggleColumn = (action: string) => {
    const allSelectedInColumn = permissionsList.every((p) =>
      (selectedPermissions[p] || []).includes(action),
    );

    setSelectedPermissions((prev) => {
      const next = { ...prev };
      permissionsList.forEach((p) => {
        const current = next[p] || [];
        if (allSelectedInColumn) {
          next[p] = current.filter((a) => a !== action);
        } else {
          if (!current.includes(action)) {
            next[p] = [...current, action];
          }
        }
      });
      return next;
    });
  };

  const toggleRow = (module: string) => {
    const actions = ["view", "create", "edit", "delete"];
    const allSelectedInRow = actions.every((a) =>
      (selectedPermissions[module] || []).includes(a),
    );

    setSelectedPermissions((prev) => ({
      ...prev,
      [module]: allSelectedInRow ? [] : actions,
    }));
  };

  const toggleAll = () => {
    const actions = ["view", "create", "edit", "delete"];
    const isEverythingSelected = permissionsList.every((p) =>
      actions.every((a) => (selectedPermissions[p] || []).includes(a)),
    );

    if (isEverythingSelected) {
      setSelectedPermissions({});
    } else {
      const all: Record<string, string[]> = {};
      permissionsList.forEach((p) => {
        all[p] = actions;
      });
      setSelectedPermissions(all);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const permissionString = Object.entries(selectedPermissions)
      .filter(([_, acts]) => acts.length > 0)
      .map(([mod, acts]) => `${mod}:[${acts.join(",")}]`)
      .join(";");

    // In a real implementation this would call an update API
    setTimeout(() => {
      setLoading(false);
      toast.success("User updated successfully");
      console.log("Updated permissions:", permissionString);
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
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
            <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShieldCheck className="icon-sm text-blue-600" />
              </div>
              {strings.accountSection}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-6 px-8 pb-8">
            <div className="space-y-2">
              <Label className="caption-small !text-slate-400">
                {config.strings.create.labels.userId}
              </Label>
              <Input
                value={formData.userid}
                onChange={(e) =>
                  setFormData({ ...formData, userid: e.target.value })
                }
                className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-mono body-strong !text-slate-900"
                placeholder="e.g. USR001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="caption-small !text-slate-400">
                {config.strings.create.labels.fullName}
              </Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                placeholder="Full billing name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="caption-small !text-slate-400">
                {config.strings.create.labels.email}
              </Label>
              <Input
                type="email"
                value={formData.email_id}
                onChange={(e) =>
                  setFormData({ ...formData, email_id: e.target.value })
                }
                className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                placeholder="email@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="caption-small !text-slate-400">
                {config.strings.detail.labels.phone}
              </Label>
              <Input
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900"
                placeholder="Primary contact"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="caption-small !text-slate-400">
                {config.strings.create.labels.role}
              </Label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Super User</SelectItem>
                  <SelectItem value="3">Standard User</SelectItem>
                  <SelectItem value="4">Warehouse Picker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="caption-small !text-slate-400">
                {config.strings.detail.labels.warehouse}
              </Label>
              <Select
                value={formData.warehouse}
                onValueChange={(v) =>
                  setFormData({ ...formData, warehouse: v })
                }
              >
                <SelectTrigger className="rounded-xl h-11 border-slate-200 bg-slate-50/50 focus:bg-white transition-all body-strong !text-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  <SelectItem value="1">Main Warehouse (Global)</SelectItem>
                  <SelectItem value="2">Central Hub - MUM01</SelectItem>
                  <SelectItem value="3">North Hub - DEL01</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
            <CardTitle className="caption-small !text-slate-500">
              Module Access Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="grid grid-cols-5 bg-slate-50 p-4 border-b border-slate-100 items-center">
                <div className="col-span-1 pl-4 flex items-center gap-3">
                  <Checkbox
                    id="all-permissions"
                    className="h-5 w-5 border-slate-400"
                    checked={
                      permissionsList.length > 0 &&
                      permissionsList.every((p) =>
                        ["view", "create", "edit", "delete"].every((a) =>
                          (selectedPermissions[p] || []).includes(a),
                        ),
                      )
                    }
                    onCheckedChange={toggleAll}
                  />
                  <span className="body-strong !text-slate-500 uppercase tracking-widest !text-[11px]">
                    Module
                  </span>
                </div>
                {/* Each action column uses a fixed-width container for consistent checkbox centering */}
                {["view", "create", "edit", "delete"].map((action) => (
                  <div key={action} className="flex justify-center">
                    <div className="flex items-center gap-2.5 w-24">
                      <Checkbox
                        className="h-5 w-5 border-slate-400"
                        checked={permissionsList.every((p) =>
                          (selectedPermissions[p] || []).includes(action),
                        )}
                        onCheckedChange={() => toggleColumn(action)}
                      />
                      <span className="body-strong !text-slate-500 uppercase tracking-widest !text-[11px]">
                        {action === "delete" ? "Remove" : action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divide-y divide-slate-50 bg-white">
                {permissionsList.map((p) => (
                  <div
                    key={p}
                    className="grid grid-cols-5 p-3 items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="col-span-1 flex items-center gap-3 pl-4">
                      <Checkbox
                        id={`row-${p}`}
                        className="h-5 w-5 border-slate-400"
                        checked={["view", "create", "edit", "delete"].every(
                          (a) => (selectedPermissions[p] || []).includes(a),
                        )}
                        onCheckedChange={() => toggleRow(p)}
                      />
                      <span className="body-strong !text-sm !text-slate-800">
                        {p}
                      </span>
                    </div>
                    {["view", "create", "edit", "delete"].map((action) => (
                      <div key={action} className="flex justify-center">
                        <div className="flex items-center gap-2.5 w-24">
                          <Checkbox
                            id={`${p}-${action}`}
                            className={cn(
                              "h-5 w-5",
                              action === "view" &&
                                "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600",
                              action === "create" &&
                                "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
                              action === "edit" &&
                                "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
                              action === "delete" &&
                                "data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500",
                            )}
                            checked={(selectedPermissions[p] || []).includes(
                              action,
                            )}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(p, action, !!checked)
                            }
                          />
                          {/* Invisible spacer to maintain vertical alignment with header */}
                          <div className="w-12" aria-hidden="true" />
                        </div>
                      </div>
                    ))}
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
            onClick={() => navigate(-1)}
            className="rounded-xl px-10 body-strong uppercase tracking-widest text-xs hover:bg-slate-100 h-11"
          >
            {strings.cancelBtn}
          </Button>
          <Button
            type="submit"
            className="px-12 bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-200 body-strong text-white uppercase  text-xs h-11 transition-all active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin icon-sm" />
            ) : (
              <>
                <Save className="icon-sm mr-2" /> {strings.saveBtn}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;

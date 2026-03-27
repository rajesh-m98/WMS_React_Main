import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Label } from "@/components/ui";
import { Switch } from "@/components/ui";
import { toast } from "sonner";
import { validatePasswordChange } from "@/lib/validators";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({ label, value, onChange, placeholder, error }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label className="caption-small flex justify-between">{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-11 rounded-xl bg-slate-50/50 focus:bg-white transition-all pr-10 ${error ? "border-rose-300 bg-rose-50/30 focus-visible:ring-rose-200" : "border-slate-200"}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 shadow-lg shadow-slate-300 hover:text-slate-600 hover:bg-slate-100/50 rounded-lg"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

const SettingsPage = () => {
  const [passwords, setPasswords] = useState({
    newPass: "",
    confirm: "",
  });

  const handlePasswordUpdate = () => {
    const { isValid, message } = validatePasswordChange(
      passwords.newPass,
      passwords.confirm,
    );

    if (!isValid) {
      toast.error(message);
      return;
    }

    // In real app, call API here
    toast.success("Password changed successfully!");
    setPasswords({ newPass: "", confirm: "" });
  };

  // Real-time validation for confirm password
  const confirmError =
    passwords.confirm.length > 0 &&
    !passwords.newPass.startsWith(passwords.confirm)
      ? "Does not match new password"
      : passwords.confirm.length > 0 &&
          passwords.confirm.length === passwords.newPass.length &&
          passwords.confirm !== passwords.newPass
        ? "Passwords do not match"
        : "";

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="heading-section">Settings</h1>
          <p className="body-main !text-sm mt-1">
            Application settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-right flex flex-col justify-center">
            <Label className="text-[13px] font-black text-slate-700 leading-none">
              System Theme
            </Label>
            <p className="caption-small !text-[9px] mt-1">Dark Mode (Auto)</p>
          </div>
          <Switch
            checked
            disabled
            className="data-[state=checked]:bg-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden h-full flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest">
              General Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6 bg-white flex-1 flex flex-col">
            <div className="space-y-2">
              <Label className="caption-small">Company Name</Label>
              <Input
                defaultValue="WMS Pro Corp"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-semibold text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="caption-small">Default Warehouse</Label>
              <Input
                defaultValue="WH-01"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-semibold text-slate-700"
              />
            </div>
            <div className="pt-4 mt-auto border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => toast.success("General settings saved")}
                variant="outline"
                className="font-bold rounded-xl px-6 h-10 border-slate-200 text-slate-600 hover:text-slate-900 w-full sm:w-auto"
              >
                Update General
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-2xl overflow-hidden h-full flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Security Config: Update
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6 bg-white flex-1 flex flex-col">
            <div className="flex-1 space-y-5">
              <PasswordInput
                label="New Password"
                value={passwords.newPass}
                onChange={(e: any) =>
                  setPasswords({ ...passwords, newPass: e.target.value })
                }
                placeholder="Enter new password"
              />
              <PasswordInput
                label="Confirm Password"
                value={passwords.confirm}
                onChange={(e: any) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                placeholder="Confirm password"
                error={confirmError}
              />
            </div>
            <div className="pt-2 mt-auto">
              <Button
                onClick={handlePasswordUpdate}
                disabled={!!confirmError || !passwords.confirm}
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-11 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

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
import { ChevronLeft, Save, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import config from "./UserConfig.json";

const UserEdit = () => {
  const strings = config.strings.edit;
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userid: "",
    username: "",
    email_id: "",
    mobile_number: "",
    role: "1",
    warehouse: "WH-01",
  });

  useEffect(() => {
    // Simulating fetching user data
    if (id === "1") {
      setFormData({
        userid: "USR001",
        username: "John Doe",
        email_id: "john@wms.com",
        mobile_number: "9876543210",
        role: "2",
        warehouse: "WH-01",
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("User updated successfully");
      navigate(`/masters/users/${id}`); // Go back to profile detail after saving
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)} // Go back to the previous page (Detail)
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
                  <SelectItem value="1">Standard User</SelectItem>
                  <SelectItem value="2">Super User</SelectItem>
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
                  <SelectItem value="WH-01">WH-01 (Mumbai Main)</SelectItem>
                  <SelectItem value="WH-02">WH-02 (Delhi South)</SelectItem>
                  <SelectItem value="WH-03">
                    WH-03 (Bangalore Central)
                  </SelectItem>
                </SelectContent>
              </Select>
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

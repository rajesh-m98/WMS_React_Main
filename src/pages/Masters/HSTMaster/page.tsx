import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import {
  Plus,
  Smartphone,
  Download,
  Search,
  UploadCloud,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchAllHST,
  handleCreateHST,
  handleDeleteHST,
  handleFetchHSTTypes,
} from "@/app/manager/hstManager";
import config from "./HSTConfig.json";

interface DeviceForm {
  device_id: string;
  device_name: string;
  brand_name: string;
  device_serial_number: string;
  device_type: string;
  aisle_mapping: string;
  device_status: number;
  companyid: number;
  warehouse_id: number;
}

export const HSTMaster = () => {
  const dispatch = useAppDispatch();
  const {
    data: devices,
    loading,
    types,
  } = useAppSelector((state) => state.hst);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState<DeviceForm>({
    device_id: "",
    device_name: "",
    brand_name: "",
    device_serial_number: "",
    device_type: "",
    aisle_mapping: "Single",
    device_status: 0,
    companyid: 1,
    warehouse_id: 1,
  });

  useEffect(() => {
    dispatch(handleFetchAllHST());
    dispatch(handleFetchHSTTypes());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    const success = await dispatch(handleDeleteHST(id));
    if (success) {
      toast.success("Device deleted successfully");
    }
  };

  const handleEdit = (device: any) => {
    setEditingId(device.id);
    setFormData({
      device_id: device.device_id,
      device_name: device.device_name || "",
      brand_name: device.brand_name || "",
      device_serial_number: device.device_serial_number,
      device_type: device.device_type,
      aisle_mapping: device.aisle_mapping || "Single",
      device_status: device.device_status,
      companyid: device.companyid || 1,
      warehouse_id: device.warehouse_id || 1,
    });
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      device_id: "",
      device_name: "",
      brand_name: "",
      device_serial_number: "",
      device_type: "",
      aisle_mapping: "Single",
      device_status: 0,
      companyid: 1,
      warehouse_id: 1,
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.device_id || !formData.device_serial_number) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      ...formData,
    };

    const success = await dispatch(handleCreateHST(payload));
    if (success) {
      toast.success(editingId ? "Device updated" : "Device created");
      setOpen(false);
      resetForm();
    }
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.device_id.toLowerCase().includes(search.toLowerCase()) ||
      d.device_serial_number.toLowerCase().includes(search.toLowerCase()) ||
      (d.device_name &&
        d.device_name.toLowerCase().includes(search.toLowerCase())) ||
      d.device_type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white mb-4">
        <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-2/3 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end w-full lg:w-auto">
            <Dialog
              open={open}
              onOpenChange={(v) => {
                setOpen(v);
                if (!v) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-6 body-strong text-white flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95">
                  <Plus className="icon-sm" /> {config.strings.addDeviceBtn}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-slate-900 p-6 text-white text-center">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black mx-auto">
                      {editingId
                        ? config.strings.dialogs.form.editTitle
                        : config.strings.dialogs.form.addTitle}
                    </DialogTitle>
                    <p className="text-slate-400 text-center text-[10px] font-black uppercase  pt-2 italic">
                      {editingId
                        ? "Modify existing device parameters"
                        : "Provision a new handheld terminal"}
                    </p>
                  </DialogHeader>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.dialogs.form.idLabel}
                      </Label>
                      <Input
                        value={formData.device_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            device_id: e.target.value,
                          })
                        }
                        placeholder={config.strings.dialogs.form.idPlaceholder}
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.dialogs.form.nameLabel}
                      </Label>
                      <Input
                        value={formData.device_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            device_name: e.target.value,
                          })
                        }
                        placeholder={
                          config.strings.dialogs.form.namePlaceholder
                        }
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.dialogs.form.brandLabel}
                      </Label>
                      <Input
                        value={formData.brand_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand_name: e.target.value,
                          })
                        }
                        placeholder={
                          config.strings.dialogs.form.brandPlaceholder
                        }
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.dialogs.form.serialLabel}
                      </Label>
                      <Input
                        value={formData.device_serial_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            device_serial_number: e.target.value,
                          })
                        }
                        placeholder={
                          config.strings.dialogs.form.serialPlaceholder
                        }
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        Device Type
                      </Label>
                      <Select
                        value={formData.device_type}
                        onValueChange={(v) =>
                          setFormData({ ...formData, device_type: v })
                        }
                      >
                        <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {types.map((t: any) => (
                            <SelectItem
                              key={t.device_type}
                              value={t.device_type}
                            >
                              {t.device_type ?? t}
                            </SelectItem>
                          ))}
                          {types.length === 0 && (
                            <div className="p-3 text-center text-[10px] text-slate-400 font-black uppercase italic">
                              {loading ? "Syncing..." : "No types loaded"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.dialogs.form.mappingLabel}
                      </Label>
                      <Select
                        value={formData.aisle_mapping}
                        onValueChange={(v) =>
                          setFormData({ ...formData, aisle_mapping: v })
                        }
                      >
                        <SelectTrigger className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900">
                          <SelectValue placeholder="Select Mapping" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Multiple">Multiple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="ghost"
                      className="rounded-xl h-11 px-6 body-strong text-slate-500"
                      onClick={() => setOpen(false)}
                    >
                      {config.strings.dialogs.form.cancel}
                    </Button>
                    <Button
                      className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 px-8 body-strong text-white shadow-lg shadow-blue-100 h-11"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin icon-sm" />
                      ) : editingId ? (
                        config.strings.dialogs.form.editConfirm
                      ) : (
                        config.strings.dialogs.form.addConfirm
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md relative min-h-[400px] rounded-2xl overflow-hidden bg-white">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="table-header-font pl-6">
                  {config.strings.table.deviceId}
                </TableHead>
                <TableHead className="table-header-font text-nowrap">
                  {config.strings.table.deviceName}
                </TableHead>
                <TableHead className="table-header-font text-nowrap">
                  {config.strings.table.brandName}
                </TableHead>
                <TableHead className="table-header-font">Type</TableHead>
                <TableHead className="table-header-font text-left">
                  {config.strings.table.serialNo}
                </TableHead>
                <TableHead className="table-header-font text-nowrap">
                  {config.strings.table.mapping}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.status}
                </TableHead>
                <TableHead className="table-header-font text-right pr-6">
                  {config.strings.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-60 text-center text-slate-400 font-medium"
                  >
                    No devices matched your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((d: any) => (
                  <TableRow
                    key={d.id}
                    className="border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/50 transition-colors group"
                  >
                    <TableCell className="table-id-font pl-6">
                      {d.device_id}
                    </TableCell>
                    <TableCell className="table-cell-font !text-slate-700">
                      {d.device_name || "-"}
                    </TableCell>
                    <TableCell className="table-cell-font !text-slate-700">
                      {d.brand_name || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="icon-sm text-blue-600" />
                        <span className="table-cell-bold">{d.device_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono table-cell-font text-left">
                      {d.device_serial_number || "-"}
                    </TableCell>
                    <TableCell className="table-cell-font !text-slate-700">
                      {d.aisle_mapping || "Single"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0.5 border-0 caption-small ${d.device_status === 0 ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700" : "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700"}`}
                      >
                        {d.device_status === 0 ? "Available" : "Assigned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() => handleEdit(d)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                            <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                              <Trash2 className="icon-xl text-white animate-in zoom-in-50 duration-500 relative z-10" />
                              <AlertDialogTitle className="text-2xl font-black text-white tracking-tight relative z-10">
                                {config.strings.dialogs.delete.title}
                              </AlertDialogTitle>
                            </div>
                            <div className="p-10 text-center flex flex-col items-center">
                              <AlertDialogHeader>
                                <AlertDialogDescription className="body-strong text-slate-500 text-[15px] leading-relaxed text-center mx-auto">
                                  {config.strings.dialogs.delete.descriptionTemplate.replace(
                                    "{id}",
                                    d.device_id,
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-8 gap-3 w-full">
                                <AlertDialogCancel className="rounded-xl border-slate-200 body-strong flex-1 h-11 text-slate-600">
                                  {config.strings.dialogs.delete.cancel}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-rose-600 hover:bg-rose-700 body-strong rounded-xl px-8 flex-1 h-11 text-white shadow-lg shadow-rose-100 transition-all"
                                  onClick={() => handleDelete(d.id)}
                                >
                                  {config.strings.dialogs.delete.confirm}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HSTMaster;

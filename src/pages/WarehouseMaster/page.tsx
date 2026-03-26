import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import {
  Eye,
  Pencil,
  Building2,
  Search,
  Trash2,
  Plus,
  MapPin,
  Fingerprint,
  Loader2,
  RefreshCw,
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
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchAllWarehouses,
  handleCreateWarehouse,
  handleDeleteWarehouse,
  handleRefreshWarehouse,
  handleClearCurrentWarehouse,
} from "@/app/manager/warehouseManager";
import config from "./WarehouseConfig.json";

export const WarehouseMaster = () => {
  const dispatch = useAppDispatch();
  const { data: warehouses, loading } = useAppSelector(
    (state) => state.warehouse,
  );

  const [viewingWarehouse, setViewingWarehouse] = useState<any | null>(null);
  const [editingWarehouse, setEditingWarehouse] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    dispatch(handleFetchAllWarehouses());
  }, [dispatch]);

  const filtered = warehouses.filter(
    (wh: any) =>
      !search ||
      wh.warehouse_name?.toLowerCase().includes(search.toLowerCase()) ||
      wh.warehouse_code?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    const success = await dispatch(handleDeleteWarehouse(id));
    if (success) {
      toast.success("Warehouse deleted successfully");
    }
  };

  const handleRefresh = async () => {
    const success = await dispatch(handleRefreshWarehouse());
    if (success) {
      toast.success("Warehouse list refreshed from source");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const payload = Object.fromEntries(formData);

    // Prepare payload matching the API schema
    const warehouseData = {
      companyid: 1, // Fallback to 1
      warehouse_name: payload.warehouse_name,
      warehouse_code: payload.warehouse_code,
      gstnumber: payload.gstnumber || "",
      bplid: payload.bplid || "",
      bplname: payload.bplname || "",
      location: payload.location || "",
      street: payload.street || "",
      block: payload.block || "",
      city: payload.city || "",
      state: payload.state || "",
      country: payload.country || "",
      zipcode: payload.zipcode || "",
      inactive: payload.inactive || "N",
    };

    const success = await dispatch(
      handleCreateWarehouse(warehouseData, editingWarehouse?.id || 1),
    );
    if (success) {
      toast.success(
        editingWarehouse ? "Warehouse updated" : "Warehouse created",
      );
      setIsFormOpen(false);
      setEditingWarehouse(null);
    }
    setLoadingAction(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white mb-4">
        <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-2/3 shrink-0">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end w-full lg:w-auto">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="rounded-xl h-12 px-4 border-slate-200 hover:bg-slate-50 transition-all body-strong group"
              disabled={loading}
            >
              <RefreshCw
                className={`icon-sm mr-2 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
              Sync
            </Button>

            <Dialog
              open={isFormOpen}
              onOpenChange={(val) => {
                setIsFormOpen(val);
                if (!val) setEditingWarehouse(null);
              }}
            >
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-slate-900 hover:bg-black h-12 px-6 body-strong text-white flex items-center gap-2 shadow-lg shadow-slate-100 transition-all active:scale-95">
                  <Plus className="icon-sm" /> {config.strings.addWarehouseBtn}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl rounded-2xl p-0 overflow-hidden border-0 shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                <div className="bg-slate-900 p-6 text-white text-center shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                    <Building2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <DialogHeader>
                    <DialogTitle className="body-strong !text-white !text-xl text-center w-full">
                      {editingWarehouse
                        ? config.strings.form.editTitle
                        : config.strings.form.addTitle}
                    </DialogTitle>
                    <p className="caption-small !text-slate-400 !text-center pt-1">
                      {config.strings.form.subtitle.toUpperCase()}
                    </p>
                  </DialogHeader>
                </div>
                <div className="overflow-y-auto p-8 bg-white custom-scrollbar">
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.form.codeLabel}
                      </Label>
                      <Input
                        name="warehouse_code"
                        defaultValue={editingWarehouse?.warehouse_code}
                        placeholder={config.strings.form.codePlaceholder}
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.form.nameLabel}
                      </Label>
                      <Input
                        name="warehouse_name"
                        defaultValue={editingWarehouse?.warehouse_name}
                        placeholder={config.strings.form.namePlaceholder}
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        Street Address
                      </Label>
                      <Input
                        name="street"
                        defaultValue={editingWarehouse?.street}
                        placeholder="Street details..."
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        City
                      </Label>
                      <Input
                        name="city"
                        defaultValue={editingWarehouse?.city}
                        placeholder="City name..."
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        State
                      </Label>
                      <Input
                        name="state"
                        defaultValue={editingWarehouse?.state}
                        placeholder="State code (e.g. TN)..."
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        Zip Code
                      </Label>
                      <Input
                        name="zipcode"
                        defaultValue={editingWarehouse?.zipcode}
                        placeholder="Postal code..."
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.form.gstLabel}
                      </Label>
                      <Input
                        name="gstnumber"
                        defaultValue={editingWarehouse?.gstnumber}
                        placeholder={config.strings.form.gstPlaceholder}
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        {config.strings.form.bplLabel} (ID)
                      </Label>
                      <Input
                        name="bplid"
                        defaultValue={editingWarehouse?.bplid}
                        placeholder={config.strings.form.bplPlaceholder}
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        BPL Name
                      </Label>
                      <Input
                        name="bplname"
                        defaultValue={editingWarehouse?.bplname}
                        placeholder="System BPL Name..."
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="caption-small !text-slate-400">
                        Inactive (Y/N)
                      </Label>
                      <Input
                        name="inactive"
                        defaultValue={editingWarehouse?.inactive || "N"}
                        placeholder="N"
                        className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                      />
                    </div>

                    <div className="col-span-2 flex justify-end gap-3 pt-6 border-t mt-4 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl body-strong text-slate-500 h-11 px-8"
                        onClick={() => setIsFormOpen(false)}
                      >
                        {config.strings.form.cancelBtn}
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl bg-slate-900 hover:bg-black px-10 body-strong h-11 text-white shadow-lg flex items-center gap-2"
                        disabled={loadingAction}
                      >
                        {loadingAction && (
                          <Loader2 className="icon-sm animate-spin" />
                        )}
                        {config.strings.form.submitBtn}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b">
                <TableHead className="table-header-font pl-6 h-12">
                  {config.strings.table.identification}
                </TableHead>
                <TableHead className="table-header-font h-12">
                  {config.strings.table.location}
                </TableHead>
                <TableHead className="table-header-font h-12">
                  {config.strings.table.gstBpl}
                </TableHead>
                <TableHead className="table-header-font h-12">
                  Address Info
                </TableHead>
                <TableHead className="table-header-font h-12">
                  {config.strings.table.status}
                </TableHead>
                <TableHead className="table-header-font h-12 text-right pr-6">
                  {config.strings.table.manage}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-60 text-center text-slate-400 font-medium italic"
                  >
                    {config.strings.noFacilities}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((wh: any) => (
                  <TableRow
                    key={wh.id}
                    className="group border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/50 transition-all body-strong"
                  >
                    <TableCell className="pl-6 h-16">
                      <p className="body-strong !text-slate-900 leading-tight">
                        {wh.warehouse_name}
                      </p>
                      <p className="table-id-font !text-blue-600 !text-[11px] !tracking-normal">
                        ID: {wh.id} | CODE: {wh.warehouse_code}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="icon-sm text-slate-300" />
                        <span className="caption-small">
                          {wh.city || "—"}, {wh.state || "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="caption-small !text-[10px] !text-slate-400 uppercase leading-none mb-1">
                        GST: {wh.gstnumber || "N/A"}
                      </p>
                      <p className="caption-small !text-[10px] !text-slate-400 uppercase leading-none">
                        BPL: {wh.bplid || "N/A"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[11px] text-slate-500 truncate max-w-[150px] leading-snug">
                        {wh.street || "No street provided"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-xl px-3 py-1 border-0 body-strong ${wh.inactive === "N" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700" : "bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"}`}
                      >
                        {wh.inactive === "N" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() => {
                            setViewingWarehouse(wh);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() => {
                            setEditingWarehouse(wh);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                            <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                              <Trash2 className="icon-xl text-white animate-in zoom-in-50 duration-500 relative z-10" />
                              <AlertDialogTitle className="text-2xl font-black text-white tracking-tight relative z-10">
                                {config.strings.deleteDialog.title}
                              </AlertDialogTitle>
                            </div>
                            <div className="p-10 text-center flex flex-col items-center">
                              <AlertDialogHeader>
                                <AlertDialogDescription className="body-strong text-slate-500 pt-2 text-[15px] leading-relaxed  mx-auto">
                                  {config.strings.deleteDialog.descriptionTemplate.replace(
                                    "{name}",
                                    wh.warehouse_name,
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex gap-4 w-full mt-10">
                                <AlertDialogCancel className="rounded-xl border-slate-200 body-strong flex-1 h-12 text-slate-600 hover:bg-slate-50">
                                  {config.strings.deleteDialog.cancelBtn}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-rose-600 hover:bg-rose-700 body-strong rounded-xl px-10 flex-1 h-12 text-white shadow-lg shadow-rose-100 transition-all active:scale-95"
                                  onClick={() => handleDelete(wh.id)}
                                >
                                  {config.strings.deleteDialog.confirmBtn}
                                </AlertDialogAction>
                              </div>
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

      {/* Detail Viewer Dialog (Secondary View) */}
      <Dialog
        open={!!viewingWarehouse}
        onOpenChange={() => setViewingWarehouse(null)}
      >
        <DialogContent className="max-w-md rounded-2xl p-0 border-0 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          <div className="h-32 bg-slate-900 relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px]" />
            <Building2 className="h-12 w-12 text-blue-500 relative" />
          </div>
          <div className="p-8 text-center -mt-6">
            <div className="inline-block bg-white p-2 rounded-2xl shadow-xl border border-slate-50 mb-4">
              <Fingerprint className="h-8 w-8 text-slate-900" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-none mb-2">
              {viewingWarehouse?.warehouse_name}
            </h2>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">
              {viewingWarehouse?.warehouse_code}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8 pb-4">
              <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {config.strings.detailView.gstLabel}
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {viewingWarehouse?.gstnumber || "—"}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {config.strings.detailView.bplLabel} (ID)
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {viewingWarehouse?.bplid || "—"}
                </p>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl bg-slate-900 font-bold mt-4 shadow-lg active:scale-[0.98] transition-all"
              onClick={() => setViewingWarehouse(null)}
            >
              {config.strings.detailView.dismissBtn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehouseMaster;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  handleGetWarehouseById,
  handleCreateWarehouse,
  handleDeleteWarehouse,
  handleRefreshWarehouse,
  handleClearCurrentWarehouse,
} from "@/app/manager/warehouseManager";
import { clearAllWarehouses, warehouseLoadStart } from "@/app/store/warehouseSlice";
import config from "./WarehouseConfig.json";

export const WarehouseMaster = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: warehouses, loading } = useAppSelector(
    (state) => state.warehouse,
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any | null>(null);

  const { totalCount } = useAppSelector((state) => state.warehouse);

  const totalPages = Math.ceil(totalCount / pageSize);
  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const endPage = Math.min(totalPages, Math.max(page + 2, 5));

  useEffect(() => {
    dispatch(
      handleFetchAllWarehouses({ page, size: pageSize, is_paginate: true }),
    );
    return () => {
      dispatch(clearAllWarehouses());
    };
  }, [dispatch, page]);

  const handleView = (id: number) => {
    navigate(`/masters/warehouses/${id}?type=warehouse`);
  };

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
    dispatch(warehouseLoadStart());
    const success = await dispatch(handleRefreshWarehouse());
    if (success) {
      await dispatch(
        handleFetchAllWarehouses({ page, size: pageSize, is_paginate: true }),
      );
      toast.success("Facility List Refreshed Successfully");
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
      handleCreateWarehouse(warehouseData, editingWarehouse?.id),
    );
    if (success) {
      toast.success(
        editingWarehouse ? "Warehouse updated" : "Warehouse created",
      );
      setIsFormOpen(false);
      setEditingWarehouse(null);
      dispatch(
        handleFetchAllWarehouses({ page, size: pageSize, is_paginate: true }),
      );
    }
    setLoadingAction(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="h-12 px-5 rounded-xl border border-slate-200 body-strong text-slate-600 hover:bg-slate-50 transition-all active:scale-95 group"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`icon-sm ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
              <span className="ml-2 uppercase tracking-widest text-[10px] font-black">
                {loading ? "Syncing..." : "Sync Facilities"}
              </span>
            </Button>

            <Dialog
              open={isFormOpen}
              onOpenChange={(val) => {
                setIsFormOpen(val);
                if (!val) setEditingWarehouse(null);
              }}
            >
              <DialogTrigger asChild>
                <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white body-strong transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2">
                  <Plus className="icon-sm" /> {config.strings.addWarehouseBtn}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl p-0 overflow-hidden border-0 shadow-3xl bg-white rounded-[2.5rem]">
                <DialogHeader className="p-8 bg-slate-900 text-white relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <DialogTitle className="text-3xl font-black tracking-tighter flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Building2 className="icon-base text-white" />
                    </div>
                    {editingWarehouse
                      ? config.strings.form.editTitle
                      : config.strings.form.addTitle}
                  </DialogTitle>
                </DialogHeader>

                <div className="p-10 bg-white overflow-y-auto max-h-[70vh]">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-1 bg-blue-600 rounded-full" />
                          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                            Core Identity
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Warehouse Code
                            </Label>
                            <Input
                              name="warehouse_code"
                              defaultValue={editingWarehouse?.warehouse_code}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900 focus:bg-white transition-all font-mono"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Warehouse Name
                            </Label>
                            <Input
                              name="warehouse_name"
                              defaultValue={editingWarehouse?.warehouse_name}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900 focus:bg-white transition-all"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Status
                            </Label>
                            <Input
                              name="inactive"
                              defaultValue={editingWarehouse?.inactive || "N"}
                              placeholder="N = Active, Y = Inactive"
                              maxLength={1}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900 focus:bg-white transition-all text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-1 bg-indigo-600 rounded-full" />
                          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                            Location Details
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Street / Area
                            </Label>
                            <Input
                              name="street"
                              defaultValue={editingWarehouse?.street}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                City
                              </Label>
                              <Input
                                name="city"
                                defaultValue={editingWarehouse?.city}
                                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Zipcode
                              </Label>
                              <Input
                                name="zipcode"
                                defaultValue={editingWarehouse?.zipcode}
                                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                State
                              </Label>
                              <Input
                                name="state"
                                defaultValue={editingWarehouse?.state}
                                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Country
                              </Label>
                              <Input
                                name="country"
                                defaultValue={editingWarehouse?.country || "India"}
                                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-1 bg-emerald-600 rounded-full" />
                          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">
                            Technical Scope
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              GST Number
                            </Label>
                            <Input
                              name="gstnumber"
                              defaultValue={editingWarehouse?.gstnumber}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono tracking-wider transition-all focus:bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              BPL Name
                            </Label>
                            <Input
                              name="bplname"
                              defaultValue={editingWarehouse?.bplname}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              BPL ID
                            </Label>
                            <Input
                              name="bplid"
                              defaultValue={editingWarehouse?.bplid}
                              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-900 font-mono italic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl h-12 px-8 border-2 border-slate-200 body-strong text-slate-600 hover:bg-slate-50 transition-all"
                        onClick={() => setIsFormOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl bg-blue-600 hover:bg-slate-900 text-white px-12 h-12 body-strong transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-2"
                        disabled={loadingAction}
                      >
                        {loadingAction && <Loader2 className="icon-sm animate-spin" />}
                        {editingWarehouse ? "Commit Sync" : "Initialize Facility"}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-2xl p-4 rounded-[2.5rem] overflow-hidden bg-white relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50/80">
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[80px]">
                    SL NO
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap">
                    WAREHOUSE NAME
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[200px]">
                    WAREHOUSE CODE
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[250px]">
                    GST NUMBER
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap text-right w-[150px]">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="icon-xl text-blue-600 animate-spin" />
                        <p className="caption-small !text-slate-400">
                          Syncing Facilities...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest"
                    >
                      No Warehouse Data Found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((wh: any, index: number) => (
                    <TableRow
                      key={wh.id}
                      className="group border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/50 transition-all font-bold"
                    >
                      <TableCell className="px-5 py-4 text-[11px] font-mono text-black text-center">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-[13px] font-black text-slate-950 uppercase tracking-tight">
                        {wh.warehouse_name}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-mono text-[12px] font-bold text-blue-600 whitespace-nowrap uppercase tracking-widest">
                        {wh.warehouse_code}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className="rounded-lg border border-slate-200 bg-white font-mono text-[11px] font-bold px-3 py-1 text-slate-600 shadow-sm whitespace-nowrap uppercase"
                        >
                          {wh.gstnumber || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-5 py-4">
                        <div className="flex items-center justify-end gap-2 text-left transition-all">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            onClick={() => handleView(wh.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
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
                                className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
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
                                <AlertDialogHeader className="flex flex-col items-center">
                                  <AlertDialogDescription className="body-strong text-slate-500 pt-2 text-[15px] leading-relaxed  mx-auto text-center">
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
          </div>

          <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 bg-blue-600 px-5 py-2.5 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-100">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
                {config.strings.totalWarehouses}
              </span>
              <span className="h-4 w-[2px] bg-blue-400/50 rounded-full mx-1" />
              <span className="text-sm font-black text-white tabular-nums">
                {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === 1 || loading}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft className="icon-sm text-slate-600" />
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>
              <div className="flex items-center gap-2 px-4">
                {Array.from(
                  { length: Math.min(totalPages, endPage - startPage + 1) },
                  (_, i) => {
                    const p = startPage + i;
                    if (p <= 0) return null;
                    return (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "ghost"}
                        className={`h-10 w-10 rounded-xl font-black text-xs ${page === p ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-900"}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    );
                  },
                )}
              </div>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-6 w-6 text-slate-600" />
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === totalPages || loading}
                onClick={() => setPage(totalPages)}
              >
                <ChevronsRight className="icon-sm text-slate-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseMaster;

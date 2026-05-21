import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
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
  Plus,
  Smartphone,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Eye,
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
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchAllHST, handleDeleteHST } from "@/app/manager/hstManager";
import { clearAllHST, hstLoadStart } from "@/app/store/hstSlice";
import config from "./HSTConfig.json";

export const HSTMaster = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: devices,
    loading,
    totalCount,
  } = useAppSelector((state) => state.hst);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    dispatch(handleFetchAllHST({ page, size: PAGE_SIZE }));
    return () => {
      dispatch(clearAllHST());
    };
  }, [dispatch, page]);

  const handleView = (id: number) => {
    navigate(`/masters/hst/${id}?type=hst`);
  };

  const handleDelete = async (id: number) => {
    const success = await dispatch(handleDeleteHST(id));
    if (success) {
      toast.success("Device deleted successfully");
      dispatch(handleFetchAllHST({ page, size: PAGE_SIZE }));
    }
  };

  const handleAdd = () => {
    navigate("/masters/hst/new/edit");
  };

  const handleEdit = (device: any) => {
    navigate(`/masters/hst/${device.id}/edit`);
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.device_serial_number.toLowerCase().includes(search.toLowerCase()) ||
      (d.device_name &&
        d.device_name.toLowerCase().includes(search.toLowerCase())) ||
      d.device_type.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRefresh = async () => {
    dispatch(hstLoadStart());
    await dispatch(handleFetchAllHST({ page, size: PAGE_SIZE }));
    toast.success("Device Master Refreshed Successfully");
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const endPage = Math.min(totalPages, Math.max(page + 2, 5));

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border-1 border-slate-200 shadow-lg shadow-slate-300">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            placeholder="Search By Device Name ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-6 h-14 w-full rounded-2xl bg-white border-2 border-slate-200 shadow-md shadow-slate-200 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleRefresh}
            disabled={loading}
            className="h-14 px-6 rounded-2xl bg-white border-2 border-slate-100 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-md group flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
            />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={handleAdd}
            className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-white flex items-center gap-3 transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            <Plus className="h-5 w-5" /> Create Device
          </Button>
        </div>
      </div>

      <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl overflow-hidden bg-white">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100 border-b border-slate-300">
                <TableHead className="px-6 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {config.strings.table.slNo}
                </TableHead>
                <TableHead className="px-4 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {config.strings.table.deviceName}
                </TableHead>
                <TableHead className="px-4 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {config.strings.table.brandName}
                </TableHead>
                <TableHead className="px-4 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Type
                </TableHead>
                <TableHead className="px-4 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Serial No
                </TableHead>
                <TableHead className="px-4 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">
                  Status
                </TableHead>
                <TableHead className="px-6 py-5 text-[10px] font-black text-slate-900 uppercase tracking-widest text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((d: any, index: number) => (
                <TableRow
                  key={d.id}
                  className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group"
                >
                  <TableCell className="px-6 py-4 text-sm font-black text-slate-700">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4 font-black text-slate-900 text-sm">
                    {d.device_name || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-bold text-slate-500 uppercase">
                    {d.brand_name || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700 uppercase">
                        {d.device_type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-bold text-slate-700">
                    {d.device_serial_number || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center">
                    <Badge
                      variant="outline"
                      className={`rounded-lg px-3 py-1 border-0 text-sm font-black uppercase ${d.device_status === 0 ? "bg-emerald-100 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {d.device_status === 0 ? "Available" : "Assigned"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl bg-slate-100 border-2 border-slate-100 shadow-md shadow-blue-300 text-slate-800 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        onClick={() => handleView(d.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl bg-slate-100 border-2 border-slate-100 shadow-md shadow-blue-300 text-slate-800 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                        onClick={() => handleEdit(d)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl bg-slate-100 border-2 border-slate-100 shadow-md shadow-blue-300 text-slate-800 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                          <div className="bg-rose-600 py-10 flex flex-col items-center justify-center text-white gap-2">
                            <Trash2 className="h-12 w-12" />
                            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter">
                              De-provision Device
                            </AlertDialogTitle>
                          </div>
                          <div className="p-10 space-y-8">
                            <AlertDialogDescription className="text-center font-black text-slate-500 text-sm leading-relaxed">
                              Are you sure you want to remove{" "}
                              <span className="text-slate-900 underline">
                                {d.device_id}
                              </span>{" "}
                              from the network? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="flex gap-4">
                              <AlertDialogCancel className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                                Abort
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-100"
                                onClick={() => handleDelete(d.id)}
                              >
                                Confirm Removal
                              </AlertDialogAction>
                            </div>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 bg-blue-600 px-5 py-2.5 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-100">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
              Total Devices
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
      </Card>
    </div>
  );
};

export default HSTMaster;

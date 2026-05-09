import { useState, useEffect } from "react";
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
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchFloors,
  handleDeleteFloor,
} from "@/app/manager/floorManager";
import { downloadCSV } from "@/core/utils/csvHelper";
import config from "./FloorConfig.json";
import DetailPopup from "./DetailPopup";

const PAGE_SIZE = 10;

export const FloorMaster = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: floors, loading } = useAppSelector((state) => state.floor);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(handleFetchFloors(1));
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    await dispatch(handleDeleteFloor(id));
  };

  const filteredFloors = floors.filter(
    (f) =>
      f.barcode?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      f.floor_name?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const totalCount = filteredFloors.length;
  const displayFloors = filteredFloors.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleExport = () => {
    const exportData = filteredFloors.map((f) => ({
      ID: f.id,
      "Floor Name": f.floor_name,
      Barcode: f.barcode,
    }));
    downloadCSV(
      exportData,
      `Floor_Master_${new Date().toISOString().split("T")[0]}`,
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-2/5 shrink-0">
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
              className="rounded-xl h-12 px-6 body-strong border-slate-200 flex items-center gap-2 hover:bg-slate-50 transition-all"
              onClick={handleExport}
            >
              <Download className="icon-sm text-emerald-500" />{" "}
              {config.strings.exportBtn}
            </Button>
            <Button
              className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-6 body-strong text-white flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
              onClick={() => navigate("/masters/floors/create")}
            >
              <Plus className="icon-sm" /> {config.strings.addBtn}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-premium scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-2 border-slate-900/10">
                  <TableHead className="label-bold px-6 py-5 text-left whitespace-nowrap">
                    {config.strings.table.id}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    Floor Name
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.barcode}
                  </TableHead>
                  <TableHead className="label-bold px-10 py-5 text-right pr-6 whitespace-nowrap">
                    {config.strings.table.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-96 text-left">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="label-bold !text-slate-400">
                          Loading Floor Data...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : displayFloors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-96 text-left">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <Layers className="h-20 w-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase">
                          No floors defined
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayFloors.map((floor, idx) => (
                    <TableRow
                      key={floor.id}
                      className="hover:bg-blue-50/40 transition-all duration-300 group cursor-default border-b border-slate-50 text-left"
                    >
                      <td className="px-6 py-5 label-bold !text-slate-400 whitespace-nowrap text-left">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-800 whitespace-nowrap text-left">
                        {floor.floor_name || "-"}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-blue-600 rounded-lg whitespace-nowrap text-left">
                        {floor.barcode}
                      </td>
                      <td className="px-10 py-5 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl bg-slate-50/80 shadow-lg shadow-slate-300 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            onClick={() => {
                              setSelectedFloor(floor);
                              setIsDetailOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            onClick={() =>
                              navigate(`/masters/floors/${floor.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-2xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                              <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                                <Trash2 className="icon-xl text-white animate-in zoom-in-50 duration-500 relative z-10" />
                                <AlertDialogTitle className="text-2xl font-black text-white tracking-tight relative z-10">
                                  {config.strings.deleteAlert.title}
                                </AlertDialogTitle>
                              </div>
                              <div className="p-10 text-center flex flex-col items-center">
                                <AlertDialogHeader>
                                  <AlertDialogDescription className="body-strong text-slate-500 pt-2 text-[15px] leading-relaxed  mx-auto">
                                    {config.strings.deleteAlert.descriptionTemplate.replace(
                                      "{value}",
                                      floor.floor_name || floor.barcode,
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-4 w-full mt-10">
                                  <AlertDialogCancel className="rounded-xl border-slate-200 body-strong flex-1 h-12 text-slate-600 hover:bg-slate-50">
                                    {config.strings.deleteAlert.cancelBtn}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-rose-600 hover:bg-rose-700 body-strong rounded-xl px-10 flex-1 h-12 text-white shadow-lg shadow-rose-100 transition-all active:scale-95"
                                    onClick={() => handleDelete(floor.id)}
                                  >
                                    {config.strings.deleteAlert.confirmBtn}
                                  </AlertDialogAction>
                                </div>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <Badge className="h-10 px-4 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-400 label-bold uppercase tracking-widest text-[11px]">
              Total Records:{" "}
              <span className="text-blue-600 ml-2 font-black">
                {totalCount}
              </span>
            </Badge>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page * PAGE_SIZE >= totalCount || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-6 w-6 text-slate-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DetailPopup
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        floor={selectedFloor}
      />
    </div>
  );
};

export default FloorMaster;

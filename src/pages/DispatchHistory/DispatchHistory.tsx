import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Truck,
  Box,
  User,
  Cpu,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Badge,
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchDispatchHistory } from "@/app/manager/dispatchManager";
import { useDebounce } from "@/hooks/use-debounce";
import config from "./DispatchConfig.json";
import { toast } from "sonner";

export const DispatchHistory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: storeData,
    loading,
    totalCount: storeTotalCount,
  } = useAppSelector((state) => state.dispatch);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    dispatch(
      handleFetchDispatchHistory({
        page,
        size: pageSize,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  const totalPages = Math.ceil(storeTotalCount / pageSize);
  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const endPage = Math.min(totalPages, Math.max(page + 2, 5));

  const handleSync = () => {
    dispatch(
      handleFetchDispatchHistory({
        page,
        size: pageSize,
        search: debouncedSearch,
      }),
    );
    toast.success("Dispatch history synchronized");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Main Table */}
      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-premium scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-2 border-slate-900/10">
                  <TableHead className="label-bold px-6 py-5 text-left whitespace-nowrap">
                    {config.strings.table.id}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left hover:text-blue-600 transition-colors cursor-help whitespace-nowrap">
                    {config.strings.table.docNo}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.putawayType}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.cardName}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.docDate}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.itemCode}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.totalQty}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.filledQty}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left whitespace-nowrap">
                    {config.strings.table.remainingQty}
                  </TableHead>
                  <TableHead className="label-bold px-10 py-5 text-right pr-6 whitespace-nowrap">
                    {config.strings.table.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-64 text-left">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="label-bold !text-slate-400">
                          Loading Dispatch History...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : storeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-64 text-left">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <Box className="h-20 w-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase">
                          {config.strings.noRecords}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  storeData.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-blue-50/40 transition-all duration-300 group cursor-default border-b border-slate-50 text-left"
                    >
                      <td className="px-6 py-5 label-bold !text-slate-400 whitespace-nowrap text-left">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-5 text-left">
                        <span className="text-sm font-black text-blue-600 bg-blue-50/50 rounded-lg whitespace-nowrap">
                          {row.docnum}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-left">
                        <Badge
                          className={`label-bold !tracking-wide px-3 py-1 rounded-lg border transition-all hover:scale-105 duration-300 ${
                            row.putaway_type === 1
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-50"
                              : row.putaway_type === 2
                                ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-500 hover:text-white shadow-sm shadow-blue-50"
                                : "bg-slate-50 text-slate-700 hover:bg-blue-500 hover:text-white border-slate-200"
                          }`}
                        >
                          {row.putaway_type === 1
                            ? "INWARD"
                            : row.putaway_type === 2
                              ? "OUTWARD"
                              : "N/A"}
                        </Badge>
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-800 whitespace-nowrap text-left">
                        {row.cardname}
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap text-left">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs font-bold tabular-nums">
                            {row.docdate}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-blue-600 tabular-nums uppercase text-left whitespace-nowrap">
                        {row.item_code}
                      </td>
                      <td className="px-4 py-5 text-left font-black text-slate-900 tabular-nums whitespace-nowrap">
                        {row.total_quntity}
                      </td>
                      <td className="px-4 py-5 text-left whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-black tabular-nums">
                          {row.filled_quntity}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-left whitespace-nowrap">
                        <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg font-black tabular-nums">
                          {row.remaining_quntity}
                        </span>
                      </td>
                      <td className="px-10 py-5 text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-50/80 shadow-lg shadow-slate-300 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() =>
                            navigate(
                              `/transactions/tasks/${row.id}?type=dispatch`,
                            )
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-10 px-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white flex items-center gap-3 transition-all cursor-default pointer-events-none group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="label-bold text-slate-400 text-[11px] uppercase tracking-widest font-black leading-none pt-0.5">
                    {config.strings.totalRecords}
                  </span>
                  <div className="h-6 px-2.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-[6px] flex items-center justify-center font-black text-xs tabular-nums shadow-md shadow-blue-100 transition-colors">
                    {storeTotalCount}
                  </div>
                </div>
              </Button>
            </div>

            {totalPages > 1 && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchHistory;

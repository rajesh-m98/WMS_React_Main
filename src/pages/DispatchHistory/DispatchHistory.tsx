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

const DUMMY_DATA = [
  {
    id: 1,
    doc_entry: 104522,
    line_id: 0,
    doc_number: "INV-2024-001",
    card_code: "C00124",
    card_name: "Global Enterprises LLC",
    doc_date: "2024-03-27",
    carton_barcode: "CRT-99210-A1",
    created_at: "2024-03-27 10:15 AM",
    hst_device_id: 1,
    hst_device_name: "ZEBRA-MC9300-X1",
    created_by_id: 1,
    user_name: "Giri Admin",
    total_qty: 100,
    remaining_qty: 0,
    filled_qty: 100,
  },
  {
    id: 2,
    doc_entry: 104523,
    line_id: 1,
    doc_number: "INV-2024-002",
    card_code: "C00852",
    card_name: "Tech Solutions Pvt",
    doc_date: "2024-03-27",
    carton_barcode: "CRT-99210-B4",
    created_at: "2024-03-27 11:30 AM",
    hst_device_id: 2,
    hst_device_name: "MC3300-Android-R2",
    created_by_id: 1,
    user_name: "Giri Admin",
    total_qty: 50,
    remaining_qty: 12,
    filled_qty: 38,
  },
];

export const DispatchHistory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: storeData,
    loading,
    totalCount: storeTotalCount,
    filters,
  } = useAppSelector((state) => state.dispatch);

  // For Demo Purposes: If store is empty, use dummy data
  const isDemo = storeData.length === 0 && !loading;
  const data = isDemo ? DUMMY_DATA : storeData;
  const totalCount = isDemo ? DUMMY_DATA.length : storeTotalCount;

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

  const totalPages = Math.ceil(totalCount / pageSize);
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
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="heading-section !text-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
              <Truck className="h-5 w-5 text-white" />
            </div>
            {config.strings.title}
          </h1>
          <p className="label-bold !text-slate-400 italic">
            {config.strings.subtitle.toUpperCase()}
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
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
              className="h-12 px-5 rounded-xl border border-slate-200 body-strong text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              onClick={handleSync}
              disabled={loading}
            >
              <RefreshCw
                className={`icon-sm ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-premium scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-[1800px]">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-2 border-slate-900/10">
                  <TableHead className="label-bold px-10 py-6 whitespace-nowrap">
                    {config.strings.table.id}
                  </TableHead>
                  <TableHead className="label-bold px-4 hover:text-blue-600 transition-colors cursor-help whitespace-nowrap">
                    {config.strings.table.docEntry}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.lineId}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.docNo}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.cardCode}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.cardName}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.docDate}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.cartonBarcode}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.hstDevice}
                  </TableHead>
                  <TableHead className="label-bold px-4 whitespace-nowrap">
                    {config.strings.table.userDetails}
                  </TableHead>
                  <TableHead className="label-bold px-4 text-right whitespace-nowrap">
                    {config.strings.table.totalQty}
                  </TableHead>
                  <TableHead className="label-bold px-4 text-right whitespace-nowrap">
                    {config.strings.table.filledQty}
                  </TableHead>
                  <TableHead className="label-bold px-4 text-right whitespace-nowrap">
                    {config.strings.table.remainingQty}
                  </TableHead>
                  <TableHead className="label-bold px-10 text-right pr-10 whitespace-nowrap">
                    {config.strings.table.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={14} className="h-96 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="label-bold !text-slate-400">
                          Loading Dispatch History...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="h-96 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <Box className="h-20 w-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase">
                          {config.strings.noRecords}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-blue-50/40 transition-all duration-300 group cursor-default border-b border-slate-50"
                    >
                      <td className="px-10 py-6 label-bold !text-slate-400 whitespace-nowrap align-middle">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-6 font-black text-slate-900 font-mono whitespace-nowrap align-middle">
                        {row.doc_entry}
                      </td>
                      <td className="px-4 py-6 text-sm font-bold text-slate-500 italic whitespace-nowrap align-middle">
                        # {row.line_id}
                      </td>
                      <td className="px-4 py-6 align-middle">
                        <span className="text-sm font-black text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-lg whitespace-nowrap">
                          {row.doc_number}
                        </span>
                      </td>
                      <td className="px-4 py-6 label-bold !text-slate-500 !tracking-wide whitespace-nowrap align-middle">
                        {row.card_code}
                      </td>
                      <td className="px-4 py-6 text-sm font-black text-slate-800 whitespace-nowrap align-middle">
                        {row.card_name}
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs font-bold tabular-nums">
                            {row.doc_date}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap align-middle">
                        <Badge className="bg-slate-900 border-0 label-bold !tracking-normal px-3 py-1 h-7">
                          {row.carton_barcode}
                        </Badge>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-sm font-bold text-slate-600">
                            {row.hst_device_name ||
                              "Device " + row.hst_device_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-6 whitespace-nowrap align-middle">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm font-bold text-slate-600">
                            {row.user_name || "User " + row.created_by_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-right font-black text-slate-900 tabular-nums whitespace-nowrap align-middle">
                        {row.total_qty}
                      </td>
                      <td className="px-4 py-6 text-right whitespace-nowrap align-middle">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-black tabular-nums">
                          {row.filled_qty}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-right whitespace-nowrap align-middle">
                        <span className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg font-black tabular-nums">
                          {row.remaining_qty}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right pr-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-50/80 shadow-lg shadow-slate-300 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() =>
                            navigate(`/transactions/tasks/${row.doc_entry}`)
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
            <div className="flex items-center gap-4">
              <p className="label-bold !text-slate-400 italic">
                {config.strings.totalRecords}{" "}
                <span className="text-slate-900 ml-2 border-b-2 border-blue-500">
                  {totalCount}
                </span>
              </p>
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

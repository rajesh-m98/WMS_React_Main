import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Loader2, ClipboardList, Calendar } from "lucide-react";
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
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchPutawayHistory } from "@/app/manager/putawayManager";
import { useDebounce } from "@/hooks/use-debounce";
import config from "./PutawayConfig.json";

export const InwardHistory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: storeData,
    loading,
    totalCount,
  } = useAppSelector((state) => state.putaway.inward);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    dispatch(handleFetchPutawayHistory("inward", { page, size: pageSize }));
  }, [dispatch, page]);

  const handleViewDetail = (id: number) => {
    navigate(`/transactions/tasks/${id}?type=putaway&reqType=inward`);
  };

  const filteredItems = storeData.filter(
    (item: any) =>
      !debouncedSearch ||
      item.docnum?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.item_code?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.cardname?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={config.strings.searchPlaceholder}
            className="pl-11 h-12 rounded-[1.25rem] bg-white border-2 border-slate-100 hover:border-blue-400 transition-all text-sm font-medium shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-2 border-slate-900/10">
                  <TableHead className="label-bold px-6 py-5 text-left">
                    {config.strings.table.id}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left">
                    {config.strings.table.docNo}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left">
                    {config.strings.table.warehouse}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left">
                    {config.strings.table.partner}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left">
                    {config.strings.table.docDate}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left">
                    {config.strings.table.itemCode}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-left">
                    {config.strings.table.batch}
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-right">
                    {config.strings.table.qty}
                  </TableHead>
                  <TableHead className="label-bold px-10 py-5 text-right pr-6">
                    {config.strings.table.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="label-bold !text-slate-400">
                          Loading Inward History...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <ClipboardList className="h-20 w-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase">
                          {config.strings.noRecords}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-blue-50/40 transition-all duration-300 group border-b border-slate-50"
                    >
                      <td className="px-6 py-5 label-bold !text-slate-300 font-mono text-left">
                        {(page - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-sm font-black text-blue-600 bg-blue-50/70 border border-blue-100/50 px-2.5 py-1 rounded-lg shadow-sm">
                          {row.docnum}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-900">
                        {row.whscode}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-600 truncate max-w-[150px]">
                        {row.cardname}
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                          <Calendar className="h-3 w-3" />
                          {row.docdate}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-blue-600 tabular-nums uppercase">
                        {row.item_code}
                      </td>
                      <td className="px-4 py-5 text-xs font-black text-slate-400 tracking-tight">
                        {row.batch_number || "N/A"}
                      </td>
                      <td className="px-4 py-5 text-right font-black text-slate-900 tabular-nums">
                        <span className="bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-slate-200">
                          {row.quantity}
                        </span>
                      </td>
                      <td className="px-10 py-5 text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-50/80 shadow-lg shadow-slate-300 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-slate-100/50"
                          onClick={() => handleViewDetail(row.id)}
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

          <div className="p-8 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="label-bold text-slate-400 text-[11px] uppercase tracking-widest">
                {config.strings.totalRecords}
              </span>
              <div className="h-7 px-3 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-md shadow-blue-100">
                {totalCount}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-10 px-4 font-bold border-slate-200"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-900 border border-slate-200">
                {page}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-10 px-4 font-bold border-slate-200"
                disabled={filteredItems.length < pageSize || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InwardHistory;

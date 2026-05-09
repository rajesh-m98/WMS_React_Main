import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  Calendar as CalendarIcon,
  Activity,
  Package,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Separator } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchPutawayHistory } from "@/app/manager/putawayManager";
import { handleFetchGins } from "@/app/manager/ginManager";

export const ActivityLog = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "inward" | "outward">(
    "all",
  );
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const { inward, outward } = useAppSelector((state) => state.putaway);
  const { flowThroughItems, putawayItems } = useAppSelector(
    (state) => state.gin,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      await Promise.all([
        dispatch(handleFetchPutawayHistory("inward", { page: 1, size: 100 })),
        dispatch(handleFetchPutawayHistory("outward", { page: 1, size: 100 })),
        dispatch(
          handleFetchGins({
            gin_type: 1,
            page: 1,
            size: 100,
            is_paginate: true,
          }),
        ),
        dispatch(
          handleFetchGins({
            gin_type: 2,
            page: 1,
            size: 100,
            is_paginate: true,
          }),
        ),
      ]);
      setIsLoading(false);
    };
    fetchAll();
  }, [dispatch]);

  const combinedData = useMemo(() => {
    const data = [
      ...inward.data.map((tx) => ({
        id: tx.id?.toString() || "---",
        origin: "task",
        headerId: null,
        type: "Inward",
        source: "Putaway",
        item: tx.item_code || "Unknown",
        qty: tx.quantity,
        date: tx.docdate?.split("T")[0],
        time: tx.updated_at || tx.docdate,
        partner: tx.cardname,
        docNum: tx.docnum,
        timestamp: new Date(tx.docdate || tx.updated_at || 0).getTime() || 0,
      })),
      ...outward.data.map((tx) => ({
        id: tx.id?.toString() || "---",
        origin: "task",
        headerId: null,
        type: "Outward",
        source: "Picklist",
        item: tx.item_code || "Unknown",
        qty: tx.quantity || 0,
        date:
          (tx.docdate || tx.updated_at || "").toString().split("T")[0] || "---",
        time: tx.updated_at || tx.docdate || "",
        partner: tx.cardname || "---",
        docNum: tx.docnum,
        timestamp: new Date(tx.docdate || tx.updated_at || 0).getTime() || 0,
      })),
      ...flowThroughItems.map((tx) => ({
        id: tx.id?.toString() || "---",
        headerId: tx.header_id,
        origin: "gin",
        type: "Inward",
        source: "GIN (Flow)",
        item: tx.item_code || "Unknown",
        qty: tx.received_qty || 0,
        date: (tx.created_at || "").toString().split("T")[0] || "---",
        time: tx.created_at || "",
        partner: tx.header?.card_name || "---",
        docNum: tx.header?.gate_pass_number || "---",
        timestamp: new Date(tx.created_at || 0).getTime() || 0,
      })),
      ...putawayItems.map((tx) => ({
        id: tx.id?.toString() || "---",
        headerId: tx.header_id,
        origin: "gin",
        type: "Inward",
        source: "GIN (Putaway)",
        item: tx.item_code || "Unknown",
        qty: tx.received_qty || 0,
        date: (tx.created_at || "").toString().split("T")[0] || "---",
        time: tx.created_at || "",
        partner: tx.header?.card_name || "---",
        docNum: tx.header?.gate_pass_number || "---",
        timestamp: new Date(tx.created_at || 0).getTime() || 0,
      })),
    ];

    return data.sort((a, b) => a.timestamp - b.timestamp);
  }, [inward.data, outward.data, flowThroughItems, putawayItems]);

  const filteredData = useMemo(() => {
    return combinedData.filter((item) => {
      const matchesSearch =
        item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id?.includes(searchTerm) ||
        item.partner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.docNum?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || item.type.toLowerCase() === typeFilter;
      const matchesDate = !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesType && matchesDate;
    });
  }, [combinedData, searchTerm, typeFilter, dateFilter]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Search and Filter Row */}
      <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="relative w-full lg:w-1/4 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
              <Input
                placeholder="Search items, partners or docs..."
                className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Separator
              orientation="vertical"
              className="hidden lg:block h-8 bg-slate-100"
            />

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                Type:
              </span>
              <div className="flex bg-slate-100 p-1 rounded-xl relative">
                {["all", "inward", "outward"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t as any);
                      setPage(1);
                    }}
                    className={`relative z-10 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      typeFilter === t
                        ? "text-blue-600"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t}
                    {typeFilter === t && (
                      <div className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10 animate-in fade-in zoom-in duration-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden lg:block h-8 bg-slate-100"
            />

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                Date:
              </span>
              <div className="relative w-full lg:w-40">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  className="pl-10 h-10 rounded-lg bg-slate-50 border-slate-200 text-xs font-bold"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {dateFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 text-[10px] font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg px-3"
                  onClick={() => setDateFilter("")}
                >
                  CLEAR DATE
                </Button>
              )}
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest gap-2 h-11 px-5 bg-white shadow-sm hover:shadow-md active:scale-95"
                onClick={() => window.location.reload()}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
                Sync
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[3rem] bg-white overflow-hidden relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Entry ID
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Operation
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Movement Details
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Partner / Vendor
                  </th>
                  <th className="px-8 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Qty
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest pr-8">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        <p className="label-bold !text-slate-400 uppercase tracking-widest">
                          Fetching Audit Data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((tx) => (
                    <tr
                      key={`${tx.source}-${tx.id}`}
                      className="hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer border-b border-slate-50 last:border-0"
                      onClick={() => {
                        if (tx.origin === "gin") {
                          navigate(`/transactions/gin/view/${tx.headerId}/${tx.id}`);
                        } else {
                          navigate(`/transactions/tasks/${tx.id}`);
                        }
                      }}
                    >
                      <td className="px-8 py-6 text-sm font-black text-slate-400 font-mono">
                        {tx.id}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <Badge
                            className={`rounded-lg px-2.5 py-1 border-0 font-black text-[9px] tracking-widest text-white w-fit ${tx.type === "Inward" ? "bg-blue-600" : "bg-indigo-600"}`}
                          >
                            {tx.type.toUpperCase()}
                          </Badge>
                          <span className="text-[12px] font-black uppercase tracking-tighter opacity-60">
                            {tx.source}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">
                            {tx.item || "General Inventory"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mt-0.5">
                            Doc:{" "}
                            <span className="text-blue-500 font-black">
                              {tx.docNum || "---"}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="label-bold !text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl text-[11px]">
                          {tx.partner || "Internal Movement"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-slate-600 font-black text-xs shadow-sm tabular-nums">
                          {tx.qty}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right pr-8">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-slate-700 tabular-nums uppercase">
                            {tx.date}
                          </span>
                          <span className="text-[9px] font-black text-blue-500 mt-0.5 opacity-80 uppercase tracking-widest">
                            {new Date(tx.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                        <ClipboardList className="w-20 h-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                          No matching activities
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 px-4 rounded-xl border border-slate-200 bg-white/50 text-slate-400 label-bold uppercase tracking-widest text-[11px] flex items-center shadow-sm">
                Records Found:{" "}
                <span className="text-blue-600 ml-2 font-black tabular-nums">
                  {filteredData.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
                Page {page} of {totalPages || 1}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-2xl border-2 border-slate-200 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95 hover:bg-white hover:border-blue-500 hover:text-blue-600 shadow-sm"
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-12 rounded-2xl border-2 border-slate-200 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95 hover:bg-white hover:border-blue-500 hover:text-blue-600 shadow-sm"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;

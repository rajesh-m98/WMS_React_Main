import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
  Truck,
  Clock,
  Warehouse,
  TrendingUp,
  Package,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchDispatchHistory } from "@/app/manager/dispatchManager";

const FlowthroughDispatchPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: dispatchData, loading } = useAppSelector(
    (state) => state.dispatch,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(handleFetchDispatchHistory({ page: 1, size: 100 }));
  }, [dispatch]);

  // FILTER: Grpo Doc Entry must NOT be null and status must NOT be null for Flowthrough
  const flowthroughData = dispatchData.filter(
    (row: any) =>
      row.grpo_doc_entry !== null &&
      row.status !== null &&
      row.status !== undefined &&
      String(row.status).toLowerCase() !== "null",
  );

  const dateFilteredData = useMemo(() => {
    return flowthroughData.filter((row: any) => {
      if (!row.created_at) return true;
      const rowDate = new Date(row.created_at);
      rowDate.setHours(0, 0, 0, 0);

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        if (rowDate < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(0, 0, 0, 0);
        if (rowDate > to) return false;
      }
      return true;
    });
  }, [flowthroughData, fromDate, toDate]);

  // GROUP BY WAREHOUSE: List warehouses and their dispatch summaries
  const groupedWarehouses = useMemo(() => {
    // 1. Deduplicate identical dispatch lines returned by the backend
    const uniqueMap = new Map();
    dateFilteredData.forEach((row: any) => {
      // Use composite key including whscode to ensure we don't drop items going to different warehouses
      const uniqueKey = `${row.whscode}_${row.item_code}_${row.grpo_doc_entry}_${row.qty}`;
      if (!uniqueMap.has(uniqueKey)) {
        uniqueMap.set(uniqueKey, row);
      }
    });

    // 2. Group the unique items by warehouse
    const whsMap = new Map();
    uniqueMap.forEach((row: any) => {
      const key = row.whscode || "UNKNOWN";
      if (!whsMap.has(key)) {
        whsMap.set(key, {
          whscode: key,
          whsname:
            row.whsname != null ? row.whsname : "Mylapore - Sannadhi Street",
          total_items: new Set(), // To track unique item codes
          total_qty: 0,
          grpo_count: new Set(), // To track unique GRPOs
          last_updated: row.created_at,
        });
      }
      const existing = whsMap.get(key);
      existing.total_qty += Number(row.qty || 1);
      existing.total_items.add(row.item_code);
      if (row.grpo_doc_entry) {
        existing.grpo_count.add(row.grpo_doc_entry);
      }
      if (new Date(row.created_at) > new Date(existing.last_updated)) {
        existing.last_updated = row.created_at;
      }
    });
    return Array.from(whsMap.values());
  }, [flowthroughData]);

  const filteredData = groupedWarehouses.filter((whs: any) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      whs.whscode.toLowerCase().includes(searchStr) ||
      whs.whsname.toLowerCase().includes(searchStr)
    );
  });

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="shrink-0 flex items-center justify-between px-8 py-6 bg-white border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[32px] mb-2 w-full">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-blue-50">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Flowthrough <span className="text-blue-600">Dispatch</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Warehouse-Centric Dispatch Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Search by Warehouse Name ..."
              className="pl-12 h-12 w-80 rounded-xl border-1 border-slate-200 shadow-lg shadow-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-sm font-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-12 px-6 rounded-2xl border-1 font-black text-[10px] uppercase tracking-widest flex gap-2 active:scale-95 transition-all ${
                  fromDate || toDate
                    ? "bg-blue-50 border-blue-300 text-blue-600 shadow-lg shadow-blue-100"
                    : "bg-slate-50 border-slate-300 text-slate-600 shadow-lg shadow-slate-300 hover:bg-slate-50"
                }`}
              >
                <Calendar className="w-4 h-4" />
                {fromDate || toDate ? "Filtered" : "Filter Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-5 rounded-3xl border border-slate-100 bg-white shadow-xl flex flex-col gap-4"
              align="end"
            >
              <div className="flex flex-col gap-1.5">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Filter by Date
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Narrow down by creation date
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    From Date
                  </span>
                  <Input
                    type="date"
                    className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-black text-slate-700 font-mono"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    To Date
                  </span>
                  <Input
                    type="date"
                    className="h-10 rounded-xl bg-slate-50 border-slate-200 text-xs font-black text-slate-700 font-mono"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              {(fromDate || toDate) && (
                <Button
                  variant="ghost"
                  className="h-9 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:text-rose-600 active:scale-95 transition-all mt-1"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="h-12 px-6 rounded-2xl bg-slate-50 hover:bg-slate-50 border-1 border-slate-300 shadow-lg shadow-slate-300 font-black text-[10px] uppercase tracking-widest text-slate-600 flex gap-2 active:scale-95 transition-all"
            onClick={() =>
              dispatch(handleFetchDispatchHistory({ page: 1, size: 100 }))
            }
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Card className="border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100 hover:scrollbar-thumb-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    SL
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Warehouse Name
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Warehouse Code
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Unique Items
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Total Qty
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    GRPOs
                  </th>
                  <th className="px-8 py-5 text-right pr-12 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-14 w-14 text-blue-600 animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                          Syncing Dispatch Records...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <Warehouse className="h-24 w-24 text-slate-300" />
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                          No Warehouse Data
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((whs, idx) => (
                    <tr
                      key={whs.whscode}
                      className="hover:bg-blue-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/transactions/ft-dispatch/warehouse/${whs.whscode}`,
                        )
                      }
                    >
                      <td className="px-8 py-5 font-black text-slate-400 font-mono text-xs">
                        {(page - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-900 tracking-tight uppercase">
                          {whs.whsname != ""
                            ? whs.whsname
                            : "Mylapore - Sannadhi Street"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <Badge className="bg-blue-600 text-white border-0 font-black text-sm px-3 py-1 rounded-lg shadow-lg shadow-blue-100">
                          {whs.whscode}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Package className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-sm font-black text-slate-700">
                            {whs.total_items.size}{" "}
                            {whs.total_items.size === 1 ? "Item" : "Items"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl shadow-sm shadow-emerald-100/50">
                          {whs.total_qty}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-sm font-black text-slate-600">
                            {whs.grpo_count.size}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right pr-12">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-200 text-slate-700 shadow-lg shadow-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/transactions/ft-dispatch/warehouse/${whs.whscode}`,
                            );
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PAGINATION SECTION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-10 py-6 bg-white rounded-[32px] shadow-xl shadow-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Showing page <span className="text-blue-600">{page}</span> of{" "}
              <span className="text-blue-600">{totalPages}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-12 px-8 rounded-2xl border-0 bg-slate-50 hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-12 px-8 rounded-2xl border-0 bg-slate-50 hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowthroughDispatchPage;

import { handleFetchGins } from "@/app/manager/ginManager";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import { setFromDate, setToDate } from "@/app/store/ginSlice";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Search,
  X,
  Calendar,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface GinListPageProps {
  type: "putaway" | "flow-through" | "all";
}

const PAGE_SIZE = 10;

const GinListPage = ({ type }: GinListPageProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    items: allItems,
    flowThroughItems,
    putawayItems,
    loading,
    fromDate,
    toDate,
  } = useAppSelector((state) => state.gin);
  const items =
    type === "all"
      ? allItems
      : type === "putaway"
        ? putawayItems
        : flowThroughItems;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const ginType = type === "putaway" ? 2 : 1;

  useEffect(() => {
    if (type === "all") {
      dispatch(
        handleFetchGins({
          page: 1,
          size: 100,
          is_paginate: true,
        }),
      );
    } else {
      dispatch(
        handleFetchGins({
          gin_type: ginType,
          page: 1,
          size: 100,
          is_paginate: true,
        }),
      );
    }
  }, [dispatch, ginType, type]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-0 hover:bg-emerald-500 hover:text-white transition-all cursor-default font-black uppercase tracking-widest text-[9px] px-3 py-1">
            Dispatched
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-0 hover:bg-amber-500 hover:text-white transition-all cursor-default font-black uppercase tracking-widest text-[9px] px-3 py-1">
            Pending
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-rose-50 text-rose-700 border-0 hover:bg-rose-600 hover:text-white transition-all cursor-default font-black uppercase tracking-widest text-[9px] px-3 py-1">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="font-black uppercase tracking-widest text-[9px]"
          >
            Unknown
          </Badge>
        );
    }
  };

  // Group items by GRPO Doc Entry to show unique GRPOs
  const uniqueGPs = useMemo(() => {
    const gpMap = new Map();
    items.forEach((item: any) => {
      const header = item.header || {};
      const grpoDocEntry = header.grpo_docentry || "N/A";
      const poId = header.id || item.header_id;

      if (!gpMap.has(grpoDocEntry)) {
        gpMap.set(grpoDocEntry, {
          grpo_docentry: grpoDocEntry,
          gate_pass_number: header.gate_pass_number || "N/A",
          card_name: header.card_name || "Unknown",
          card_code: header.card_code || "N/A",
          status: header.status,
          id: header.id || item.id,
          created_at: header.created_at || item.created_at,
          po_ids: new Set(poId ? [poId] : []),
          line_items: [item],
        });
      } else {
        const gp = gpMap.get(grpoDocEntry);
        if (poId) gp.po_ids.add(poId);
        gp.line_items.push(item);
      }
    });

    return Array.from(gpMap.values()).map((gp: any) => {
      const putaway = gp.line_items.filter(
        (l: any) =>
          Number(l.line_type) !== 1 && Number(l.header?.gin_type) !== 1,
      ).length;
      const flowThrough = gp.line_items.filter(
        (l: any) =>
          Number(l.line_type) === 1 || Number(l.header?.gin_type) === 1,
      ).length;

      return {
        ...gp,
        po_count: gp.po_ids.size,
        total_lines: gp.line_items.length,
        type_counts: { putaway, flowThrough },
      };
    }).sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [items]);

  const filteredGPs = uniqueGPs.filter((gp: any) => {
    const searchMatch =
      gp.grpo_docentry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.card_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.card_code.toLowerCase().includes(searchTerm.toLowerCase());

    let dateMatch = true;
    if ((fromDate || toDate) && gp.created_at) {
      const rowDate = new Date(gp.created_at).toISOString().split("T")[0];
      if (fromDate && toDate) {
        dateMatch = rowDate >= fromDate && rowDate <= toDate;
      } else if (fromDate) {
        dateMatch = rowDate >= fromDate;
      } else if (toDate) {
        dateMatch = rowDate <= toDate;
      }
    }

    return searchMatch && dateMatch;
  });

  const paginatedGPs = filteredGPs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="border border-slate-100 p-4 shadow-[0_0_25px_rgba(0,0,0,0.06),0_10px_20px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-5 border-b border-slate-100/50">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full xl:w-3/4 shrink-0">
              <div className="relative w-full lg:w-1/3">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
                <Input
                  placeholder="Search by GP or Vendor..."
                  className="pl-12 h-12 rounded-xl bg-slate-50/50 border-1 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full shadow-lg shadow-slate-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full lg:w-2/3">
                <div className="relative w-1/2">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      dispatch(setFromDate(e.target.value));
                      setPage(1);
                    }}
                    className="pl-10 pr-4 h-12 rounded-xl bg-slate-50/50 border-1 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-xs font-bold shadow-lg shadow-slate-200 w-full"
                  />
                  <span className="absolute -top-2.5 left-4 px-1 bg-white text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    From
                  </span>
                </div>
                <div className="relative w-1/2">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      dispatch(setToDate(e.target.value));
                      setPage(1);
                    }}
                    className="pl-10 pr-10 h-12 rounded-xl bg-slate-50/50 border-1 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-xs font-bold shadow-lg shadow-slate-200 w-full"
                  />
                  <span className="absolute -top-2.5 left-4 px-1 bg-white text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    To
                  </span>
                  {(fromDate || toDate) && (
                    <button
                      onClick={() => {
                        dispatch(setFromDate(""));
                        dispatch(setToDate(""));
                        setPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end w-full lg:w-auto">
              <Button
                variant="outline"
                className="rounded-2xl hover:bg-indigo-50 transition-all font-black gap-3 h-12 px-8 bg-white shadow-lg shadow-indigo-100 active:scale-95 text-indigo-600 uppercase tracking-widest text-xs border-1 border-indigo-100"
                onClick={() =>
                  dispatch(
                    handleFetchGins({
                      gin_type: type === "all" ? undefined : ginType,
                      is_paginate: true,
                      forceRefresh: true,
                    }),
                  )
                }
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  SL NO
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  GRN No
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Vendor Name
                </th>
                <th className="px-6 py-6 text-center text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Items Count
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                      <p className="label-bold !text-slate-400">
                        Loading GIN...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedGPs.length > 0 ? (
                paginatedGPs.map((gp, idx) => (
                  <tr
                    key={gp.grpo_docentry}
                    className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() =>
                      navigate(
                        `/transactions/gin/view/grpo/${gp.grpo_docentry}`,
                      )
                    }
                  >
                    <td className="px-6 py-6 font-black text-black whitespace-nowrap">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-black text-slate-800 text-sm tracking-tight uppercase">
                        GRN: {gp.grpo_docentry}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">
                          {gp.card_name}
                        </span>
                        {gp.card_code && gp.card_code !== "N/A" && (
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                            {gp.card_code}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {gp.total_lines > 0 ? (
                          <Badge className="bg-blue-100 text-blue-700 border-0 hover:bg-blue-200 text-[10px] shadow-sm shadow-blue-100/50 px-3 py-1">
                            {gp.total_lines}{" "}
                            {gp.total_lines === 1 ? "ITEM" : "ITEMS"}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">
                            No lines
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-indigo-500">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[11px] font-black uppercase tracking-tight">
                          {gp.created_at
                            ? new Date(gp.created_at)
                                .toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                                .toUpperCase()
                            : "---"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <Button
                        size="sm"
                        className="h-9 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/transactions/gin/view/grpo/${gp.grpo_docentry}`,
                          );
                        }}
                      >
                        View PO's
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                      <ClipboardCheck className="w-16 h-16 text-slate-400" />
                      <p className="text-lg font-black text-slate-400 uppercase tracking-widest">
                        No Gate Passes Found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-indigo-50/50 flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-50/10">
            <div className="flex items-center gap-3">
              <Badge className="h-10 px-6 rounded-2xl border-blue-200 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                TOTAL GATE PASSES: {filteredGPs.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-10 px-5 rounded-2xl border-indigo-100 bg-white hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest gap-2 transition-all active:scale-95 disabled:opacity-30 text-indigo-600"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {[...Array(Math.ceil(filteredGPs.length / PAGE_SIZE))]
                  .slice(0, 5)
                  .map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "ghost"}
                      size="icon"
                      className={`w-10 h-10 rounded-2xl font-black text-xs ${page === i + 1 ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-indigo-900/40 hover:bg-white hover:text-indigo-600 hover:shadow-sm"}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page * PAGE_SIZE >= filteredGPs.length}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 px-5 rounded-2xl border-indigo-100 bg-white hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest gap-2 transition-all active:scale-95 disabled:opacity-30 text-indigo-600"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GinListPage;

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
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface GinListPageProps {
  type: "putaway" | "flow-through";
}

const PAGE_SIZE = 10;

const GinListPage = ({ type }: GinListPageProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { flowThroughItems, putawayItems, loading } = useAppSelector(
    (state) => state.gin,
  );
  const items = type === "putaway" ? putawayItems : flowThroughItems;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const ginType = type === "putaway" ? 2 : 1;

  useEffect(() => {
    dispatch(
      handleFetchGins({
        gin_type: ginType,
        page: 1,
        size: 100,
        is_paginate: true,
      }),
    );
  }, [dispatch, ginType]);

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

  // Group items by Gate Pass Number to show unique gate passes
  const uniqueGPs = useMemo(() => {
    const gpMap = new Map();
    items.forEach((item: any) => {
      const header = item.header || {};
      const gpNumber = header.gate_pass_number || "N/A";
      if (!gpMap.has(gpNumber)) {
        gpMap.set(gpNumber, {
          gate_pass_number: gpNumber,
          card_name: header.card_name || "Unknown",
          card_code: header.card_code || "N/A",
          status: header.status,
          id: header.id || item.id,
        });
      }
    });
    return Array.from(gpMap.values());
  }, [items]);

  const filteredGPs = uniqueGPs.filter(
    (gp: any) =>
      gp.gate_pass_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.card_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.card_code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedGPs = filteredGPs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="border border-slate-100 p-4 shadow-[0_0_25px_rgba(0,0,0,0.06),0_10px_20px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-5 border-b border-slate-100/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-2/5 shrink-0">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
              <Input
                placeholder="Search by Gate Pass or Vendor..."
                className="pl-12 h-12 rounded-xl bg-slate-50/50 border-1 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full shadow-lg shadow-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 justify-end w-full lg:w-auto">
              <Button
                variant="outline"
                className="rounded-2xl hover:bg-indigo-50 transition-all font-black gap-3 h-12 px-8 bg-white shadow-lg shadow-indigo-100 active:scale-95 text-indigo-600 uppercase tracking-widest text-xs border-1 border-indigo-100"
                onClick={() =>
                  dispatch(
                    handleFetchGins({
                      gin_type: ginType,
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
                  Gate Pass No
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Supplier / Vendor
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Vendor Code
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
                        Loading Gate Passes...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedGPs.length > 0 ? (
                paginatedGPs.map((gp, idx) => (
                  <tr
                    key={gp.gate_pass_number}
                    className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() =>
                      navigate(
                        `/transactions/gin/${type}/headers/${gp.gate_pass_number}`,
                      )
                    }
                  >
                    <td className="px-6 py-6 font-black text-black whitespace-nowrap">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-black text-slate-800 text-sm tracking-tight uppercase">
                        GATE PASS: {gp.gate_pass_number}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-slate-700">
                      {gp.card_name}
                    </td>
                    <td className="px-6 py-6">
                      <Badge
                        variant="outline"
                        className="font-black text-indigo-600 bg-indigo-50/30 border-0 shadow-sm shadow-indigo-100/50"
                      >
                        {gp.card_code}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <Button
                        size="sm"
                        className="h-9 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/transactions/gin/${type}/headers/${gp.gate_pass_number}`,
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

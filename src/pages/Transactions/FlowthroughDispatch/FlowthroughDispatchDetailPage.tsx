import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Package,
  Calendar,
  Warehouse,
  Clock,
  TrendingUp,
  Tag,
  Box,
} from "lucide-react";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchDispatchHistory } from "@/app/manager/dispatchManager";

const FlowthroughDispatchDetailPage = () => {
  const { whsCode } = useParams<{ whsCode: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: dispatchData, loading } = useAppSelector(
    (state) => state.dispatch,
  );

  useEffect(() => {
    if (dispatchData.length === 0) {
      dispatch(handleFetchDispatchHistory({ page: 1, size: 100 }));
    }
  }, [dispatch, dispatchData.length]);

  const warehouseDetails = useMemo(() => {
    const filtered = dispatchData.filter(
      (item) => item.whscode === whsCode && item.grpo_doc_entry !== null,
    );

    // Deduplicate identical items to fix inflated counts
    const uniqueMap = new Map();
    filtered.forEach((item) => {
      const key = `${item.item_code}_${item.grpo_doc_entry}_${item.qty}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    return Array.from(uniqueMap.values());
  }, [dispatchData, whsCode]);

  const whsName = warehouseDetails[0]?.whsname || "Mylapore - Sannadhi Street";

  const totalQty = warehouseDetails.reduce(
    (sum, item) => sum + Number(item.qty || 1),
    0,
  );
  const uniqueItemCount = new Set(warehouseDetails.map((i) => i.item_code))
    .size;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: number | null) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-0 font-black uppercase text-sm px-3 py-1 rounded-lg cursor-pointer hover:bg-emerald-600 hover:text-white transition-all">
            DISPATCHED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-50 text-blue-600 border-0 font-black uppercase text-sm px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
            PENDING
          </Badge>
        );
    }
  };

  if (loading && warehouseDetails.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400">
          Loading Warehouse Breakdown...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[32px] w-full">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-slate-200 text-slate-700 shadow-lg shadow-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {whsName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Warehouse className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Storage Location Detail
                </span>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white border-0 font-black text-sm px-3 py-1 rounded-lg shadow-lg shadow-blue-100">
              {whsCode}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Items Count
            </span>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {uniqueItemCount}
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Qty
            </span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {totalQty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BREAKDOWN TABLE */}
      <Card className="border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    SL
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Name
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Code
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    GRPO No
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Quantity
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Dispatch Date
                  </th>
                  <th className="px-8 py-5 text-right pr-12 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {warehouseDetails.map((detail, idx) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-blue-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group"
                  >
                    <td className="px-8 py-5 font-black text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Package className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase">
                          {detail.item_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200 font-black text-sm px-3 py-1 rounded-lg"
                      >
                        {detail.item_code}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-100 font-black text-sm px-3 py-1 rounded-lg"
                      >
                        {detail.grpo_doc_entry}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl">
                        {detail.qty || 1}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-black text-slate-600 uppercase">
                          {formatDate(detail.created_at)}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-slate-400 font-bold">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(detail.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right pr-12">
                      {getStatusBadge(detail.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowthroughDispatchDetailPage;

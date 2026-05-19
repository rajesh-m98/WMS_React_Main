import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Package,
  Calendar,
  Clock,
  TrendingUp,
  Tag,
  Warehouse,
  ArrowRightLeft,
  ClipboardList,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchOnwardPicklist } from "@/app/manager/requestManager";

const OnwardPicklistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.request.onward);

  useEffect(() => {
    if (data.length === 0) {
      dispatch(handleFetchOnwardPicklist());
    }
  }, [dispatch, data.length]);

  const headerInfo = useMemo(() => {
    return data.find((item) => item.id.toString() === id);
  }, [data, id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && !headerInfo) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="label-bold !text-slate-400 uppercase tracking-widest">Syncing Picklist Detail...</p>
      </div>
    );
  }

  if (!headerInfo) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[32px] w-full">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-slate-200 text-slate-700 shadow-lg shadow-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                #{headerInfo.docnum}
              </h1>
              <Badge className="bg-indigo-600 text-white border-0 font-black text-sm px-3 py-1 rounded-lg shadow-lg shadow-indigo-100">
                {headerInfo.doctype}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1.5">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(headerInfo.docdate)}</span>
               </div>
               <div className="w-1 h-1 rounded-full bg-slate-300" />
               <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry: {headerInfo.docentry}</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Pick Items
            </span>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {headerInfo.db_line?.length || 0}
              </span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Quantity
            </span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {headerInfo.db_line?.reduce((sum: number, line: any) => sum + (line.quantity || 0), 0) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
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
                    Item Description
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Code
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Whs Code
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Pick Qty
                  </th>
                  <th className="px-8 py-5 text-right pr-12 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {headerInfo.db_line?.map((line: any, idx: number) => (
                  <tr
                    key={line.id}
                    className="hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group"
                  >
                    <td className="px-8 py-5 font-black text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Package className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase">
                          {line.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200 font-black text-sm px-3 py-1 rounded-lg"
                      >
                        {line.itemcode}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Warehouse className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-sm font-black text-slate-700 uppercase">
                          {line.whscode || "---"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center">
                         <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl shadow-sm shadow-emerald-100/50">
                           {line.quantity || 0}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right pr-12">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-slate-600 uppercase">
                           {formatDate(line.created_at)}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(line.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
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

export default OnwardPicklistDetailPage;

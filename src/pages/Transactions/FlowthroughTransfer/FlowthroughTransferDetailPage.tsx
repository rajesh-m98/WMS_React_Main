import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Package,
  Calendar,
  Warehouse,
  ClipboardCheck,
  Tag,
  Clock,
  History,
  TrendingUp,
  Box,
  Layers,
  MapPin,
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
  Badge,
} from "@/components/ui";
import { useAppSelector } from "@/app/store";

const FlowthroughTransferDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: outwardData, loading } = useAppSelector(
    (state) => state.request.outward,
  );

  const headerData = useMemo(() => {
    return outwardData.find((h) => String(h.id) === String(id));
  }, [outwardData, id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && !headerData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400 font-black uppercase tracking-widest">
          Loading Line Items...
        </p>
      </div>
    );
  }

  if (!headerData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-slate-300" />
        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
          Header Not Found
        </p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="rounded-2xl px-8 h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest"
        >
          Back to Headers
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-8 py-6 bg-white shadow-md shadow-slate-200 rounded-[32px] w-full border border-slate-50">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-slate-200 text-slate-700 shadow-lg shadow-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Stock Transfer <span className="text-indigo-600">Details</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Status
            </span>
            <Badge className="bg-emerald-50 text-emerald-600 border-0 font-black uppercase text-[10px] px-4 py-1 rounded-lg">
              Flowthrough
            </Badge>
          </div>
          <div className="h-10 w-px bg-slate-100" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Line Count
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {headerData.lines?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
      <Card className="border-1 shadow-lg shadow-slate-400 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100 hover:scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    SL No
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Description
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Code
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Warehouse
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {(headerData.lines || []).map((line: any, idx: number) => (
                  <tr
                    key={line.id}
                    className="hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group"
                  >
                    <td className="px-8 py-5 font-black text-slate-400 font-mono text-sm">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                          {line.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Box className="w-3 h-3 text-slate-300" />
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                            Line Reference: {line.lineid}
                          </span>
                        </div>
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
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 uppercase leading-none mb-1">
                            {line.whsname || "----"}
                          </span>
                          <span className="text-sm font-bold text-slate-400 uppercase tracking-tight">
                            Code: {line.whscode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl shadow-sm shadow-emerald-100/50">
                        {line.quantity || 0}
                      </span>
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

export default FlowthroughTransferDetailPage;

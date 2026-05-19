import { useMemo, useState } from "react";
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
  Box,
  Layers,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Card, CardContent, Button, Badge, Checkbox } from "@/components/ui";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/app/store";
import { handleGenerateManualPicklist } from "@/app/manager/requestManager";
import { toast } from "sonner";

const PicklistGenerationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: onwardData, loading } = useAppSelector(
    (state) => state.request.onward,
  );
  const [selectedLines, setSelectedLines] = useState<number[]>([]);

  const headerData = useMemo(() => {
    return onwardData.find((h) => String(h.id) === String(id));
  }, [onwardData, id]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleToggleLine = (lineId: number) => {
    setSelectedLines((prev) =>
      prev.includes(lineId)
        ? prev.filter((id) => id !== lineId)
        : [...prev, lineId],
    );
  };

  const handleSelectAll = () => {
    if (selectedLines.length === (headerData?.db_line?.length || 0)) {
      setSelectedLines([]);
    } else {
      setSelectedLines((headerData?.db_line || []).map((l: any) => l.id));
    }
  };

  const handleGeneratePicklist = async () => {
    if (!headerData || selectedLines.length === 0) return;

    // Map selected IDs to item codes
    const selectedItemCodes = headerData.db_line
      .filter((l: any) => selectedLines.includes(l.id))
      .map((l: any) => l.itemcode);

    const payload = {
      doc_entry: String(headerData.docentry),
      item_code: selectedItemCodes,
    };

    const success = await dispatch(handleGenerateManualPicklist(payload));
    if (success) {
      toast.success("Manual picklist generated successfully");
      navigate("/transactions/picklist/manual-result");
    }
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
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Picklist <span className="text-blue-600">Items</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="h-12 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 font-black text-[10px] uppercase tracking-widest flex gap-2 active:scale-95 transition-all disabled:opacity-50"
            onClick={handleGeneratePicklist}
            disabled={selectedLines.length === 0}
          >
            <Plus className="w-4 h-4" />
            Generate Picklist ({selectedLines.length})
          </Button>
          <div className="h-10 w-px bg-slate-100 mx-2" />
          <div className="flex flex-col items-end mr-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Line Count
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {headerData.lines?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE */}
      <Card className="border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100 hover:scrollbar-thumb-slate-200">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-8 py-5 text-left w-20">
                    <Checkbox
                      checked={
                        selectedLines.length ===
                          (headerData.lines?.length || 0) &&
                        (headerData.lines?.length || 0) > 0
                      }
                      onCheckedChange={handleSelectAll}
                      className="rounded-lg border-2 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </th>
                  <th className="px-4 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    SL No
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Name
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Item Code
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap text-center">
                    Warehouse Name
                  </th>
                  {/* <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Line ID
                  </th> */}
                  {/* <th className="px-8 py-5 text-right pr-12 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Timestamp</th> */}
                </tr>
              </thead>
              <tbody className="bg-white">
                {(headerData.db_line || []).map((line: any, idx: number) => (
                  <tr
                    key={line.id}
                    className={`transition-all duration-300 border-b border-slate-100 last:border-0 group ${selectedLines.includes(line.id) ? "bg-blue-50/40" : "hover:bg-slate-50/50"}`}
                  >
                    <td className="px-8 py-5">
                      <Checkbox
                        checked={selectedLines.includes(line.id)}
                        onCheckedChange={() => handleToggleLine(line.id)}
                        className="rounded-lg border-2 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </td>
                    <td className="px-4 py-5 font-black text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                          {line.name}
                        </span>
                        {/* <div className="flex items-center gap-2">
                          <Box className="w-3 h-3 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Ref ID: {line.lineid}
                          </span>
                        </div> */}
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
                    <td className="px-6 py-5 text-center font-black text-slate-600 tabular-nums">
                      {line.whsname || "---"}
                    </td>
                    {/* <td className="px-6 py-5 text-center font-black text-slate-400 tabular-nums">
                      {line.lineid}
                    </td> */}
                    {/* <td className="px-8 py-5 text-right pr-12">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-slate-600 uppercase">
                          {new Date(line.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {new Date(line.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td> */}
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

export default PicklistGenerationDetailPage;

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleSelectGin } from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
} from "@/components/ui";
import {
  ChevronLeft,
  Package,
  Calendar,
  User,
  Hash,
  ArrowRight,
  ClipboardCheck,
  RefreshCw,
  Loader2,
  Tag,
  FileText,
} from "lucide-react";

const GinDetail = () => {
  const { headerId, lineId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentHeader, currentLines, loading } = useAppSelector(
    (state) => state.gin,
  );

  useEffect(() => {
    if (headerId && lineId) {
      // Use the smart selector to get data from slice or fetch if missing
      dispatch(handleSelectGin(Number(headerId), Number(lineId)));
    }
  }, [dispatch, headerId, lineId]);

  const line = currentLines[0];

  if (loading && !currentHeader) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400 uppercase tracking-widest">
          Loading Transaction Details...
        </p>
      </div>
    );
  }

  if (!currentHeader && !loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center">
          <Package className="w-10 h-10 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="heading-section !text-2xl text-slate-900 uppercase">
            Transaction Not Found
          </h2>
          <p className="body-main !text-slate-400 mt-2 uppercase tracking-widest text-sm">
            We couldn't retrieve details for ID #{lineId}
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl px-8 h-12 border-slate-200 font-bold"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 overflow-hidden bg-[#f8fafc]/50 p-4">
      {/* Page Header */}
      <div className="shrink-0 flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white h-10 w-10 transition-all border border-slate-200 bg-white shadow-md hover:shadow-lg active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">
              Transaction View
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                variant="outline"
                className="bg-blue-600 text-white border-0 font-bold uppercase tracking-widest text-[8px] px-2 py-0.5 shadow-sm shadow-blue-100"
              >
                Line #{lineId}
              </Badge>
              <Badge
                variant="outline"
                className="bg-slate-800 text-white border-0 font-bold uppercase tracking-widest text-[8px] px-2 py-0.5 shadow-sm"
              >
                Header #{headerId}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 items-start">
        {/* LEFT CARD: HEADER INFO */}
        <Card className="border-0 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[40px] overflow-hidden bg-white flex flex-col">
          <CardHeader className="bg-white p-6 pb-2 shrink-0 border-b border-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-100">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Header Info
              </CardTitle>
            </div>
          </CardHeader>
          <Separator className="bg-slate-400" />
          <CardContent className="p-7 space-y-6 flex-col">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Vendor / Card Name
                </p>
                <h4 className="text-xl font-black text-slate-900 leading-tight">
                  {currentHeader?.card_name}
                </h4>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 font-bold uppercase tracking-widest text-[9px] px-2 py-0 border-0"
                >
                  {currentHeader?.card_code}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-2">
              <div className="bg-slate-50/50 p-3 rounded-[32px] border border-slate-300 flex flex-col justify-center items-center shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  Gate Pass
                </p>
                <p className="text-lg font-black text-slate-800">
                  {currentHeader?.gate_pass_number || "1"}
                </p>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-[32px] border border-slate-300 flex flex-col justify-center items-center shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Doc Entry
                </p>
                <p className="text-lg font-black text-slate-800">
                  {currentHeader?.grpo_docentry || "49"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-3xl border border-slate-50/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Sync Date
                  </span>
                </div>
                <span className="text-xs font-black text-slate-700">
                  {currentHeader?.sync_date
                    ? new Date(currentHeader.sync_date).toLocaleString()
                    : "5/7/2026, 1:40:53 PM"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50/30 p-4 rounded-3xl border border-emerald-100/50">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                    Sync Status
                  </span>
                </div>
                <Badge className="bg-emerald-500 text-white border-0 font-black uppercase tracking-widest text-[9px] px-4 py-1 rounded-full shadow-lg shadow-emerald-100">
                  SUCCESS
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT CARD: LINE DETAILS */}
        <Card className="border-0 shadow-[0_20px_50px_rgba(59,130,246,0.12)] rounded-[40px] overflow-hidden bg-white flex flex-col">
          <CardHeader className="bg-blue-600 p-7 shrink-0">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">
                Line Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-7 space-y-7 flex-col overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {line?.item_desc || "Acrylic Stand"}
                </h3>
                <p className="text-blue-600 font-black text-sm tracking-[0.2em]">
                  {line?.item_code || "100001"}
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase tracking-[0.1em] text-[10px] px-4 py-1.5 rounded-full shadow-sm mt-1">
                COMPLETED
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="bg-slate-50/50 p-5 rounded-[32px] border border-slate-300 flex flex-col justify-center items-center shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">
                  Quantity Summary
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-blue-600">
                    {line?.received_qty || "150"}
                  </span>
                  <span className="text-2xl font-black text-slate-800">
                    / {line?.open_qty || "150"}
                  </span>
                </div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">
                  Received of Total
                </p>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-[32px] border border-slate-300 flex flex-col justify-center items-center shadow-sm">
                <p className="text-[10px] text-blue-500/60 font-black uppercase tracking-widest mb-2">
                  MRP Info
                </p>
                <span className="text-4xl font-black text-slate-900">
                  ₹{line?.mrp || "200"}
                </span>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">
                  Maximum Retail Price
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 px-2">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Doc Number
                </p>
                <p className="text-lg font-black text-slate-800">
                  {line?.doc_number || "7"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Line Number
                </p>
                <p className="text-lg font-black text-slate-800">
                  {line?.line_no || "1"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GinDetail;

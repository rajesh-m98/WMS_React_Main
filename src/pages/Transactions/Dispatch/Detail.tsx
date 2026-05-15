import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Loader2, 
  Package, 
  MapPin, 
  Calendar, 
  User, 
  Box, 
  Hash, 
  Tag,
  Barcode,
  Layers,
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchDispatchDetail } from "@/app/manager/dispatchManager";

export const DispatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentDetail: detail, loading } = useAppSelector((state) => state.dispatch);

  useEffect(() => {
    if (id) {
      dispatch(handleFetchDispatchDetail(Number(id)));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400">Fetching Dispatch Details...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Box className="h-16 w-16 text-slate-200" />
        <p className="label-bold !text-slate-400">Dispatch record not found</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Dispatch <span className="text-blue-600">Details</span>
            </h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              Ref: {detail.box_barcode}
            </p>
          </div>
        </div>
        <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">
           Dispatched
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="md:col-span-2 border-0 shadow-xl rounded-[2.5rem] bg-white overflow-hidden border border-slate-50">
          <CardContent className="p-8 space-y-8">
             <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                   <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Item Information</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{detail.item_code}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoItem icon={Tag} label="Description" value={detail.item_description} />
                <InfoItem icon={Hash} label="Doc Number" value={detail.docnum} />
                <InfoItem icon={Barcode} label="Carton Barcode" value={detail.box_barcode} />
                <InfoItem icon={Layers} label="Batch / Serial" value={detail.batch_number || "N/A"} />
                <InfoItem icon={MapPin} label="Warehouse" value={`${detail.whscode} (ID: ${detail.warehouse_id})`} />
                <InfoItem icon={Calendar} label="Document Date" value={detail.docdate} />
                <InfoItem icon={User} label="Customer / Partner" value={detail.cardname} valueClass="text-blue-600" />
                <InfoItem icon={FileText} label="Doc Entry" value={detail.doc_entry} />
             </div>
          </CardContent>
        </Card>

        {/* Stats / Quick Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Box className="h-32 w-32" />
            </div>
            <CardContent className="p-8 relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Quantity Analysis</h4>
               <div className="space-y-6">
                  <div>
                    <p className="text-4xl font-black tabular-nums">{detail.quantity}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Total Dispatched</p>
                  </div>
                  <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-xl font-black tabular-nums text-blue-400">{detail.total_quntity || detail.quantity}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
                     </div>
                     <div>
                        <p className="text-xl font-black tabular-nums text-emerald-400">{detail.filled_quntity || 0}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Filled</p>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-[2.5rem] bg-blue-50/50 overflow-hidden border border-blue-100/50">
             <CardContent className="p-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Location Context</h4>
                <div className="space-y-3">
                   <LocationBadge label="L1" value={detail.layer1} />
                   <LocationBadge label="L2" value={detail.layer2} />
                   <LocationBadge label="L3" value={detail.layer3} />
                   <LocationBadge label="L4" value={detail.layer4} />
                   <LocationBadge label="L5" value={detail.layer5} />
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, valueClass = "text-slate-900" }: any) => (
  <div className="space-y-1.5 group">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <p className={`text-sm font-black tracking-tight ${valueClass}`}>{value || "N/A"}</p>
  </div>
);

const LocationBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between bg-white/60 p-2.5 rounded-xl border border-blue-100/50">
     <span className="text-[10px] font-black text-blue-400">{label}</span>
     <span className="text-[11px] font-black text-slate-900 uppercase">{value || "---"}</span>
  </div>
);

export default DispatchDetail;

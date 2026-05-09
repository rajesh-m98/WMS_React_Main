import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { Layers, Barcode, Calendar, Building2 } from "lucide-react";
import BarcodeDisplay from "react-barcode";

interface DetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  floor: any;
}

const DetailPopup: React.FC<DetailPopupProps> = ({ isOpen, onClose, floor }) => {
  if (!floor) return null;

  const DetailRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <span className="caption-small !text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="body-strong !text-slate-900">{value || "-"}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-0 shadow-2xl bg-white">
        <DialogHeader className="p-10 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/20 ring-4 ring-white/10">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight font-display">
                  Floor Detail
                </DialogTitle>
                <Badge variant="secondary" className="mt-1 bg-white/10 text-blue-300 border-0 hover:bg-white/20 transition-colors label-bold uppercase tracking-widest text-[10px]">
                  ID: {floor.id}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow label="Floor Name" value={floor.floor_name} icon={Building2} />
            <DetailRow label="Max Capacity" value={floor.capacity} icon={Building2} />
          </div>

          <div className="p-8 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 flex flex-col items-center gap-6 group hover:bg-blue-50 transition-all duration-500">
            <div className="flex items-center gap-3 self-start">
              <Barcode className="h-5 w-5 text-blue-600" />
              <span className="caption-small !text-blue-600 uppercase tracking-widest font-black">Generated Barcode</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-100 ring-1 ring-blue-50 group-hover:scale-105 transition-transform duration-500">
              <BarcodeDisplay 
                value={floor.barcode} 
                width={2} 
                height={80} 
                fontSize={16}
                font="monospace"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="body-main !text-sm !text-slate-500 italic">
              Last updated on {new Date(floor.updated_at || floor.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailPopup;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchGinLine, handleUpdateGinHeader, handleUpdateGinLine, handleSelectGin } from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
} from "@/components/ui";
import {
  ChevronLeft,
  Save,
  Loader2,
  ClipboardCheck,
  Tag,
  Hash,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const GinEdit = () => {
  const { headerId, lineId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentHeader, currentLines, loading } = useAppSelector((state) => state.gin);

  const [headerForm, setHeaderForm] = useState({
    gate_pass_number: "",
    grpo_docentry: "",
    card_code: "",
    card_name: "",
  });

  const [lineForm, setLineForm] = useState({
    item_code: "",
    item_desc: "",
    received_qty: 0,
    mrp: 0,
  });

  useEffect(() => {
    if (headerId && lineId) {
      // Use the smart selector to get data from slice or fetch if missing
      dispatch(handleSelectGin(Number(headerId), Number(lineId)));
    }
  }, [dispatch, headerId, lineId]);

  useEffect(() => {
    if (currentHeader) {
      console.log("[Edit Page] Mapping Header Data:", currentHeader);
      setHeaderForm({
        gate_pass_number: currentHeader.gate_pass_number || "",
        grpo_docentry: currentHeader.grpo_docentry || "",
        card_code: currentHeader.card_code || "",
        card_name: currentHeader.card_name || "",
      });
    }
    if (currentLines && currentLines[0]) {
      console.log("[Edit Page] Mapping Line Data:", currentLines[0]);
      const line = currentLines[0];
      setLineForm({
        item_code: line.item_code || "",
        item_desc: line.item_desc || "",
        received_qty: line.received_qty || 0,
        mrp: line.mrp || 0,
      });
    }
  }, [currentHeader, currentLines]);

  const handleSaveHeader = async () => {
    if (!currentHeader) return;
    const success = await dispatch(handleUpdateGinHeader(currentHeader.id, {
      ...currentHeader,
      ...headerForm
    }));
    if (success) {
      toast.success("Header updated successfully");
    }
  };

  const handleSaveLine = async () => {
    if (!lineId || !currentLines[0]) return;
    const success = await dispatch(handleUpdateGinLine(Number(lineId), {
      ...currentLines[0],
      ...lineForm
    }));
    if (success) {
      toast.success("Line item updated successfully");
    }
  };

  if (loading && !currentHeader) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold uppercase tracking-widest text-slate-400">Loading Edit Interface...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white border border-slate-200 h-10 w-10 shadow-md hover:shadow-lg active:scale-95 transition-all">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="heading-section !text-2xl uppercase tracking-widest">Unified Transaction Edit</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Editing Line #{lineId} of Header #{headerId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: HEADER EDIT */}
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="bg-slate-50 p-10 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-100">
                <ClipboardCheck className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Edit Header</CardTitle>
            </div>
            <Button onClick={handleSaveHeader} className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-2xl shadow-lg shadow-blue-100 font-bold gap-2">
              <Save className="w-4 h-4" /> Update Header
            </Button>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Vendor Code</Label>
                <Input
                  value={headerForm.card_code}
                  onChange={(e) => setHeaderForm({ ...headerForm, card_code: e.target.value })}
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Vendor Name</Label>
                <Input
                  value={headerForm.card_name}
                  onChange={(e) => setHeaderForm({ ...headerForm, card_name: e.target.value })}
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Gate Pass #</Label>
                <Input
                  value={headerForm.gate_pass_number}
                  onChange={(e) => setHeaderForm({ ...headerForm, gate_pass_number: e.target.value })}
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Doc Entry #</Label>
                <Input
                  value={headerForm.grpo_docentry}
                  onChange={(e) => setHeaderForm({ ...headerForm, grpo_docentry: e.target.value })}
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold focus:bg-white transition-all"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: LINE EDIT */}
        <Card className="border-0 shadow-2xl shadow-blue-100/50 rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="bg-blue-600 p-10 text-white flex flex-row items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Tag className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Edit Line Item</CardTitle>
            </div>
            <Button onClick={handleSaveLine} className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-6 rounded-2xl shadow-lg font-bold gap-2">
              <Save className="w-4 h-4" /> Update Line
            </Button>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Item Description</Label>
                <Input
                  value={lineForm.item_desc}
                  onChange={(e) => setLineForm({ ...lineForm, item_desc: e.target.value })}
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Received Qty</Label>
                  <Input
                    type="number"
                    value={lineForm.received_qty}
                    onChange={(e) => setLineForm({ ...lineForm, received_qty: Number(e.target.value) })}
                    className="h-14 rounded-2xl bg-blue-50/50 border-blue-100 text-blue-700 font-bold focus:bg-white transition-all text-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">MRP Value</Label>
                  <Input
                    type="number"
                    value={lineForm.mrp}
                    onChange={(e) => setLineForm({ ...lineForm, mrp: Number(e.target.value) })}
                    className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-bold focus:bg-white transition-all text-xl"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GinEdit;

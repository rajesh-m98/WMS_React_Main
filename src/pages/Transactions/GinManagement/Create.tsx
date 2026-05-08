import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "@/app/store";
import { handleCreateGinHeader } from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { ArrowLeft, Save, Plus, Trash2, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

const GinCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "putaway";
  
  const [header, setHeader] = useState({
    gate_pass_number: "",
    grpo_docentry: "",
    card_code: "",
    card_name: "",
    gin_type: type === "putaway" ? 2 : 1,
  });

  const [lines, setLines] = useState([
    { item_code: "", item_desc: "", open_qty: 0, mrp: 0, received_qty: 0 }
  ]);

  const addLine = () => {
    setLines([...lines, { item_code: "", item_desc: "", open_qty: 0, mrp: 0, received_qty: 0 }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...header, lines };
    const success = await dispatch(handleCreateGinHeader(payload));
    if (success) {
      navigate(`/transactions/gin/${type}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="heading-section !text-2xl uppercase tracking-widest">Create New GIN</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-widest">Header Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Gate Pass Number</Label>
              <Input
                placeholder="GP-001"
                value={header.gate_pass_number}
                onChange={(e) => setHeader({ ...header, gate_pass_number: e.target.value })}
                className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">GRPO DocEntry</Label>
              <Input
                placeholder="49"
                value={header.grpo_docentry}
                onChange={(e) => setHeader({ ...header, grpo_docentry: e.target.value })}
                className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Card Code</Label>
              <Input
                placeholder="V00001"
                value={header.card_code}
                onChange={(e) => setHeader({ ...header, card_code: e.target.value })}
                className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Vendor Name</Label>
              <Input
                placeholder="Vendor Name"
                value={header.card_name}
                onChange={(e) => setHeader({ ...header, card_name: e.target.value })}
                className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest px-2">Line Items</h2>
            <Button type="button" onClick={addLine} variant="outline" className="rounded-xl border-slate-200 gap-2 font-bold uppercase tracking-widest text-xs h-10 px-4">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>
          
          {lines.map((line, idx) => (
            <Card key={idx} className="border-0 shadow-sm rounded-2xl overflow-hidden relative group">
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Item Code & Desc</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="SKU"
                      value={line.item_code}
                      onChange={(e) => updateLine(idx, "item_code", e.target.value)}
                      className="rounded-lg h-10 bg-slate-50 border-slate-200 font-bold"
                    />
                    <Input
                      placeholder="Description"
                      value={line.item_desc}
                      onChange={(e) => updateLine(idx, "item_desc", e.target.value)}
                      className="rounded-lg h-10 bg-slate-50 border-slate-200 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Open Qty</Label>
                  <Input
                    type="number"
                    value={line.open_qty}
                    onChange={(e) => updateLine(idx, "open_qty", Number(e.target.value))}
                    className="rounded-lg h-10 bg-slate-50 border-slate-200 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">Recv Qty</Label>
                  <Input
                    type="number"
                    value={line.received_qty}
                    onChange={(e) => updateLine(idx, "received_qty", Number(e.target.value))}
                    className="rounded-lg h-10 bg-blue-50 border-blue-100 text-blue-700 font-bold"
                  />
                </div>
                <div className="flex items-end justify-between">
                  <div className="space-y-2 flex-1 mr-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">MRP</Label>
                    <Input
                      type="number"
                      value={line.mrp}
                      onChange={(e) => updateLine(idx, "mrp", Number(e.target.value))}
                      className="rounded-lg h-10 bg-slate-50 border-slate-200 font-bold"
                    />
                  </div>
                  {lines.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(idx)} className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-xl h-12 px-8 font-bold text-slate-400">Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 px-10 font-bold shadow-xl shadow-blue-200 gap-2 uppercase tracking-widest">
            <Save className="h-4 w-4" /> Save Complete GIN
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GinCreate;

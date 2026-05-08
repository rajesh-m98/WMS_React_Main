import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchGins, handleAddGinLine } from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ArrowLeft, Save, ClipboardCheck, Loader2 } from "lucide-react";

const GinCreateLine = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "putaway";
  
  const { items, loading } = useAppSelector((state) => state.gin);
  
  // Extract unique headers from items
  const headers = Array.from(new Set(items.map(item => item.header.id))).map(id => {
    return items.find(item => item.header.id === id)?.header;
  });

  const [selectedHeaderId, setSelectedHeaderId] = useState<string>("");
  const [formData, setFormData] = useState({
    item_code: "",
    item_desc: "",
    open_qty: 0,
    mrp: 0,
    received_qty: 0,
    expiry_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    dispatch(handleFetchGins({ gin_type: type === "putaway" ? 2 : 1, is_paginate: false }));
  }, [dispatch, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHeaderId) return;

    const success = await dispatch(handleAddGinLine(Number(selectedHeaderId), formData));
    if (success) {
      navigate(`/transactions/gin/${type}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="heading-section !text-2xl uppercase tracking-widest">Add Line to Existing GIN</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-widest">Select Transaction</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Transaction / Gate Pass</Label>
              <Select onValueChange={setSelectedHeaderId} value={selectedHeaderId}>
                <SelectTrigger className="h-14 rounded-xl border-slate-200 font-bold bg-slate-50/50">
                  <SelectValue placeholder="Select a transaction header..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                  {headers.map((h) => (
                    <SelectItem key={h?.id} value={h?.id?.toString() || ""} className="font-bold py-3 rounded-xl focus:bg-blue-50">
                      GP: {h?.gate_pass_number} | {h?.card_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Item Code</Label>
                <Input
                  placeholder="SKU-001"
                  value={formData.item_code}
                  onChange={(e) => setFormData({ ...formData, item_code: e.target.value })}
                  className="rounded-xl h-12 bg-slate-50 border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Description</Label>
                <Input
                  placeholder="Item Name"
                  value={formData.item_desc}
                  onChange={(e) => setFormData({ ...formData, item_desc: e.target.value })}
                  className="rounded-xl h-12 bg-slate-50 border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Open Qty</Label>
                <Input
                  type="number"
                  value={formData.open_qty}
                  onChange={(e) => setFormData({ ...formData, open_qty: Number(e.target.value) })}
                  className="rounded-xl h-12 bg-slate-50 border-slate-200 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">Received Qty</Label>
                <Input
                  type="number"
                  value={formData.received_qty}
                  onChange={(e) => setFormData({ ...formData, received_qty: Number(e.target.value) })}
                  className="rounded-xl h-12 bg-blue-50 border-blue-100 text-blue-700 font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">MRP</Label>
                <Input
                  type="number"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                  className="rounded-xl h-12 bg-slate-50 border-slate-200 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-8">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-xl h-12 px-8 font-bold text-slate-400">Cancel</Button>
              <Button type="submit" disabled={!selectedHeaderId} className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 px-10 font-bold shadow-xl shadow-blue-200 gap-2 uppercase tracking-widest">
                <Save className="h-4 w-4" /> Add Line Item
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default GinCreateLine;

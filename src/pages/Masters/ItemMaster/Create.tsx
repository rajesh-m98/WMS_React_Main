import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Input,
  Button,
  Label,
  Separator,
  Badge,
  Dialog,
  DialogContent,
} from "@/components/ui";
import {
  ChevronLeft,
  X,
  Box,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleCreateItem } from "@/app/manager/itemManager";
import { handleFetchBins } from "@/app/manager/binManager";
import config from "./ItemConfig.json";
import { ItemDTO } from "@/core/models/master.model";
import { RadioGroup, RadioGroupItem } from "@/components/ui";

interface Assignment {
  path: string;
  pathIds: number[];
  qty: number;
}

const ItemCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { columns: binHierarchy } = useAppSelector((state) => state.bins);

  const [formData, setFormData] = useState<Partial<ItemDTO>>({
    warehouse_id: 1,
    item_code: "",
    item_description: "",
    batch_number: "",
    active: "Y",
    ean_barcode: "",
    sap_barcode: "",
    open_quantity: 0,
    location: [],
    floor: [],
    device: [],
  });

  const [mappingType, setMappingType] = useState<"single" | "multiple">(
    "single",
  );
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isQtyDialogOpen, setIsQtyDialogOpen] = useState(false);
  const [pendingMapping, setPendingMapping] = useState<{
    pathIds: number[];
    fullPath: string;
  } | null>(null);
  const [allocQty, setAllocQty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(handleFetchBins({ warehouseid: 1 }));
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!formData.item_code || !formData.item_description) {
      toast.error("Code and Description are required");
      return;
    }

    setIsSubmitting(true);
    const success = await dispatch(handleCreateItem(formData));
    if (success) {
      toast.success("Item created successfully");
      navigate("/masters/items");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="rounded-xl bg-slate-100 text-slate-500"
          onClick={() => navigate("/masters/items")}
        >
          <ChevronLeft className="icon-sm mr-2" /> Back to Master
        </Button>
      </div>

      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white max-w-7xl mx-auto">
        <CardContent className="p-10 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Side: Identification & Mapping */}
            <div className="lg:col-span-2 space-y-2 border-2 border-slate-200 p-8 rounded-[2.5rem]">
              {/* Section 1: Core Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest bg-slate-200 px-3 py-1.5 rounded-lg">
                    {config.strings.dialog.coreInfo}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="pl-2 caption-small text-slate-600">
                      {config.strings.dialog.itemCode}
                    </Label>
                    <Input
                      value={formData.item_code}
                      onChange={(e) =>
                        setFormData({ ...formData, item_code: e.target.value })
                      }
                      placeholder="E.g. SKU-7402"
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-300 focus:bg-white body-strong !text-slate-900 transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="pl-2 caption-small text-slate-600">
                      {config.strings.dialog.description}
                    </Label>
                    <Input
                      value={formData.item_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          item_description: e.target.value,
                        })
                      }
                      placeholder="Detailed item name..."
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-300 focus:bg-white body-strong !text-slate-900 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2.5">
                    <Label className="pl-2 caption-small text-slate-600">
                      {config.strings.dialog.batchNumber}
                    </Label>
                    <Input
                      value={formData.batch_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          batch_number: e.target.value,
                        })
                      }
                      placeholder="Batch-001"
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-300 focus:bg-white body-strong !text-slate-900 transition-all font-mono shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="pl-2 caption-small text-slate-600">
                      {config.strings.dialog.ean_barcode}
                    </Label>
                    <Input
                      value={formData.ean_barcode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ean_barcode: e.target.value,
                        })
                      }
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-300 focus:bg-white body-strong !text-slate-900 font-mono transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="pl-2 caption-small text-slate-600">
                      {config.strings.dialog.sap_barcode}
                    </Label>
                    <Input
                      value={formData.sap_barcode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sap_barcode: e.target.value,
                        })
                      }
                      className="h-12 rounded-xl bg-slate-50/50 border-slate-300 focus:bg-white body-strong !text-slate-900 transition-all text-center shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Status & Stock */}
            <div className="space-y-2 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-200 h-fit self-start">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-indigo-100 shadow-sm">
                  <Box className="icon-base text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900">
                    Configuration
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status & Initial Stock
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="pl-2 caption-small text-slate-600 uppercase tracking-widest">
                  {config.strings.dialog.status}
                </Label>
                <RadioGroup
                  value={formData.active}
                  onValueChange={(val) =>
                    setFormData({ ...formData, active: val })
                  }
                  className="grid grid-cols-1 gap-3 flex"
                >
                  <div
                    className={`flex items-center justify-between p-3.5 w-1/2 rounded-xl border transition-all cursor-pointer ${
                      formData.active === "Y"
                        ? "bg-indigo-600/10 border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.05)]"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setFormData({ ...formData, active: "Y" })}
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 ${formData.active === "Y" ? "text-indigo-600" : "text-slate-500"}`}
                      />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Active
                      </span>
                    </div>
                    <RadioGroupItem value="Y" className="hidden" />
                  </div>
                  <div
                    className={`flex items-center justify-between w-1/2 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      formData.active === "N"
                        ? "bg-rose-600/10 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.05)]"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setFormData({ ...formData, active: "N" })}
                  >
                    <div className="flex items-center gap-2.5">
                      <XCircle
                        className={`h-4 w-4 ${formData.active === "N" ? "text-rose-600" : "text-slate-500"}`}
                      />
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Inactive
                      </span>
                    </div>
                    <RadioGroupItem value="N" className="hidden" />
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="pl-2 caption-small text-slate-600 uppercase tracking-widest">
                  Initial Stock
                </Label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="0"
                    value={formData.open_quantity || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d*$/.test(val)) {
                        setFormData({
                          ...formData,
                          open_quantity: val === "" ? 0 : Number(val),
                        });
                      }
                    }}
                    className="h-14 rounded-xl bg-white border-slate-300 focus:border-indigo-500 focus:bg-white text-slate-900 font-black text-2xl text-center transition-all shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Box className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Section 2: Mapping - Full Width */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-amber-500 rounded-full" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-lg">
                  {config.strings.dialog.attributes}
                </h3>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <Button
                  variant={mappingType === "single" ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-lg h-8 px-4 text-[10px] font-black uppercase tracking-wide transition-all ${
                    mappingType === "single"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  onClick={() => setMappingType("single")}
                >
                  {config.strings.dialog.mappingSingle}
                </Button>
                <Button
                  variant={mappingType === "multiple" ? "default" : "ghost"}
                  size="sm"
                  className={`rounded-lg h-8 px-4 text-[10px] font-black uppercase tracking-wide transition-all ${
                    mappingType === "multiple"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  onClick={() => setMappingType("multiple")}
                >
                  {config.strings.dialog.mappingMultiple}
                </Button>
              </div>
            </div>

            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border-2 border-slate-200 space-y-4">
              <BinSelectionSystem
                hierarchy={binHierarchy[0] || []}
                onSelect={(pathIds, pathLabels) => {
                  const fullPath = pathLabels.filter(Boolean).join(" > ");
                  setPendingMapping({ pathIds, fullPath });
                  setAllocQty("");
                  setIsQtyDialogOpen(true);
                }}
              />

              {assignments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Label className="caption-small !text-slate-400 uppercase tracking-widest">
                      Selected Assignments
                    </Label>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map((assignment, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-blue-400 transition-all shadow-md hover:shadow-xl hover:shadow-blue-500/5 animate-in zoom-in-95"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-black border border-blue-100">
                            #{idx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-sm font-bold text-slate-800 block">
                              {assignment.path}
                            </span>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px] font-black uppercase px-2 py-0">
                                Allocated: {assignment.qty} Units
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            const newAssignments = assignments.filter(
                              (_, i) => i !== idx,
                            );
                            setAssignments(newAssignments);

                            // Re-calculate total quantity
                            const totalQty = newAssignments.reduce(
                              (sum, a) => sum + a.qty,
                              0,
                            );

                            setFormData({
                              ...formData,
                              location: newAssignments.map(
                                (a) => a.pathIds[0] || 0,
                              ),
                              floor: newAssignments.map(
                                (a) => a.pathIds[1] || 0,
                              ),
                              device: newAssignments.map(
                                (a) => a.pathIds[4] || 0,
                              ),
                              open_quantity: totalQty,
                            });
                          }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button: Bottom Full Width */}
          <div className="pt-2">
            <Button
              className="w-1/4 mx-auto h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Create Item
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quantity Allocation Pop-up */}
      <Dialog open={isQtyDialogOpen} onOpenChange={setIsQtyDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-indigo-600 p-8 text-white space-y-2">
            <div className="flex items-center gap-3">
              <Box className="h-6 w-6" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                Allocate Quantity
              </h2>
            </div>
            <p className="text-indigo-100 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              Define the specific stock allocation for this path
            </p>
          </div>

          <div className="p-8 space-y-8 bg-white">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                Selected Path
              </Label>
              <p className="text-sm font-black text-slate-900 break-words">
                {pendingMapping?.fullPath}
              </p>
            </div>

            <div className="space-y-4">
              <Label className="pl-2 caption-small text-slate-600 uppercase tracking-widest">
                Quantity for this location
              </Label>
              <Input
                type="text"
                placeholder="Enter Qty..."
                value={allocQty}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*$/.test(val)) setAllocQty(val);
                }}
                className="h-16 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 text-3xl font-black text-center transition-all"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50"
                onClick={() => setIsQtyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100"
                onClick={() => {
                  if (!allocQty || parseInt(allocQty) <= 0) {
                    toast.error("Please enter a valid quantity");
                    return;
                  }

                  const qty = parseInt(allocQty);
                  const currentSum = assignments.reduce((sum, a) => sum + a.qty, 0);
                  const predefinedTotal = formData.open_quantity || 0;

                  // If user predefined a total, validate against it
                  if (predefinedTotal > 0 && currentSum + qty > predefinedTotal) {
                    const remaining = predefinedTotal - currentSum;
                    toast.error(
                      `Allocation exceeds defined total. Max available: ${remaining}`,
                    );
                    return;
                  }

                  const newAssignment = {
                    path: pendingMapping!.fullPath,
                    pathIds: pendingMapping!.pathIds,
                    qty: qty,
                  };

                  let newAssignments;
                  if (mappingType === "single") {
                    newAssignments = [newAssignment];
                  } else {
                    newAssignments = [...assignments, newAssignment];
                  }

                  setAssignments(newAssignments);

                  // Sum up all quantities for Total Stock (only if it wasn't pre-defined or if we're exceeding it)
                  const newTotalSum = newAssignments.reduce(
                    (sum, a) => sum + a.qty,
                    0,
                  );

                  setFormData({
                    ...formData,
                    location: newAssignments.map((a) => a.pathIds[0] || 0),
                    floor: newAssignments.map((a) => a.pathIds[1] || 0),
                    device: newAssignments.map((a) => a.pathIds[4] || 0),
                    open_quantity: Math.max(predefinedTotal, newTotalSum),
                  });

                  setIsQtyDialogOpen(false);
                  toast.success(`Allocated ${qty} units to location`);
                }}
              >
                Confirm Path
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Re-using the BinSelectionSystem from before
const BinSelectionSystem = ({
  hierarchy,
  onSelect,
}: {
  hierarchy: any[];
  onSelect: (pathIds: number[], pathLabels: string[]) => void;
}) => {
  const [selections, setSelections] = useState<number[]>([0, 0, 0, 0, 0]);
  const [selectionLabels, setSelectionLabels] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleLevelChange = (levelIdx: number, id: string, label: string) => {
    const newSelections = [...selections];
    const newLabels = [...selectionLabels];

    newSelections[levelIdx] = parseInt(id);
    newLabels[levelIdx] = label;

    for (let i = levelIdx + 1; i < 5; i++) {
      newSelections[i] = 0;
      newLabels[i] = "";
    }
    setSelections(newSelections);
    setSelectionLabels(newLabels);
  };

  const getOptions = (levelIdx: number) => {
    if (levelIdx === 0) return hierarchy;
    let current = hierarchy;
    for (let i = 0; i < levelIdx; i++) {
      const parent = current.find((n) => n.id === selections[i]);
      if (!parent || !parent.children) return [];
      current = parent.children;
    }
    return current;
  };

  const isReady = selections[0] !== 0 && selections[3] !== 0;

  return (
    <div className="flex items-end gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
        {[1, 2, 3, 4, 5].map((level, idx) => (
          <div key={level} className="space-y-2">
            <Label className="text-[10px] font-black ml-2 uppercase text-slate-600 tracking-tighter">
              Level {level}
            </Label>
            <div className="relative group">
              <select
                value={selections[idx]?.toString() || "0"}
                onChange={(e) => {
                  const val = e.target.value;
                  const label = e.target.options[e.target.selectedIndex].text;
                  handleLevelChange(idx, val, label);
                }}
                disabled={idx > 0 && selections[idx - 1] === 0}
                className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-[12px] font-bold appearance-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all disabled:opacity-50 shadow-sm"
              >
                <option value="0">Select Level {level}</option>
                {getOptions(idx).map((opt: any) => (
                  <option key={opt.id} value={opt.id.toString()}>
                    {opt.value}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronRight className="h-4 w-4 rotate-90" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        disabled={!isReady}
        onClick={() => onSelect(selections, selectionLabels)}
        className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 transition-all active:scale-95 shrink-0 flex items-center justify-center border-0 p-0"
      >
        <CheckCircle2 className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ItemCreate;

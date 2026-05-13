import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Layers,
  Database,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  handleCreateItem,
  handleFetchAllItems,
} from "@/app/manager/itemManager";
import { handleFetchAllLayerConfigs } from "@/app/manager/locationManager";
import { LocationSelect } from "@/components/LocationSelect";
import config from "./ItemConfig.json";
import { ItemDTO } from "@/core/models/master.model";

interface Assignment {
  path: string;
  locationId: number;
  qty: number;
}

const ItemEdit = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: layerConfigs, loading: layersLoading } = useAppSelector(
    (state) => state.layerConfig,
  );
  const { data: items, loading } = useAppSelector((state) => state.item);

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
  });

  const [mappingType, setMappingType] = useState<"single" | "multiple">(
    "multiple",
  );
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isQtyDialogOpen, setIsQtyDialogOpen] = useState(false);
  const [pendingMapping, setPendingMapping] = useState<{
    locationId: number;
    fullPath: string;
  } | null>(null);
  const [allocQty, setAllocQty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      dispatch(handleFetchAllLayerConfigs(1));

      let item = items.find((i) => i.id === Number(id));
      if (!item) {
        await dispatch(handleFetchAllItems({ page: 1, size: 100 }));
      }
    };
    loadData();
  }, [dispatch, id]);

  useEffect(() => {
    if (isInitialized) return;

    const item = items.find((i) => i.id === Number(id));
    // Wait until both item and layerConfigs are available before initialising
    if (item && layerConfigs.length > 0) {
      setFormData({
        ...item,
        warehouse_id: 1,
      });

      // Populate existing location assignments — deduplicated by locationId
      if (Array.isArray(item.location) && item.location.length > 0) {
        const seen = new Set<number>();
        const initialAssignments: Assignment[] = item.location
          .filter((loc: any) => {
            if (seen.has(loc.location_id)) return false;
            seen.add(loc.location_id);
            return true;
          })
          .map((loc: any) => {
            const config = layerConfigs.find((lc) => lc.id === loc.location_id);
            const path = config
              ? [config.layer1, config.layer2, config.layer3, config.layer4, config.layer5]
                  .filter(Boolean)
                  .join(" > ")
              : `Location #${loc.location_id}`;
            return {
              locationId: loc.location_id,
              path,
              qty: loc.total_capacity ?? loc.available_capacity ?? 0,
            };
          });
        setAssignments(initialAssignments);
      }

      setIsLoading(false);
      setIsInitialized(true);
    } else if (!loading && items.length > 0 && layerConfigs.length > 0) {
      // Item not found after load
      setIsLoading(false);
    }
  }, [id, items, isInitialized, loading, layerConfigs]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Transform to the new requested payload structure
    const payload = {
      warehouse_id: 1,
      open_quantity: formData.open_quantity || 0,
      location: assignments.map((a) => ({
        location_id: a.locationId,
        total_capacity: a.qty, // Using allocation as capacity for now per user context
        available_capacity: a.qty,
      })),
      floor: [], // Floor handled if needed, currently mapping to location_id
    };

    const success = await dispatch(
      handleCreateItem(payload as any, Number(id)),
    );
    if (success) {
      toast.success("Item Configuration Updated Successfully");
      navigate("/masters/items");
    }
    setIsSubmitting(false);
  };

  if (isLoading || layersLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <RefreshCw className="h-10 w-10 animate-spin text-blue-600" />
        <p className="font-black uppercase tracking-widest text-[10px]">
          Synchronizing Item Data...
        </p>
      </div>
    );
  }

  if (!formData.item_code && !isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 text-slate-400">
        <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
          <Database className="h-10 w-10 text-slate-300" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-slate-900 uppercase">
            Item Not Found
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            The requested record could not be retrieved
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-widest px-8 h-12"
          onClick={() => navigate("/masters/items")}
        >
          Return to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
          onClick={() => navigate("/masters/items")}
        >
          <ChevronLeft className="icon-sm mr-2" /> Back to Master
        </Button>
      </div>

      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white max-w-7xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="w-full space-y-6">
            {/* Compact Header Section (Full Width) */}
            <div className="space-y-4 border-2 border-slate-100 p-6 rounded-[2.5rem] bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-slate-800 rounded-full" />
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200 bg-amber-300">
                    Item Identity & Config (Locked)
                  </h3>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                    <Label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      Qty:
                    </Label>
                    <span className="text-xl font-black text-slate-900">
                      {formData.open_quantity ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Status:
                    </Label>
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <div className="space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Item Code
                  </Label>
                  <Input
                    value={formData.item_code}
                    disabled
                    className="h-11 rounded-xl bg-white border-slate-200 !text-slate-900 !opacity-100 font-black shadow-sm"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Description
                  </Label>
                  <Input
                    value={formData.item_description}
                    disabled
                    className="h-11 rounded-xl bg-white border-slate-200 !text-slate-900 !opacity-100 font-black shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Batch Number
                  </Label>
                  <Input
                    value={formData.batch_number}
                    disabled
                    className="h-11 rounded-xl bg-white border-slate-200 !text-slate-900 !opacity-100 font-black shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    EAN Barcode
                  </Label>
                  <Input
                    value={formData.ean_barcode}
                    disabled
                    className="h-11 rounded-xl bg-white border-slate-200 !text-slate-900 !opacity-100 font-black font-mono text-[11px] shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Section 2: Mapping System */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-blue-600 rounded-full" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100">
                Location Hierarchy Mapping
              </h3>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border-2 border-slate-200 space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="space-y-2 shrink-0">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Mapping Mode
                  </Label>
                  <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                      onClick={() => {
                        setMappingType("single");
                        if (assignments.length > 1)
                          setAssignments([assignments[0]]);
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mappingType === "single" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => setMappingType("multiple")}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${mappingType === "multiple" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                      Multiple
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">
                    Target Location Selection
                  </Label>
                  <LocationSelect
                    data={layerConfigs}
                    onSelect={(locationId, pathLabel) => {
                      if (mappingType === "single" && assignments.length > 0) {
                        toast.error(
                          "Only one location allowed in Single mode. Delete existing to change.",
                        );
                        return;
                      }
                      if (assignments.some((a) => a.locationId === locationId)) {
                        toast.error("This location is already assigned.");
                        return;
                      }
                      setPendingMapping({ locationId, fullPath: pathLabel });
                      setAllocQty("");
                      setIsQtyDialogOpen(true);
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {assignments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Active Assignments
                    </Label>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map((assignment, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-100 p-2 rounded-[1.5rem] flex items-center justify-between group hover:border-blue-400 hover:shadow-xl transition-all animate-in zoom-in-95"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-black border border-blue-100">
                            {idx + 1}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-sm font-bold text-slate-800 block truncate max-w-[300px]">
                              {assignment.path}
                            </span>
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black uppercase">
                              Qty: {assignment.qty} Units
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          onClick={() =>
                            setAssignments(
                              assignments.filter((_, i) => i !== idx),
                            )
                          }
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              className="w-1/5 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Update
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isQtyDialogOpen} onOpenChange={setIsQtyDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-blue-600 p-8 text-white space-y-2">
            <div className="flex items-center gap-3">
              <Layers className="h-6 w-6" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                Set Capacity
              </h2>
            </div>
            <p className="text-blue-100 text-[11px] font-bold uppercase tracking-widest">
              Allocate quantity for this specific location
            </p>
          </div>

          <div className="p-8 space-y-8 bg-white">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">
                Path
              </Label>
              <p className="text-sm font-black text-slate-900 break-words">
                {pendingMapping?.fullPath}
              </p>
            </div>

            <div className="space-y-4">
              <Label className="pl-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Quantity Allocation
              </Label>
              <Input
                type="text"
                placeholder="0"
                value={allocQty}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d*$/.test(val)) setAllocQty(val);
                }}
                className="h-16 rounded-2xl bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 text-3xl font-black text-center transition-all"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest"
                onClick={() => setIsQtyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest"
                onClick={() => {
                  if (!allocQty || parseInt(allocQty) <= 0) {
                    toast.error("Please enter a valid quantity");
                    return;
                  }

                  const qtyToAlloc = parseInt(allocQty);

                  const newAssignment = {
                    path: pendingMapping!.fullPath,
                    locationId: pendingMapping!.locationId,
                    qty: qtyToAlloc,
                  };

                  if (mappingType === "single") {
                    setAssignments([newAssignment]);
                  } else {
                    setAssignments([...assignments, newAssignment]);
                  }

                  setIsQtyDialogOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemEdit;

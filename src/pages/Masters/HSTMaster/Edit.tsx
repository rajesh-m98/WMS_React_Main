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
} from "@/components/ui";
import {
  ChevronLeft,
  Smartphone,
  CheckCircle2,
  XCircle,
  Database,
  Trash2,
  Box,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchAllHST, handleCreateHST } from "@/app/manager/hstManager";
import { handleFetchAllLayerConfigs } from "@/app/manager/locationManager";
import { LocationSelect } from "@/components/LocationSelect";

interface Assignment {
  path: string;
  locationId: number;
}

const HSTEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isNew = id === "new";

  const { data: devices, loading } = useAppSelector((state) => state.hst);
  const { data: layerConfigs, loading: layersLoading } = useAppSelector(
    (state) => state.layerConfig,
  );

  const [formData, setFormData] = useState({
    device_id: "",
    device_name: "",
    brand_name: "",
    device_serial_number: "",
    device_type: "",
    device_status: 0,
    warehouse_id: 1,
  });

  const [mappingType, setMappingType] = useState<"single" | "multiple">(
    "multiple",
  );
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    dispatch(handleFetchAllLayerConfigs(1));
    if (!isNew) {
      dispatch(handleFetchAllHST({ size: 100 }));
    }
  }, [dispatch, isNew]);

  useEffect(() => {
    if (isInitialized || isNew || loading || devices.length === 0) return;

    const device = devices.find((d) => d.id === Number(id));
    if (device) {
      setFormData({
        device_id: device.device_id,
        device_name: device.device_name || "",
        brand_name: device.brand_name || "",
        device_serial_number: device.device_serial_number,
        device_type: device.device_type,
        device_status: device.device_status,
        warehouse_id: device.warehouse_id || 1,
      });

        // Deduplicate by locationId and map to path
        if (device.locations && device.locations.length > 0) {
          const seen = new Set<number>();
          const initialAssignments = device.locations
            .filter((locId: number) => {
              if (seen.has(locId)) return false;
              seen.add(locId);
              return true;
            })
            .map((locId: number) => {
              const config = layerConfigs.find((lc) => lc.id === locId);
              return {
                locationId: locId,
                path: config
                  ? [
                      config.layer1,
                      config.layer2,
                      config.layer3,
                      config.layer4,
                      config.layer5,
                    ]
                      .filter(Boolean)
                      .join(" > ")
                  : "Direct Assignment",
              };
            });
          setAssignments(initialAssignments);
        }
        setIsInitialized(true);
      }
  }, [devices, id, isNew, loading, isInitialized, layerConfigs]);

  const handleSubmit = async () => {
    if (!formData.device_id || !formData.device_serial_number) {
      toast.error("Required fields: Device ID and Serial Number");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...formData,
      locations: assignments.map((a) => a.locationId),
    };

    const success = await dispatch(
      handleCreateHST(payload, isNew ? undefined : Number(id)),
    );

    if (success) {
      toast.success(
        isNew ? "Device Provisioned" : "Device Configuration Updated",
      );
      navigate("/masters/hst");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/masters/hst")}
            className="h-10 w-10 rounded-xl bg-white shadow-md shadow-slate-600 border border-slate-100 hover:bg-slate-50 transition-all p-0"
          >
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white max-w-7xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="w-full space-y-6">
            {/* Compact Header Section (Full Width) */}
            <div className="space-y-4 border-2 border-slate-100 p-6 rounded-[2.5rem] bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50">
                    Device Identity & Status
                  </h3>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Status:
                    </Label>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                        formData.device_status === 0
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase">
                        {formData.device_status === 0
                          ? "Available"
                          : "Assigned"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Device ID
                  </Label>
                  <Input
                    value={formData.device_id}
                    onChange={(e) =>
                      setFormData({ ...formData, device_id: e.target.value })
                    }
                    disabled={!isNew}
                    className="h-11 rounded-xl bg-white border-slate-200 text-slate-900 font-black shadow-sm disabled:opacity-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="DEV-001"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Device Name
                  </Label>
                  <Input
                    value={formData.device_name}
                    onChange={(e) =>
                      setFormData({ ...formData, device_name: e.target.value })
                    }
                    disabled={!isNew}
                    className="h-11 rounded-xl bg-white border-slate-200 text-slate-900 font-black shadow-sm disabled:opacity-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="Scanner Unit Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Brand
                  </Label>
                  <Input
                    value={formData.brand_name}
                    onChange={(e) =>
                      setFormData({ ...formData, brand_name: e.target.value })
                    }
                    disabled={!isNew}
                    className="h-11 rounded-xl bg-white border-slate-200 text-slate-900 font-black shadow-sm disabled:opacity-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="Zebra"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="pl-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Serial Number
                  </Label>
                  <Input
                    value={formData.device_serial_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        device_serial_number: e.target.value,
                      })
                    }
                    disabled={!isNew}
                    className="h-11 rounded-xl bg-white border-slate-200 text-slate-900 font-black font-mono text-[11px] shadow-sm disabled:opacity-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    placeholder="SN123456"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Section 2: Location Assignment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100">
                  Location Assignment
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
                      Assign to Location
                    </Label>
                    <LocationSelect
                      data={layerConfigs}
                      onSelect={(locationId, pathLabel) => {
                        if (
                          mappingType === "single" &&
                          assignments.length > 0
                        ) {
                          toast.error(
                            "Only one location allowed in Single mode. Delete existing to change.",
                          );
                          return;
                        }
                        if (assignments.some((a) => a.locationId === locationId)) {
                          toast.error("This location is already assigned.");
                          return;
                        }
                        setAssignments([
                          ...assignments,
                          { locationId, path: pathLabel },
                        ]);
                      }}
                      disabled={isSubmitting || layersLoading}
                    />
                  </div>
                </div>

                {assignments.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Assigned Locations
                      </Label>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                      {assignments.map((assignment, idx) => (
                        <div
                          key={idx}
                          className="bg-white border-2 border-slate-100 p-2 rounded-[1.5rem] flex items-center justify-between group hover:border-blue-400 hover:shadow-xl transition-all animate-in zoom-in-95"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-black border border-blue-100">
                              {idx + 1}
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[13px] font-bold text-slate-800 block truncate max-w-[250px]">
                                {assignment.path}
                              </span>
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
          </div>

          <div className="pt-6 flex justify-center">
            <Button
              className="w-1/5 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <RefreshCw className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  {isNew ? "Create" : "Update"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HSTEdit;

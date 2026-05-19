import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchAllHST } from "@/app/manager/hstManager";
import {
  ArrowLeft,
  Package,
  MapPin,
  Smartphone,
  Layers,
  ChevronRight,
  ClipboardList,
  Database,
  Search,
  BadgeCheck,
  Send,
  Trash2,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ManualPicklistResultPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    data: result,
    loading,
    error,
  } = useAppSelector((state) => state.request.manual);
  
  const { data: devices } = useAppSelector((state) => state.hst);

  // Form State: { [locKey]: { locationId: string; deviceId: string } }
  const [formState, setFormState] = useState<Record<string, { locationId: string; deviceId: string }>>({});

  useEffect(() => {
    dispatch(handleFetchAllHST({ page: 1, size: 100 }));
  }, [dispatch]);
  useEffect(() => {
    if (result && result.length > 0) {
      const initialForm: Record<string, { locationId: string; deviceId: string }> = {};
      result.forEach((item: any, idx: number) => {
        item.lines.forEach((line: any, lIdx: number) => {
          line.locations.forEach((loc: any, locIdx: number) => {
            const key = `${idx}-${lIdx}-${locIdx}`;
            initialForm[key] = {
              locationId: loc.item_location?.id?.toString() || "",
              deviceId: "",
            };
          });
        });
      });
      setFormState(initialForm);
    }
  }, [result]);

  const handleUpdateForm = (key: string, field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSubmit = () => {
    const totalLocations = Object.keys(formState).length;
    const assignedDevices = Object.values(formState).filter(val => val.deviceId !== "");

    if (assignedDevices.length < totalLocations) {
      toast.error("Please select a device for all locations before saving");
      return;
    }

    console.log("Submitting Picks with Devices:", formState);
    toast.success("Manual picklist generated and assigned successfully");
    navigate("/transactions/picklist/generation");
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Database className="h-8 w-8 text-blue-600 animate-bounce" />
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
          Synthesizing Data...
        </p>
      </div>
    );
  }

  if (error || !result || result.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-100">
          <Package className="h-10 w-10 text-rose-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 uppercase">
            No Data Found
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            {error || "No manual picklist items were generated"}
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="rounded-2xl px-8 h-12 border-slate-200 font-black text-[10px] uppercase tracking-widest"
        >
          Return to Details
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER */}
      <div className="shrink-0 flex items-center justify-between px-4 py-4 bg-white border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[32px] w-full">
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
              Finalize <span className="text-blue-600">Picking</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Select Locations and Enter Picked Quantities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleSubmit}
            className="h-14 px-10 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 font-black text-[12px] uppercase tracking-widest flex gap-3 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            Submit Picklist
          </Button>
        </div>
      </div>

      <Card className="border-1 border-slate-100 shadow-lg shadow-slate-300 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-200 border-b border-slate-100">
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    SL No
                  </th>
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Doc No
                  </th>
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Item name
                  </th>
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Item Code
                  </th>
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Location
                  </th>
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Quantity
                  </th>
                  <th className="px-4 py-4 text-left text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Assign Device
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {result.map((item: any, idx: number) =>
                  item.lines.map((line: any, lIdx: number) =>
                    line.locations.map((loc: any, locIdx: number) => {
                      const key = `${idx}-${lIdx}-${locIdx}`;
                      const currentPick = formState[key] || { locationId: "", deviceId: "" };
                      
                      return (
                        <tr
                          key={key}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-all duration-200"
                        >
                          <td className="px-4 py-4">
                            <span className="text-sm font-black text-slate-400">
                              {idx * item.lines.length + lIdx + locIdx + 1}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs font-black text-slate-700 font-mono">
                              {item.picklist?.doc_entry}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-black !text-slate-900 uppercase">
                              {line.item?.item_description}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-black text-blue-600 uppercase">
                              {line.item_code}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <Select
                              value={currentPick.locationId}
                              onValueChange={(val) => handleUpdateForm(key, "locationId", val)}
                            >
                              <SelectTrigger className="h-12 w-full max-w-[250px] rounded-xl border-slate-200 bg-white shadow-sm font-black text-slate-700 text-[10px] uppercase tracking-widest">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl p-1">
                                {line.locations.map((lOpt: any, lOptIdx: number) => {
                                  const optPath = [
                                    lOpt.item_location?.layer1,
                                    lOpt.item_location?.layer2,
                                    lOpt.item_location?.layer3,
                                    lOpt.item_location?.layer4,
                                    lOpt.item_location?.layer5,
                                  ]
                                    .filter(Boolean)
                                    .join(" > ");
                                  return (
                                    <SelectItem
                                      key={lOptIdx}
                                      value={lOpt.item_location?.id?.toString() || `fallback-${lOptIdx}`}
                                      className="rounded-lg py-2 px-3 focus:bg-blue-50 focus:text-blue-700"
                                    >
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase">
                                          {optPath || "Unknown Location"}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </td>
                          
                          <td className="px-4 py-4">
                            <Badge className="bg-blue-50 text-blue-700 border-0 shadow-sm font-black text-lg px-4 py-2">
                              {loc.quantity || line.quantity || "0"}
                            </Badge>
                          </td>
                          
                          <td className="px-4 py-4">
                            <Select
                              value={currentPick.deviceId}
                              onValueChange={(val) => handleUpdateForm(key, "deviceId", val)}
                            >
                              <SelectTrigger className="h-12 w-full max-w-[200px] rounded-xl border-slate-200 bg-white shadow-sm font-black text-slate-700 text-xs">
                                <SelectValue placeholder="Select Device" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-100 shadow-xl p-1">
                                {(devices || []).map((device: any) => (
                                  <SelectItem
                                    key={device.id}
                                    value={device.id.toString()}
                                    className="rounded-lg py-2 px-3 focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Smartphone className="w-4 h-4 text-slate-400" />
                                      <span className="text-[12px] font-black uppercase">
                                        {device.device_name || device.device_id}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      );
                    })
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualPicklistResultPage;

import { useState, useMemo } from "react";
import { Label, Button } from "@/components/ui";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { LayerConfigDTO } from "@/app/store/layerConfigSlice";

interface LocationHierarchySelectProps {
  data: LayerConfigDTO[];
  onSelect: (locationId: number, pathLabel: string) => void;
  disabled?: boolean;
}

export const LocationHierarchySelect = ({
  data,
  onSelect,
  disabled = false,
}: LocationHierarchySelectProps) => {
  const [selections, setSelections] = useState<{
    layer1: string | null;
    layer2: string | null;
    layer3: string | null;
    layer4: string | null;
    layer5: string | null;
  }>({
    layer1: null,
    layer2: null,
    layer3: null,
    layer4: null,
    layer5: null,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const zones = useMemo(() => {
    const unique = Array.from(new Set(data.map((item) => item.layer1))).filter(Boolean);
    return unique.sort();
  }, [data]);

  const aisles = useMemo(() => {
    if (!selections.layer1) return [];
    const filtered = data.filter((item) => item.layer1 === selections.layer1 && item.layer2);
    const unique = Array.from(new Set(filtered.map((item) => item.layer2))).filter(Boolean);
    return unique.sort();
  }, [data, selections.layer1]);

  const bays = useMemo(() => {
    if (!selections.layer2) return [];
    const filtered = data.filter(
      (item) =>
        item.layer1 === selections.layer1 &&
        item.layer2 === selections.layer2 &&
        item.layer3
    );
    const unique = Array.from(new Set(filtered.map((item) => item.layer3))).filter(Boolean);
    return unique.sort();
  }, [data, selections.layer1, selections.layer2]);

  const shelves = useMemo(() => {
    if (!selections.layer3) return [];
    const filtered = data.filter(
      (item) =>
        item.layer1 === selections.layer1 &&
        item.layer2 === selections.layer2 &&
        item.layer3 === selections.layer3 &&
        item.layer4
    );
    const unique = Array.from(new Set(filtered.map((item) => item.layer4))).filter(Boolean);
    return unique.sort();
  }, [data, selections.layer1, selections.layer2, selections.layer3]);

  const bins = useMemo(() => {
    if (!selections.layer4) return [];
    const filtered = data.filter(
      (item) =>
        item.layer1 === selections.layer1 &&
        item.layer2 === selections.layer2 &&
        item.layer3 === selections.layer3 &&
        item.layer4 === selections.layer4 &&
        item.layer5
    );
    return filtered.sort((a, b) => (a.layer5 || "").localeCompare(b.layer5 || ""));
  }, [data, selections.layer1, selections.layer2, selections.layer3, selections.layer4]);

  const handleLevelChange = (level: keyof typeof selections, value: string) => {
    const newSelections = { ...selections, [level]: value === "0" ? null : value };
    
    // Reset lower levels
    if (level === "layer1") {
      newSelections.layer2 = null;
      newSelections.layer3 = null;
      newSelections.layer4 = null;
      newSelections.layer5 = null;
    } else if (level === "layer2") {
      newSelections.layer3 = null;
      newSelections.layer4 = null;
      newSelections.layer5 = null;
    } else if (level === "layer3") {
      newSelections.layer4 = null;
      newSelections.layer5 = null;
    } else if (level === "layer4") {
      newSelections.layer5 = null;
    }

    setSelections(newSelections);
    
    // Find ID for the current selection if it's the deepest possible or if user wants intermediate IDs
    // But usually we want the ID of the specific node.
    const node = data.find(item => 
      item.layer1 === newSelections.layer1 &&
      item.layer2 === newSelections.layer2 &&
      item.layer3 === newSelections.layer3 &&
      item.layer4 === newSelections.layer4 &&
      item.layer5 === newSelections.layer5
    );
    setSelectedId(node?.id || null);
  };

  const isReady = selectedId !== null;

  const getFullPath = () => {
    return [
      selections.layer1,
      selections.layer2,
      selections.layer3,
      selections.layer4,
      selections.layer5,
    ]
      .filter(Boolean)
      .join(" > ");
  };

  return (
    <div className="flex items-end gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
        <div className="space-y-2">
          <Label className="text-[10px] font-black ml-2 uppercase text-slate-600 tracking-tighter">
            Zone
          </Label>
          <div className="relative group">
            <select
              value={selections.layer1 || "0"}
              onChange={(e) => handleLevelChange("layer1", e.target.value)}
              disabled={disabled}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-[12px] font-bold appearance-none focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="0">Select Zone</option>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black ml-2 uppercase text-slate-600 tracking-tighter">
            Aisle
          </Label>
          <div className="relative group">
            <select
              value={selections.layer2 || "0"}
              onChange={(e) => handleLevelChange("layer2", e.target.value)}
              disabled={disabled || !selections.layer1}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-[12px] font-bold appearance-none focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="0">Select Aisle</option>
              {aisles.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black ml-2 uppercase text-slate-600 tracking-tighter">
            Bay
          </Label>
          <div className="relative group">
            <select
              value={selections.layer3 || "0"}
              onChange={(e) => handleLevelChange("layer3", e.target.value)}
              disabled={disabled || !selections.layer2}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-[12px] font-bold appearance-none focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="0">Select Bay</option>
              {bays.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black ml-2 uppercase text-slate-600 tracking-tighter">
            Shelf
          </Label>
          <div className="relative group">
            <select
              value={selections.layer4 || "0"}
              onChange={(e) => handleLevelChange("layer4", e.target.value)}
              disabled={disabled || !selections.layer3}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-[12px] font-bold appearance-none focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="0">Select Shelf</option>
              {shelves.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black ml-2 uppercase text-slate-600 tracking-tighter">
            Bin
          </Label>
          <div className="relative group">
            <select
              value={selections.layer5 || "0"}
              onChange={(e) => handleLevelChange("layer5", e.target.value)}
              disabled={disabled || !selections.layer4}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-[12px] font-bold appearance-none focus:border-indigo-500 transition-all disabled:opacity-50"
            >
              <option value="0">Select Bin</option>
              {bins.map((b) => (
                <option key={b.id} value={b.layer5!}>
                  {b.layer5}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>
      </div>
      <Button
        type="button"
        disabled={disabled || !isReady}
        onClick={() => onSelect(selectedId!, getFullPath())}
        className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all active:scale-95 shrink-0 flex items-center justify-center border-0 p-0"
      >
        <CheckCircle2 className="h-6 w-6" />
      </Button>
    </div>
  );
};

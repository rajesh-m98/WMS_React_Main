import { useMemo } from "react";
import { LayerConfigDTO } from "@/app/store/layerConfigSlice";

interface LocationSelectProps {
  data: LayerConfigDTO[];
  onSelect: (locationId: number, pathLabel: string) => void;
  disabled?: boolean;
}

export const LocationSelect = ({
  data,
  onSelect,
  disabled = false,
}: LocationSelectProps) => {
  const groupedLocations = useMemo(() => {
    const bins = data.filter((item) => item.layer4); // Must be at least a shelf
    const groups: Record<string, typeof bins> = {};

    bins.forEach((bin) => {
      const zone = bin.layer1 || "Other Zones";
      if (!groups[zone]) groups[zone] = [];
      groups[zone].push(bin);
    });

    // Sort zones and items within zones
    return Object.keys(groups)
      .sort()
      .map((zone) => ({
        zone,
        items: groups[zone]
          .map((item) => ({
            id: item.id,
            fullPath: [
              item.layer1,
              item.layer2,
              item.layer3,
              item.layer4,
              item.layer5,
            ]
              .filter(Boolean)
              .join(" > "),
          }))
          .sort((a, b) => a.fullPath.localeCompare(b.fullPath)),
      }));
  }, [data]);

  return (
    <div className="w-1/2 relative">
      <select
        disabled={disabled}
        className="w-full h-14 px-5 rounded-2xl border-2 border-slate-200 bg-white text-sm font-black text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all uppercase tracking-tight shadow-sm appearance-none cursor-pointer hover:bg-slate-50"
        onChange={(e) => {
          const id = Number(e.target.value);
          if (id === 0) return;

          // Find the item in grouped data
          let foundItem = null;
          for (const group of groupedLocations) {
            foundItem = group.items.find((i) => i.id === id);
            if (foundItem) break;
          }

          if (foundItem) onSelect(foundItem.id, foundItem.fullPath);
          e.target.value = "0";
        }}
      >
        <option value="0">Select Target Bin Location...</option>
        {groupedLocations.map((group) => (
          <optgroup
            key={group.zone}
            label={group.zone}
            className="font-black text-blue-600 bg-slate-50"
          >
            {group.items.map((loc) => (
              <option
                key={loc.id}
                value={loc.id}
                className="text-slate-900 font-bold bg-white"
              >
                {loc.fullPath}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <div className="h-5 w-5 rounded-md bg-slate-100 flex items-center justify-center">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

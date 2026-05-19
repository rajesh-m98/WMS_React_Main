import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Separator,
} from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  User,
  Layers,
  Search,
  CheckCircle2,
  Plus,
  ArrowRight,
  Database,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchAllLayerConfigs } from "@/app/manager/locationManager";
import { handleFetchGins } from "@/app/manager/ginManager";
import api from "@/lib/api";
import { toast } from "sonner";

interface PutawayRecord {
  id: number;
  header_id: number;
  line_id: number;
  item_code: string;
  item_desc: string;
  received_qty: number;
  location_id: number | null;
  allocated_qty: number;
  locations: {
    id: number;
    layer1: string;
    layer2: string;
    layer3: string;
    layer4: string;
    layer5: string;
    layer6: string | null;
    barcode: string;
  } | null;
  created_at: string;
}

const PutawayLocationDetail = () => {
  const { headerId, lineId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentLines, loading: ginLoading } = useAppSelector(
    (state) => state.gin,
  );
  const { data: layerConfigs, loading: layersLoading } = useAppSelector(
    (state) => state.layerConfig,
  );

  const [records, setRecords] = useState<PutawayRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [activeTab, setActiveTab] = useState<"view" | "assign">("view");

  // Assignment State
  const [selectedLayer1, setSelectedLayer1] = useState<string>("");
  const [selectedLayer2, setSelectedLayer2] = useState<string>("");
  const [selectedLayer3, setSelectedLayer3] = useState<string>("");
  const [selectedLayer4, setSelectedLayer4] = useState<string>("");
  const [selectedLayer5, setSelectedLayer5] = useState<string>("");
  const [allocQty, setAllocQty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentItem = useMemo(() => {
    return currentLines.find((l) => Number(l.id) === Number(lineId));
  }, [currentLines, lineId]);

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      // Hit the specific API provided by user
      const response = await api.get<{
        status: boolean;
        data: { items: PutawayRecord[] };
      }>(`/gin/get_all_putaway/`, {
        params: { is_paginate: true, page: 1, size: 100 },
      });

      if (response.data.status) {
        // Match records with header_id and line_id
        const matched = response.data.data.items.filter(
          (r) =>
            Number(r.header_id) === Number(headerId) &&
            Number(r.line_id) === Number(lineId),
        );
        setRecords(matched);
        /* Auto-tab disabled for review */
        /*
        if (matched.length === 0) {
          setActiveTab("assign");
        }
        */
      }
    } catch (err) {
      console.error("Error fetching putaway records:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    if (layerConfigs.length === 0) {
      dispatch(handleFetchAllLayerConfigs(1));
    }
    // Ensure we have currentLines in store (if user refreshed the page)
    if (currentLines.length === 0 && headerId) {
      dispatch(handleFetchGins({ is_paginate: true, size: 100 }));
    }
  }, [headerId, lineId, dispatch]);

  // Hierarchical Filter Options
  const layer1Options = useMemo(
    () =>
      Array.from(new Set(layerConfigs.map((lc) => lc.layer1))).filter(Boolean),
    [layerConfigs],
  );

  const layer2Options = useMemo(
    () =>
      Array.from(
        new Set(
          layerConfigs
            .filter((lc) => lc.layer1 === selectedLayer1)
            .map((lc) => lc.layer2),
        ),
      ).filter(Boolean),
    [layerConfigs, selectedLayer1],
  );

  const layer3Options = useMemo(
    () =>
      Array.from(
        new Set(
          layerConfigs
            .filter(
              (lc) =>
                lc.layer1 === selectedLayer1 && lc.layer2 === selectedLayer2,
            )
            .map((lc) => lc.layer3),
        ),
      ).filter(Boolean),
    [layerConfigs, selectedLayer1, selectedLayer2],
  );

  const layer4Options = useMemo(
    () =>
      Array.from(
        new Set(
          layerConfigs
            .filter(
              (lc) =>
                lc.layer1 === selectedLayer1 &&
                lc.layer2 === selectedLayer2 &&
                lc.layer3 === selectedLayer3,
            )
            .map((lc) => lc.layer4),
        ),
      ).filter(Boolean),
    [layerConfigs, selectedLayer1, selectedLayer2, selectedLayer3],
  );

  const layer5Options = useMemo(
    () =>
      Array.from(
        new Set(
          layerConfigs
            .filter(
              (lc) =>
                lc.layer1 === selectedLayer1 &&
                lc.layer2 === selectedLayer2 &&
                lc.layer3 === selectedLayer3 &&
                lc.layer4 === selectedLayer4,
            )
            .map((lc) => lc.layer5),
        ),
      ).filter(Boolean),
    [
      layerConfigs,
      selectedLayer1,
      selectedLayer2,
      selectedLayer3,
      selectedLayer4,
    ],
  );

  const finalLocation = useMemo(() => {
    if (!selectedLayer5) return null;
    return layerConfigs.find(
      (lc) =>
        lc.layer1 === selectedLayer1 &&
        lc.layer2 === selectedLayer2 &&
        lc.layer3 === selectedLayer3 &&
        lc.layer4 === selectedLayer4 &&
        lc.layer5 === selectedLayer5,
    );
  }, [
    layerConfigs,
    selectedLayer1,
    selectedLayer2,
    selectedLayer3,
    selectedLayer4,
    selectedLayer5,
  ]);

  const handleAssign = async () => {
    if (!finalLocation || !allocQty) {
      toast.error("Please select a complete location and enter quantity");
      return;
    }

    setIsSubmitting(true);
    try {
      // As per user instruction, use the assignment logic
      // Assuming a POST to a putaway creation endpoint exists or similar to Item Master
      // User said: "you need to check the item master like in that i already made location get from the location masters and all and i can be able to assign buddy here also"

      const payload = {
        header_id: Number(headerId),
        line_id: Number(lineId),
        location_id: finalLocation.id,
        allocated_qty: Number(allocQty),
        item_code: currentItem?.item_code,
        item_desc: currentItem?.item_desc,
        received_qty: currentItem?.received_qty,
        status: "1",
      };

      const response = await api.post("/gin/putaway_create/", payload);
      if (response.data.status) {
        toast.success("Location assigned successfully");
        fetchRecords();
        setActiveTab("view");
        // Reset assignment form
        setSelectedLayer1("");
        setSelectedLayer2("");
        setSelectedLayer3("");
        setSelectedLayer4("");
        setSelectedLayer5("");
        setAllocQty("");
      } else {
        toast.error(response.data.message || "Failed to assign location");
      }
    } catch (err) {
      toast.error("Error during assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  if (ginLoading || layersLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400 uppercase tracking-widest">
          Synchronizing Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER SECTION */}
      <Card className="border-0 shadow-sm rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-full h-12 w-12 border border-slate-200 bg-white shadow-sm active:scale-95 transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-black text-slate-900 uppercase">
                    {currentItem?.item_desc}
                  </h1>
                  <span className="text-blue-600/30 font-black">|</span>
                  <Badge className="bg-blue-600 text-white text-lg font-black text-[10px] px-3 py-1 rounded-lg">
                    {currentItem?.item_code}
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Manage Putaway Locations & Allocation Strategy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <div className="flex flex-col items-center px-4 border-r border-slate-200">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Recvd Qty
                </span>
                <span className="text-lg font-black text-slate-900">
                  {currentItem?.received_qty}
                </span>
              </div>
              <div className="flex flex-col items-center px-4">
                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                  Allocated
                </span>
                <span className="text-lg font-black text-blue-700">
                  {records.reduce((acc, curr) => acc + curr.allocated_qty, 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TAB SELECTOR - HIDDEN FOR REVIEW */}
      {/* 
      <div className="flex justify-center">
        <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl border border-slate-100 ring-4 ring-slate-50">
          <button
            onClick={() => setActiveTab("view")}
            className={`px-10 py-3.5 rounded-[1.5rem] label-bold uppercase tracking-[0.1em] text-[11px] transition-all flex items-center gap-3 ${activeTab === "view" ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Eye className="w-4 h-4" />
            Existing Records
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-10 py-3.5 rounded-[1.5rem] label-bold uppercase tracking-[0.1em] text-[11px] transition-all flex items-center gap-3 ${activeTab === "assign" ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Plus className="w-4 h-4" />
            Assign Location
          </button>
        </div>
      </div>
      */}

      {/* CONTENT AREA */}
      {activeTab === "view" ? (
        <Card className="border-0 shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Allocated Inventory Positions
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  Live tracking of inventory across warehouse layers
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingRecords ? (
              <div className="p-20 text-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
                <p className="mt-4 label-bold text-slate-400 uppercase tracking-widest">
                  Fetching location data...
                </p>
              </div>
            ) : records.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      SL
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Layer 1
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Layer 2
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Layer 3
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Layer 4
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Layer 5
                    </th>
                    <th className="px-5 py-4 text-right pr-8 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Allocated Qty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {records.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="hover:bg-blue-50/30 transition-all group border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-5 font-black text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-5 text-sm font-black text-slate-800 uppercase">
                        {r.locations?.layer1 || "---"}
                      </td>
                      <td className="px-5 py-5 text-sm font-black text-slate-700 uppercase">
                        {r.locations?.layer2 || "---"}
                      </td>
                      <td className="px-5 py-5 text-sm font-black text-blue-600 uppercase">
                        {r.locations?.layer3 || "---"}
                      </td>
                      <td className="px-5 py-5 text-sm font-black text-slate-600 uppercase">
                        {r.locations?.layer4 || "---"}
                      </td>
                      <td className="px-5 py-5 text-sm font-black text-indigo-600 uppercase">
                        {r.locations?.layer5 || "---"}
                      </td>
                      <td className="px-5 py-5 text-right pr-8">
                        <span className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl font-black text-sm shadow-sm shadow-emerald-100">
                          {r.allocated_qty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-300">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <Eye className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black text-slate-400 uppercase tracking-widest">
                    No existing allocations
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* ASSIGNMENT UI - HIDDEN FOR REVIEW */
        <div className="p-20 text-center flex flex-col items-center gap-4 text-slate-300">
          <Layers className="w-16 h-16 opacity-20" />
          <p className="label-bold uppercase tracking-widest">
            Assignment Mode Disabled for Review
          </p>
        </div>
      )}
    </div>
  );
};

export default PutawayLocationDetail;

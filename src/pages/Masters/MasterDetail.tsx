import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Package,
  Building2,
  Smartphone,
  ClipboardList,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchItemById } from "@/app/manager/itemManager";
import { handleGetWarehouseById } from "@/app/manager/warehouseManager";
import { handleFetchHSTById } from "@/app/manager/hstManager";

/**
 * High-Fidelity Master Data Auditing Page
 * Supports Items, Warehouses, and Handheld Terminals (HST)
 */
const MasterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type"); // 'item', 'warehouse', 'hst'

  const { currentItem, loading: itemLoading } = useAppSelector(
    (state) => state.item,
  );
  const { currentWarehouse, loading: warehouseLoading } = useAppSelector(
    (state) => state.warehouse,
  );
  const { currentHST, loading: hstLoading } = useAppSelector(
    (state) => state.hst,
  );

  useEffect(() => {
    if (!id) return;
    const numericId = parseInt(id);
    if (type === "item") dispatch(handleFetchItemById(numericId));
    if (type === "warehouse") dispatch(handleGetWarehouseById(numericId));
    if (type === "hst") dispatch(handleFetchHSTById(numericId));
  }, [id, type, dispatch]);

  const loading = itemLoading || warehouseLoading || hstLoading;

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400 uppercase tracking-widest">
          Synchronizing Master Audit...
        </p>
      </div>
    );
  }

  // Determine active item based on type
  let activeData: any = null;
  let title = "Master Audit";
  let subtitle = "Entity Detail View";
  let icon = <ClipboardList className="h-8 w-8 text-white" />;
  let themeColor = "bg-slate-900";
  let accentColor = "bg-blue-600";

  if (type === "item") {
    activeData = currentItem;
    title = "Item Master Insight";
    subtitle = `${activeData?.item_code || "Unknown SKU"}`;
    icon = <Package className="h-8 w-8 text-white" />;
    themeColor = "bg-slate-900";
    accentColor = "bg-blue-600";
  } else if (type === "warehouse") {
    activeData = currentWarehouse;
    title = "Facility Architecture";
    subtitle = `${activeData?.warehouse_code || "Main Node"}`;
    icon = <Building2 className="h-8 w-8 text-white" />;
    themeColor = "bg-slate-900";
    accentColor = "bg-emerald-600";
  } else if (type === "hst") {
    activeData = currentHST;
    title = "HST Node Configuration";
    subtitle = `${activeData?.device_id || "Peripheral"}`;
    icon = <Smartphone className="h-8 w-8 text-white" />;
    themeColor = "bg-slate-900";
    accentColor = "bg-indigo-600";
  }

  if (!activeData) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 opacity-40">
        <ShieldCheck className="h-20 w-20 text-slate-300" />
        <div className="text-center">
          <p className="text-xl font-black text-slate-900 uppercase">
            Audit Record Terminated
          </p>
          <p className="text-sm font-bold text-slate-400">
            The requested master entry does not exist or has been
            decommissioned.
          </p>
        </div>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="rounded-xl px-10 h-12 border-2"
        >
          Return to Catalog
        </Button>
      </div>
    );
  }

  // Transform object to flat list of values for the table
  const auditEntries: {
    label: string;
    value: any;
  }[] = [];

  if (type === "item") {
    auditEntries.push(
      { label: "Item Code", value: activeData.item_code },
      { label: "Description", value: activeData.item_description },
      { label: "Foreign Name", value: activeData.frgnname },
      { label: "Barcode", value: activeData.barcode },
      { label: "Group Code", value: activeData.itmsgrpcod },
      { label: "Warehouse ID", value: activeData.warehouse_id },
      { label: "Sell UOM", value: activeData.salunitmsr },
      { label: "Purchase UOM", value: activeData.purunitmsr },
      { label: "Inventory UOM", value: activeData.invntryuom },
      { label: "Current Stock", value: activeData.current_stock },
      { label: "Batch Number", value: activeData.batch_number },
      { label: "Batch Managed", value: activeData.manbtchnum === "Y" ? "YES" : "NO" },
      { label: "Serial Managed", value: activeData.mansernum === "Y" ? "YES" : "NO" },
      { label: "Active Status", value: activeData.active === "Y" ? "ENABLED" : "DISABLED" },
      { label: "Layer 1 (Zone)", value: activeData.layer1 },
      { label: "Layer 2 (Bay)", value: activeData.layer2 },
      { label: "Layer 3 (Rack)", value: activeData.layer3 },
      { label: "Layer 4 (Shelf)", value: activeData.layer4 },
      { label: "Layer 5 (Bin)", value: activeData.layer5 },
      { label: "Layer 6 (Sub-Bin)", value: activeData.layer6 }
    );
  } else if (type === "warehouse") {
    auditEntries.push(
      { label: "Warehouse Code", value: activeData.warehouse_code },
      { label: "Warehouse Name", value: activeData.warehouse_name },
      { label: "GST Number", value: activeData.gstnumber },
      { label: "BPL Name", value: activeData.bplname },
      { label: "BPL ID", value: activeData.bplid },
      { label: "Location", value: activeData.location },
      { label: "Block", value: activeData.block },
      { label: "Street", value: activeData.street },
      { label: "City", value: activeData.city },
      { label: "State", value: activeData.state },
      { label: "Zipcode", value: activeData.zipcode },
      { label: "Country", value: activeData.country },
      { label: "Active Status", value: activeData.inactive === "N" ? "ACTIVE" : "INACTIVE" }
    );
  } else if (type === "hst") {
    auditEntries.push(
      { label: "Device ID", value: activeData.device_id },
      { label: "Device Name", value: activeData.device_name },
      { label: "Device Type", value: activeData.device_type },
      { label: "Brand", value: activeData.brand_name },
      { label: "Serial Number", value: activeData.device_serial_number },
      { label: "Status", value: activeData.device_status === 0 ? "AVAILABLE" : "ASSIGNED" },
      { label: "Warehouse ID", value: activeData.warehouse_id },
      { label: "Layer 1 (Zone)", value: activeData.layer1 },
      { label: "Layer 2 (Bay)", value: activeData.layer2 },
      { label: "Layer 3 (Rack)", value: activeData.layer3 },
      { label: "Layer 4 (Shelf)", value: activeData.layer4 },
      { label: "Layer 5 (Bin)", value: activeData.layer5 },
      { label: "Layer 6 (Sub-Bin)", value: activeData.layer6 }
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-6 rounded-lg bg-white shadow-sm border-slate-200 font-bold text-slate-900 hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </div>
        </Button>
      </div>

      {/* Primary Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">Master Type:</span>
          <Badge
            className={`label-bold !tracking-wide px-4 py-1.5 rounded-xl border transition-all hover:scale-105 duration-300 ${accentColor} text-white border-0 shadow-sm`}
          >
            {title.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">Record ID:</span>
          <span className="text-[16px] font-black text-blue-600 font-mono tracking-tighter">
            #{id}
          </span>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">Entity Node:</span>
          <span className="text-[15px] font-black text-slate-500 uppercase tracking-tighter underline decoration-slate-200 underline-offset-4 decoration-2">
             {subtitle}
          </span>
        </div>
      </div>

      {/* Tabs Layout */}
      <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white mt-4">
        <CardContent className="p-0">
          <div className="flex border-b border-slate-100">
            <button className="px-8 py-4 text-sm font-black text-slate-900 border-b-2 border-slate-900 transition-all">
              Full Document Values
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-premium scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-[2000px]">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100 divide-x divide-slate-100">
                  {auditEntries.map((entry, idx) => (
                    <TableHead key={idx} className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <span className="tracking-tighter uppercase whitespace-nowrap">{entry.label}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors text-left divide-x divide-slate-50">
                  {auditEntries.map((entry, idx) => (
                    <td key={idx} className="px-4 py-6 text-sm font-bold text-slate-600 text-left whitespace-nowrap">
                        {entry.value === null || entry.value === "" || entry.value === undefined ? (
                          <span className="text-xs font-bold text-slate-300 italic uppercase">— NULL —</span>
                        ) : (
                          <span className={`${idx === 0 ? "text-blue-600 font-black" : "text-slate-900 font-black"} font-mono tracking-tighter`}>
                             {entry.value.toString()}
                          </span>
                        )}
                    </td>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterDetail;

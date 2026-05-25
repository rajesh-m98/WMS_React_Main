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
  Layers,
  MapPin,
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
import { handleFetchAllLayerConfigs } from "@/app/manager/locationManager";

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
  const { data: layerConfigs } = useAppSelector((state) => state.layerConfig);

  useEffect(() => {
    if (!id) return;
    const numericId = parseInt(id);
    if (type === "item") dispatch(handleFetchItemById(numericId));
    if (type === "warehouse") dispatch(handleGetWarehouseById(numericId));
    if (type === "hst") {
      dispatch(handleFetchHSTById(numericId));
      dispatch(handleFetchAllLayerConfigs(1));
    }
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
  let accentColor = "bg-blue-600";

  if (type === "item") {
    activeData = currentItem;
    title = "Item Master Insight";
    subtitle = `${activeData?.item_code || "Unknown SKU"}`;
    icon = <Package className="h-8 w-8 text-white" />;
    accentColor = "bg-blue-600";
  } else if (type === "warehouse") {
    activeData = currentWarehouse;
    title = "Facility Architecture";
    subtitle = `${activeData?.warehouse_code || "Main Node"}`;
    icon = <Building2 className="h-8 w-8 text-white" />;
    accentColor = "bg-emerald-600";
  } else if (type === "hst") {
    activeData = currentHST;
    title = "HST Node Configuration";
    subtitle = `${activeData?.device_id || "Peripheral"}`;
    icon = <Smartphone className="h-8 w-8 text-white" />;
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

  // Build flat audit entries
  const auditEntries: { label: string; value: any }[] = [];

  if (type === "item") {
    auditEntries.push(
      { label: "Item Code", value: activeData.item_code },
      { label: "Description", value: activeData.item_description },
      { label: "EAN Barcode", value: activeData.ean_barcode },
      // { label: "SAP Barcode", value: activeData.sap_barcode },
      { label: "Batch Number", value: activeData.batch_number },
      { label: "Open Quantity", value: activeData.open_quantity },
      {
        label: "Active Status",
        value:
          activeData.active === "Y"
            ? "Active"
            : activeData.active === "N"
              ? "Inactive"
              : activeData.active,
      },
      // { label: "Warehouse ID", value: activeData.warehouse_id },
    );
  } else if (type === "warehouse") {
    auditEntries.push(
      { label: "Warehouse Code", value: activeData.warehouse_Code },
      { label: "Warehouse Name", value: activeData.warehouse_Name },
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
      {
        label: "Active Status",
        value: activeData.inactive === "N" ? "ACTIVE" : "INACTIVE",
      },
    );
  } else if (type === "hst") {
    auditEntries.push(
      { label: "Device ID", value: activeData.id },
      { label: "Device Name", value: activeData.deviceName },
      { label: "Device Type", value: activeData.deviceType },
      { label: "Brand", value: activeData.brandName },
      { label: "Serial Number", value: activeData.deviceSerialNumber },
      {
        label: "Status",
        value: activeData.deviceStatus === 0 ? "Available" : "Assigned",
      },
      { label: "Warehouse ID", value: activeData.warehouseId },
    );
  }

  // Location rows for item type
  const locationRows: {
    location_id: number;
    total_capacity: number;
    available_capacity: number;
    warehouse_id: number | null;
    layer1: string | null;
    layer2: string | null;
    layer3: string | null;
    layer4: string | null;
    layer5: string | null;
    layer6: string | null;
    barcode: string;
  }[] =
    type === "item" && Array.isArray(activeData.location)
      ? activeData.location
      : [];

  // Location rows for HST type — resolve locationId → path via layerConfigs
  const hstLocationRows: {
    locationId: number;
    path: string;
    layer1: string;
    layer2: string;
    layer3: string;
    layer4: string;
    layer5: string;
  }[] =
    type === "hst" && Array.isArray(activeData.locations)
      ? (activeData.locations as number[]).map((locId) => {
          const cfg = layerConfigs.find((lc) => lc.id === locId);
          return {
            locationId: locId,
            path: cfg
              ? [cfg.layer1, cfg.layer2, cfg.layer3, cfg.layer4, cfg.layer5]
                  .filter(Boolean)
                  .join(" > ")
              : `Location #${locId}`,
            layer1: cfg?.layer1 || "—",
            layer2: cfg?.layer2 || "—",
            layer3: cfg?.layer3 || "—",
            layer4: cfg?.layer4 || "—",
            layer5: cfg?.layer5 || "—",
          };
        })
      : [];

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
          <span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">
            Master Type:
          </span>
          <Badge
            className={`label-bold !tracking-wide px-4 py-1.5 rounded-xl border-0 shadow-sm ${accentColor} text-white`}
          >
            {title.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">
            Record ID:
          </span>
          <span className="text-[12px] px-2 py-1 bg-blue-600 rounded-md text-white font-bold flex items-center justify-center">
            {id}
          </span>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900 uppercase tracking-tighter">
            Entity Node:
          </span>
          <span className="text-[15px] font-black text-slate-600 uppercase underline decoration-slate-200 underline-offset-4 decoration-2">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Core Fields Table */}
      <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white mt-4">
        <CardContent className="p-0">
          <div className="flex border-b border-slate-100 px-6 py-4 items-center gap-3">
            <ClipboardList className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Full Document Values
            </span>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-[1200px]">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100 divide-x divide-slate-100">
                  {auditEntries.map((entry, idx) => (
                    <TableHead
                      key={idx}
                      className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap bg-slate-50/50"
                    >
                      <span className="tracking-tighter uppercase whitespace-nowrap">
                        {entry.label}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors text-left divide-x divide-slate-50">
                  {auditEntries.map((entry, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-6 text-sm font-bold text-slate-600 text-left whitespace-nowrap"
                    >
                      {entry.value === null ||
                      entry.value === "" ||
                      entry.value === undefined ? (
                        <span className="text-xs font-bold text-slate-300 uppercase">
                          — NULL —
                        </span>
                      ) : (
                        <span
                          className={`${idx === 0 ? "text-blue-600 font-black" : "text-slate-900 font-black"}  tracking-tighter`}
                        >
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

      {/* Location Layers Table — only for item type */}
      {type === "item" && (
        <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="flex border-b border-slate-100 px-6 py-4 items-center gap-3">
              <Layers className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Assigned Locations &amp; Layer Config
              </span>
              <Badge className="ml-auto bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                {locationRows.length} Location
                {locationRows.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {locationRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <MapPin className="h-10 w-10 text-slate-200" />
                <p className="text-xs font-black uppercase tracking-widest">
                  No Locations Assigned
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        SL NO
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Barcode
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Zone (L1)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Aisle (L2)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Bay (L3)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Shelf (L4)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Bin (L5)
                      </TableHead>
                      {/* <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                        Floor (L6)
                      </TableHead> */}
                      <TableHead className="px-5 py-4 text-[11px] font-black text-blue-700 uppercase tracking-wider whitespace-nowrap text-right">
                        Total Cap.
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-emerald-700 uppercase tracking-wider whitespace-nowrap text-right">
                        Avail. Cap.
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationRows.map((row, idx) => {
                      const usedPct =
                        row.total_capacity > 0
                          ? Math.round(
                              ((row.total_capacity - row.available_capacity) /
                                row.total_capacity) *
                                100,
                            )
                          : 0;
                      return (
                        <TableRow
                          key={row.location_id}
                          className="border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/40 transition-all"
                        >
                          <TableCell className="px-5 py-4 text-[12px] font-black text-slate-700">
                            {idx + 1}
                          </TableCell>

                          <TableCell className="px-5 py-4 text-[12px] font-bold text-slate-600 whitespace-nowrap">
                            {row.barcode}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                            {row.layer1}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                            {row.layer2}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                            {row.layer3}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                            {row.layer4}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                            {row.layer5}
                          </TableCell>
                          {/* <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                            {row.layer6}
                          </TableCell> */}
                          <TableCell className="px-5 py-4 text-right whitespace-nowrap">
                            <span className="font-black text-blue-700 font-mono text-[13px]">
                              {row.total_capacity}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-black text-emerald-600 font-mono text-[13px]">
                                {row.available_capacity}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {usedPct}% used
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Location Assignments Table — for HST type */}
      {type === "hst" && (
        <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="flex border-b border-slate-100 px-6 py-4 items-center gap-3">
              <Layers className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                Assigned Locations
              </span>
              <Badge className="ml-auto bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                {hstLocationRows.length} Location
                {hstLocationRows.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {hstLocationRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                <MapPin className="h-10 w-10 text-slate-200" />
                <p className="text-xs font-black uppercase tracking-widest">
                  No Locations Assigned
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        SL NO
                      </TableHead>

                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Zone (L1)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Aisle (L2)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Bay (L3)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Shelf (L4)
                      </TableHead>
                      <TableHead className="px-5 py-4 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Bin (L5)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hstLocationRows.map((row, idx) => (
                      <TableRow
                        key={row.locationId}
                        className="border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/40 transition-all"
                      >
                        <TableCell className="px-5 py-4 text-[12px] font-black text-slate-400">
                          {idx + 1}
                        </TableCell>

                        <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                          {row.layer1}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                          {row.layer2}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                          {row.layer3}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                          {row.layer4}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-[13px] font-black text-slate-800 whitespace-nowrap">
                          {row.layer5}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MasterDetail;

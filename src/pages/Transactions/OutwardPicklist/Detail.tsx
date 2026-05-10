import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  ChevronLeft,
  Barcode,
  LayoutGrid,
  Database,
  Hash,
  Clock,
  Activity,
  Box,
  MapPin,
  Package,
} from "lucide-react";
import { GENERATED_PICKLIST_DATA } from "./MockData";
import { toast } from "sonner";

const OutwardPicklistDetail = () => {
  const { docEntry } = useParams();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  const activeLines = GENERATED_PICKLIST_DATA.filter(
    (l) => l.doc_entry === Number(docEntry),
  );

  const handleDispatch = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Picklist Generated Successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* High-Density Header with Scanning Controls */}
      <Card className="border-0 shadow-lg rounded-[2rem] bg-white border border-slate-100">
        <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 p-0"
              onClick={() => navigate("/transactions/outward-picklist")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                Generate Picklist
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                Verification & Stock Allocation
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-4 max-w-3xl">
            <div className="relative flex-1 group">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Scan Bin Barcode..."
                className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white text-xs font-black uppercase tracking-wider"
              />
            </div>
            <div className="relative flex-1 group">
              <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Scan Item EAN..."
                className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white text-xs font-black uppercase tracking-wider"
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                placeholder="Qty"
                className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white text-sm font-black text-center"
              />
            </div>
            <Button className="h-12 px-8 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100">
              Entry
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl border-slate-200 text-slate-400 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest"
              onClick={() => navigate("/transactions/outward-picklist")}
            >
              Cancel
            </Button>
            <Button
              className="h-12 px-10 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95"
              onClick={handleDispatch}
              disabled={isSyncing}
            >
              Confirm Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* High-Density Data Table */}
      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-none">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100 h-16">
                  <TableHead className="pl-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    ID
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    DOC ENTRY
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    LINE
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    ITEM CODE
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    DESCRIPTION
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    LOCATION
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    QTY
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    WHS CODE
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    CARTON BARCODE
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    CREATED
                  </TableHead>
                  <TableHead className="pr-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    UPDATED
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLines.map((line) => (
                  <TableRow
                    key={line.id}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-all duration-300"
                  >
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-slate-300" />
                        <span className="text-[11px] font-black text-slate-400">
                          #0{line.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-black text-slate-900">
                        {line.doc_entry}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {line.line_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                        {line.item_code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tighter truncate max-w-[200px]">
                          {line.item_desc}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          Inventory Material
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="h-3 w-3 text-amber-500" />
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                          {line.location_id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-black text-slate-900">
                        {line.qty}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {line.Whscode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Package className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-black underline decoration-indigo-200 tracking-tighter">
                          {line.carton_barcode}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-500">
                            {new Date(line.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">
                          {new Date(line.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          <Activity className="h-2.5 w-2.5 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-500">
                            {new Date(line.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">
                          {new Date(line.updated_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Warehouse Node Online
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Active Lines: {activeLines.length}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button className="h-10 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 font-black text-[10px] uppercase tracking-widest px-6 transition-all">
                Export PDF
              </Button>
              <Button className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-lg shadow-indigo-100 transition-all">
                Sync Registry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutwardPicklistDetail;

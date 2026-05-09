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
  Truck,
  RefreshCw,
  Box,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Database,
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
        <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 p-0"
              onClick={() => navigate("/transactions/gin/picklist")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                Generated Picklist
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Picking & Verification Workflow
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Scan Bin..."
                className="h-10 pl-10 rounded-xl bg-slate-50 border-transparent focus:bg-white text-xs font-bold"
              />
            </div>
            <div className="relative flex-1">
              <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Scan Item..."
                className="h-10 pl-10 rounded-xl bg-slate-50 border-transparent focus:bg-white text-xs font-bold"
              />
            </div>
            <Input
              type="number"
              placeholder="Qty"
              className="h-10 w-20 rounded-xl bg-slate-50 border-transparent focus:bg-white text-xs font-bold text-center"
            />
            <Button className="h-10 px-4 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all">
              Add
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 font-black text-[9px] uppercase tracking-widest"
              onClick={() => toast.error("Cancelled")}
            >
              Cancel
            </Button>
            <Button
              className="h-10 px-6 rounded-xl bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-slate-200"
              onClick={handleDispatch}
              disabled={isSyncing}
            >
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* High-Density Data Table */}
      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white border border-slate-100">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-100">
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    ID
                  </TableHead>
                  <TableHead className="py-4 px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
                    Entry
                  </TableHead>
                  <TableHead className="py-4 px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
                    Line
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Item Code
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Description
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
                    Location
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
                    Qty
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Whs
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Carton
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
                    Status
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Sync Msg
                  </TableHead>
                  <TableHead className="py-4 px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">
                    S/S
                  </TableHead>
                  <TableHead className="py-4 px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Sync Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLines.map((line) => (
                  <TableRow
                    key={line.id}
                    className="border-b border-slate-50 hover:bg-blue-50/30 transition-all group"
                  >
                    <TableCell className="py-3 px-4 text-[11px] font-black text-slate-400 font-mono">
                      {line.id}
                    </TableCell>
                    <TableCell className="py-3 px-2 text-center text-[11px] font-black text-slate-900">
                      {line.doc_entry}
                    </TableCell>
                    <TableCell className="py-3 px-2 text-center text-[11px] font-black text-blue-600">
                      {line.line_id}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {line.item_code}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-[11px] font-black text-slate-700 truncate max-w-[150px]">
                      {line.item_desc}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] font-black px-2 py-0">
                        {line.location_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center text-sm font-black text-slate-900">
                      {line.qty}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-[10px] font-black text-slate-500 uppercase">
                      {line.Whscode}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-[11px] font-black text-indigo-600 underline decoration-indigo-200">
                      {line.carton_barcode}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">
                        {line.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-[10px] font-bold text-slate-400 truncate max-w-[100px]">
                      {line.sync_message}
                    </TableCell>
                    <TableCell className="py-3 px-2 text-center">
                      <Badge
                        className={`text-[9px] font-black ${line.sync_status === "Y" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {line.sync_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-[10px] font-medium text-slate-400 tabular-nums">
                      {line.sync_date.split("T")[0]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  System Online
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Total Lines: {activeLines.length}
                </span>
              </div>
            </div>
            <Button className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest px-4">
              Update Registry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutwardPicklistDetail;

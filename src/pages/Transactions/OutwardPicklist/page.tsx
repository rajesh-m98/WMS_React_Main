import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Search,
  ClipboardList,
  RefreshCw,
  ArrowRightCircle,
  Clock,
  Calendar,
  Hash,
  Activity
} from "lucide-react";
import { OUTWARD_PICKLIST_HEADERS } from "./MockData";

const OutwardPicklistPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHeaders = OUTWARD_PICKLIST_HEADERS.filter(
    (h) =>
      h.DocNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.NumAtCard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Outward Picklist
          </h1>
          <p className="text-slate-500 font-bold flex items-center gap-2 mt-1 uppercase text-[10px] tracking-widest opacity-60">
            <ClipboardList className="h-3 w-3 text-blue-600" />
            Warehouse Distribution & Order Fulfillment
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search Doc Num / PO Ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 w-[350px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-xs font-black uppercase tracking-wider"
            />
          </div>
          <Button className="h-12 w-12 rounded-xl bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-200 p-0">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* High Density Table List */}
      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-none">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100 h-16">
                  <TableHead className="pl-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GRPO ENTRY</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DOC ENTRY</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DOC NUMBER</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TYPE</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OBJ</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DATE</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PO REF</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CREATED</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UPDATED</TableHead>
                  <TableHead className="pr-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHeaders.map((header) => (
                  <TableRow key={header.id} className="group border-b border-slate-50 hover:bg-blue-50/30 transition-all duration-300">
                    <TableCell className="pl-8">
                       <div className="flex items-center gap-2">
                          <Hash className="h-3 w-3 text-slate-300" />
                          <span className="text-xs font-black text-slate-400">#0{header.id}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                         {header.grpo_docentry}
                       </span>
                    </TableCell>
                    <TableCell>
                       <span className="text-xs font-black text-slate-900">
                         {header.DocEntry}
                       </span>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight">{header.DocNum}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">System Document</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         {header.DocType}
                       </span>
                    </TableCell>
                    <TableCell>
                       <span className="text-[10px] font-bold text-slate-400">
                         {header.ObjType}
                       </span>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-slate-300" />
                          <span className="text-xs font-bold text-slate-700">{header.DocDate}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">
                         {header.NumAtCard}
                       </span>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">
                            {new Date(header.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                          <Activity className="h-3 w-3 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">
                            {new Date(header.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       <Button
                         size="sm"
                         className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest h-10 px-4 group/btn transition-all shadow-lg shadow-blue-100"
                         onClick={() => navigate(`/transactions/outward-picklist/${header.DocEntry}`)}
                       >
                         Generate
                         <ArrowRightCircle className="h-3.5 w-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutwardPicklistPage;

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Calendar,
  FileText,
  Loader2,
  PackageSearch,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchOutwardRequests,
  handleGeneratePicklist,
} from "@/app/manager/requestManager";
import { toast } from "sonner";

import { OUTWARD_PICKLIST_HEADERS } from "../OutwardPicklist/MockData";

const OutwardListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const loading = false; // Mock loading state

  const filteredItems = OUTWARD_PICKLIST_HEADERS.filter(
    (item) =>
      item.DocNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.NumAtCard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.DocType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-10">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400 group-hover:text-blue-500 transition-colors" />
            <Input
              placeholder="Search by Doc #, Reference or Transaction Type..."
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl border border-slate-200 body-strong text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <RefreshCw className="icon-sm mr-2" />
              REFRESH
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="p-5 text-[11px] font-black text-black uppercase tracking-widest">
                  ID
                </TableHead>
                <TableHead className="p-5 text-[11px] font-black text-black uppercase tracking-widest text-center">
                  Doc Entry
                </TableHead>
                <TableHead className="p-5 text-[11px] font-black text-black uppercase tracking-widest text-center">
                  Doc Num
                </TableHead>
                <TableHead className="p-5 text-[11px] font-black text-black uppercase tracking-widest text-center">
                  Obj Type
                </TableHead>
                <TableHead className="p-5 text-[11px] font-black text-black uppercase tracking-widest">
                  NumAtCard
                </TableHead>
                <TableHead className="p-5 text-center text-[11px] font-black text-black uppercase tracking-widest">
                  Doc Date
                </TableHead>
                <TableHead className="p-5 text-center text-[11px] font-black text-black uppercase tracking-widest">
                  Doc Type
                </TableHead>
                <TableHead className="p-5 text-right pr-10 text-[11px] font-black text-black uppercase tracking-widest">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-indigo-50 hover:bg-blue-600/5 transition-all duration-300 group cursor-default"
                >
                  <td className="p-5 text-sm font-black text-black font-mono">
                    {item.id}
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-black h-7 px-4 bg-indigo-50 border-indigo-100 text-indigo-700 rounded-lg"
                      >
                        {item.DocEntry}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-5 text-center text-[13px] font-black text-black tabular-nums">
                    {item.DocNum}
                  </td>
                  <td className="p-5 text-center text-[13px] font-black text-blue-600 tabular-nums">
                    {item.ObjType}
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {item.NumAtCard}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center text-xs font-black text-slate-700">
                      {item.DocDate}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center">
                      <Badge className="bg-slate-900 text-white border-0 font-black uppercase text-[9px] px-4 py-2 rounded-xl shadow-lg shadow-slate-200 tracking-[0.05em] whitespace-nowrap">
                        {item.DocType}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-5 text-right pr-10">
                    <Button
                      onClick={() => navigate(`/transactions/gin/picklist/${item.DocEntry}`)}
                      className="h-10 px-6 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95 group/btn"
                    >
                      Generate
                    </Button>
                  </td>
                </tr>
              ))}
            </TableBody>
          </Table>

          {/* Footer with Stats */}
          <div className="p-6 border-t border-indigo-50/50 flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-50/10">
            <div className="flex items-center gap-3">
              <Badge className="h-10 px-6 rounded-2xl border-blue-200 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                TOTAL TRANSACTIONS: {filteredItems.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutwardListPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Separator,
} from "@/components/ui";
import {
  Search,
  Box,
  ChevronRight,
  ClipboardList,
  RefreshCw,
  Zap,
  ArrowRightCircle,
  Clock,
  Store,
} from "lucide-react";
import { OUTWARD_PICKLIST_HEADERS, OUTWARD_PICKLIST_LINES } from "./MockData";

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
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Outward Picklist
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
            <ClipboardList className="h-4 w-4 text-blue-600" />
            Manage sales order picking & warehouse distribution
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search Doc Num / PO Ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3 w-[300px] rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold"
            />
          </div>
          <Button className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 p-0">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredHeaders.map((header) => {
          const lines = OUTWARD_PICKLIST_LINES.filter(
            (l) => l.DocEntry === header.DocEntry
          );

          return (
            <Card
              key={header.id}
              className="border-0 shadow-xl rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl transition-all group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section: Document Meta */}
                  <div className="lg:w-1/4 p-8 bg-slate-50/50 border-r border-slate-100 space-y-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white border-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                          Doc Entry: {header.DocEntry}
                        </Badge>
                        <Badge className="bg-slate-200 text-slate-600 border-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                          {header.DocType}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {header.DocNum}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Doc Date
                          </p>
                          <p className="text-xs font-black text-slate-700">
                            {header.DocDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            PO Reference
                          </p>
                          <p className="text-xs font-black text-slate-700 uppercase">
                            {header.NumAtCard}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-3 group/btn transition-all active:scale-95"
                      onClick={() => navigate(`/transactions/outward-picklist/${header.DocEntry}`)}
                    >
                      <ArrowRightCircle className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      Generate Picklist
                    </Button>
                  </div>

                  {/* Right Section: Line Preview */}
                  <div className="lg:w-3/4 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-1 bg-amber-500 rounded-full" />
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                          Items to Pick ({lines.length})
                        </h4>
                      </div>
                      <div className="h-px flex-1 bg-slate-100 mx-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lines.map((line) => (
                        <div
                          key={line.Id}
                          className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group/line hover:border-blue-400 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600">
                              <Box className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-sm font-black text-slate-900">
                                {line.ItemCode}
                              </p>
                              <p className="text-[11px] font-bold text-slate-400 uppercase truncate max-w-[200px]">
                                {line.Name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-slate-900">
                              {line.Quantity}
                            </p>
                            <div className="flex items-center gap-1 text-slate-400 justify-end">
                              <Store className="h-3 w-3" />
                              <span className="text-[9px] font-black uppercase tracking-tighter">
                                {line.WhsCode}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OutwardPicklistPage;

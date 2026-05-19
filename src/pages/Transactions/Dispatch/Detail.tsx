import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Package,
  Calendar,
  Box,
  ClipboardCheck,
  User,
  Clock,
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
import { useAppSelector } from "@/app/store";

export const DispatchDetail = () => {
  const { whsCode } = useParams<{ whsCode: string }>();
  const navigate = useNavigate();
  const { data: storeData, loading } = useAppSelector(
    (state) => state.dispatch,
  );

  const warehouseItems = useMemo(() => {
    const filtered = storeData.filter((item) => String(item.whscode) === String(whsCode));
    const uniqueMap = new Map();
    
    filtered.forEach((item) => {
      // Deduplicate identical rows using a composite key of visible data
      const key = `${item.item_code}_${item.grpo_doc_entry}_${item.outward_header_id}_${item.qty}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [storeData, whsCode]);

  const whsName = warehouseItems[0]?.whsname || "Mylapore - Sannadhi Street";

  const getStatusBadge = (status: number | null) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-emerald-500 text-white border-0 font-black uppercase text-[9px] px-3 py-1 rounded-lg">
            DISPATCHED
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-amber-500 text-white border-0 font-black uppercase text-[9px] px-3 py-1 rounded-lg">
            PENDING
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-rose-600 text-white border-0 font-black uppercase text-[9px] px-3 py-1 rounded-lg">
            CANCELLED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="font-black text-[9px] px-3 py-1 rounded-lg"
          >
            UNKNOWN
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400">
          Loading Dispatch Details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {whsName} <span className="text-blue-600">Items</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
            WHS CODE: {whsCode}
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-2 border-slate-900/10">
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    SL NO
                  </TableHead>
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                    PO NO
                  </TableHead>
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                    GRPO NO
                  </TableHead>
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Item Name
                  </TableHead>
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Item Code
                  </TableHead>
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Type
                  </TableHead>
                  <TableHead className="px-6 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                    Created At
                  </TableHead>
                  <TableHead className="px-6 py-6 text-right text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouseItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <Box className="h-20 w-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase">
                          No Items Found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  warehouseItems.map((item, idx) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-all border-b border-slate-100 group"
                    >
                      <td className="px-6 py-6 font-black text-slate-900 text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-6 font-black text-slate-800 text-xs uppercase">
                        {item.outward_header_id
                          ? item.outward_header_id
                          : "---"}
                      </td>
                      <td className="px-6 py-6">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[10px]"
                        >
                          {item.grpo_doc_entry || "---"}
                        </Badge>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">
                          {item.item_name}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          {item.item_code}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <ClipboardCheck
                            className={`w-3.5 h-3.5 ${item.dispatch_type === 2 ? "text-indigo-500" : "text-emerald-500"}`}
                          />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            {item.dispatch_type === 2
                              ? "Picklist"
                              : item.dispatch_type === 1
                                ? "Flowthrough"
                                : "---"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span className="text-[10px] font-black">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-bold">
                              {formatTime(item.created_at)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {getStatusBadge(item.status)}
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchDetail;

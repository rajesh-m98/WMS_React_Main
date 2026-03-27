import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { ArrowLeft, ChevronRight } from "lucide-react";

const DUMMY_DETAIL_LINES = [
  {
    docEntry: "8",
    lineId: "0",
    itemCode: "100001",
    item: "Acrylic Stand",
    whsCode: "AngrEast",
    allocated: 45,
    completed: 0,
    remaining: 45,
  },
  {
    docEntry: "12",
    lineId: "1",
    itemCode: "400002",
    item: "Industrial Rack - Black",
    whsCode: "AngrEast",
    allocated: 100,
    completed: 100,
    remaining: 0,
  },
];

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-6 rounded-lg bg-white shadow-sm border-slate-200 font-bold text-slate-900 hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      {/* Primary Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black text-slate-900">
            Picklist Id:
          </span>
          <span className="text-[15px] font-bold text-slate-500">
            {id || "PL009"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black text-slate-900">Status:</span>
          <Badge
            variant="secondary"
            className="bg-amber-100/50 text-amber-600 label-bold px-3 py-1 rounded-full"
          >
            Pending
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black text-slate-900">
            Created At:
          </span>
          <span className="text-[15px] font-bold text-slate-500">
            25-03-2026, 15:57:44
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-black text-slate-900">
            Assigned To:
          </span>
          <span className="text-[15px] font-bold text-slate-500">
            Giri Admin (giri@admin.in)
          </span>
        </div>
      </div>

      {/* Tabs Layout */}
      <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white mt-4">
        <CardContent className="p-0">
          <div className="flex border-b border-slate-100">
            <button className="px-8 py-4 text-sm font-black text-slate-900 border-b-2 border-slate-900 transition-all">
              All
            </button>
            <button className="px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">
              Pending
            </button>
            <button className="px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">
              Completed
            </button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="font-black text-slate-900 px-8 py-6 text-[13px] tracking-tight">
                    DocEntry
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight">
                    Lineld
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight">
                    ItemCode
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight">
                    Item
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight">
                    WhsCode
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight text-right">
                    Allocated
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight text-right">
                    Completed
                  </TableHead>
                  <TableHead className="font-black text-slate-900 py-6 text-[13px] tracking-tight text-right pr-8">
                    Remaining
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_DETAIL_LINES.map((row, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors"
                  >
                    <td className="px-8 py-6 text-sm font-bold text-slate-600 tabular-nums">
                      {row.docEntry}
                    </td>
                    <td className="py-6 text-sm font-bold text-slate-600 tabular-nums">
                      {row.lineId}
                    </td>
                    <td className="py-6 text-sm font-black text-blue-600 tabular-nums uppercase">
                      {row.itemCode}
                    </td>
                    <td className="py-6 text-sm font-bold text-slate-700">
                      {row.item}
                    </td>
                    <td className="py-6 text-sm font-bold text-slate-500">
                      {row.whsCode}
                    </td>
                    <td className="py-6 text-sm font-black text-slate-900 text-right tabular-nums">
                      {row.allocated}
                    </td>
                    <td className="py-6 text-sm font-black text-emerald-600 text-right tabular-nums">
                      {row.completed}
                    </td>
                    <td className="py-6 text-sm font-black text-slate-400 text-right tabular-nums pr-8">
                      {row.remaining}
                    </td>
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

export default TaskDetail;

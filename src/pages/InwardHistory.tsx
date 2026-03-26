import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Eye,
  Download,
  FileSpreadsheet,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchInwardHistory } from "@/app/store/historySlice";

const statusMap: Record<number, { label: string; className: string }> = {
  1: {
    label: "Assigned",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  2: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
  },
  3: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  4: {
    label: "Reassigned",
    className: "bg-warning/10 text-warning border-warning/20",
  },
};

const PAGE_SIZE = 10;

const InwardHistory = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading, totalCount } = useAppSelector(
    (state) => state.history.inward,
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInwardHistory({ page, size: PAGE_SIZE }));
  }, [dispatch, page]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-end mb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => toast.info("Exporting Excel...")}
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => toast.info("Exporting PDF...")}
          >
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>
      <Card className="border-0 shadow-sm rounded-xl relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="pl-6">Task ID</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-slate-400 font-medium whitespace-nowrap"
                  >
                    No inward history records found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const s = statusMap[row.status] || statusMap[1];
                  return (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="font-medium pl-6">
                        {row.id}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 font-bold"
                        >
                          {row.items}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-bold px-2.5 py-0.5 ${s.className}`}
                        >
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {row.notes || "—"}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium">
                        {row.createdAt}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:bg-blue-50 h-8 w-18 gap-1 font-bold"
                          onClick={() =>
                            navigate(`/transactions/putaway-inward/${row.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-sm font-medium text-slate-400">
          Showing{" "}
          <span className="text-slate-900">
            {data.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-slate-900">
            {Math.min(page * PAGE_SIZE, totalCount)}
          </span>{" "}
          of <span className="text-slate-900">{totalCount}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4"
            disabled={page * PAGE_SIZE >= totalCount || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InwardHistory;

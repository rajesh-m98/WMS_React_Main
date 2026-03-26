import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Checkbox } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  UserPlus,
  ClipboardList,
  CheckCircle2,
  Clock,
  Users,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchOutwardPickLists, setAssigning } from "@/app/store/picklistSlice";
import api from "@/lib/api";

const statusMap: Record<
  number,
  { label: string; className: string; icon: any }
> = {
  1: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock,
  },
  2: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    icon: Users,
  },
  3: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckCircle2,
  },
};

const PAGE_SIZE = 10;

const OutwardPickList = () => {
  const dispatch = useAppDispatch();
  const { data, loading, totalCount } = useAppSelector(
    (state) => state.picklist.outward,
  );
  const isAssigning = useAppSelector((state) => state.picklist.isAssigning);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [workerId, setWorkerId] = useState("");

  const fetchPicklists = () => {
    dispatch(
      fetchOutwardPickLists({ page, size: PAGE_SIZE, search: debouncedSearch }),
    );
  };

  useEffect(() => {
    fetchPicklists();
  }, [dispatch, page, debouncedSearch]);

  const toggleRow = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === data.length) setSelected(new Set());
    else setSelected(new Set(data.map((r) => r.id)));
  };

  const handleAssign = async () => {
    dispatch(setAssigning(true));
    try {
      const response = await api.post("/api/taskList/assign_tasks", {
        taskIds: Array.from(selected),
        userId: workerId,
      });

      if (response.data.status) {
        toast.success("Outward Picklists assigned successfully");
        setIsAssignOpen(false);
        setSelected(new Set());
        fetchPicklists();
      }
    } catch (error) {
      toast.error("Assignment failed");
    } finally {
      dispatch(setAssigning(false));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-end mb-4">
        <div className="flex gap-2">
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={selected.size === 0 || loading}
                className="h-9 gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-blue-200/50 shadow-lg px-6 font-bold text-sm transition-all active:scale-95"
              >
                <UserPlus className="h-4.5 w-4.5" />
                Assign Selected ({selected.size})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Picker/Worker</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {selected.size}
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    Assigning {selected.size} picklists to worker
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Select User (Searchable)
                  </Label>
                  <Select onValueChange={setWorkerId}>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all h-10">
                      <SelectValue placeholder="Search and select worker..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="w1">Rahul Sharma (Picker)</SelectItem>
                      <SelectItem value="w2">Amit Kumar (Picker)</SelectItem>
                      <SelectItem value="w3">
                        Priya Singh (Super User)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t mt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl px-6"
                    onClick={() => setIsAssignOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8"
                    onClick={handleAssign}
                    disabled={isAssigning || !workerId}
                  >
                    {isAssigning ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Picklist No or Doc Entry..."
                className="pl-11 h-12 rounded-xl bg-slate-50/30 border-slate-200 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-blue-50 focus-visible:border-blue-500 transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-14 text-center">
                  <Checkbox
                    checked={data.length > 0 && selected.size === data.length}
                    onCheckedChange={toggleAll}
                    disabled={loading || data.length === 0}
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Picklist No
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Doc Entry
                </TableHead>
                <TableHead className="text-center font-bold text-slate-900">
                  Items
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Status
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Created At
                </TableHead>
                <TableHead className="text-right pr-6 font-bold text-slate-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-slate-400 font-medium"
                  >
                    No outward picklists found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => {
                  const s = statusMap[row.status] || statusMap[1];
                  const Icon = s.icon;
                  return (
                    <TableRow
                      key={row.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selected.has(row.id)}
                          onCheckedChange={() => toggleRow(row.id)}
                        />
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">
                        {row.picklistid}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {row.docentry}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 px-2.5 py-0.5 font-bold"
                        >
                          {row.items}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`gap-1.5 px-3 py-1 rounded-lg font-bold ${s.className}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {s.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium">
                        {row.createdAt}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-blue-600 font-bold hover:bg-blue-50"
                        >
                          View Details
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

export default OutwardPickList;

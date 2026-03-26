import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Textarea } from "@/components/ui";
import {
  ChevronLeft,
  ClipboardList,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchTaskById, clearCurrentTask } from "@/app/store/historySlice";
import api from "@/lib/api";

const statusMap: Record<number, { label: string; className: string }> = {
  1: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 border-blue-100",
  },
  2: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  3: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border-rose-100",
  },
  4: {
    label: "Reassigned",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    summary: taskSummary,
    items: taskItems,
    loading,
  } = useAppSelector((state) => state.history.currentTask);

  const [activeTab, setActiveTab] = useState("all");
  const [isReassigning, setIsReassigning] = useState(false);
  const [reassignUserId, setReassignUserId] = useState("");
  const [reassignReason, setReassignReason] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [dispatch, id]);

  const handleReassign = async () => {
    try {
      const response = await api.post("/api/taskList/reassign_task", {
        taskId: Number(id),
        userId: reassignUserId,
        reason: reassignReason,
      });
      if (response.data.status) {
        toast.success(`Task ${id} successfully reassigned`);
        setIsReassigning(false);
        dispatch(fetchTaskById(Number(id)));
      }
    } catch (error) {
      toast.error("Reassignment failed");
    }
  };

  if (loading && !taskSummary) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
            Fetching Task Context...
          </p>
        </div>
      </div>
    );
  }

  if (!taskSummary) return null;

  const status = statusMap[taskSummary.status] || statusMap[1];

  const filteredItems = taskItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return item.status === 1;
    if (activeTab === "completed") return item.status === 2;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-slate-100 h-10 w-10 border border-slate-100"
          >
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-bold h-10 border-slate-200"
            disabled={taskSummary.status === 2}
            onClick={() => setIsReassigning(!isReassigning)}
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reassign Task
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold h-10">
            Export Task
          </Button>
        </div>
      </div>

      {isReassigning && (
        <Card className="border-2 border-amber-100 bg-amber-50/30 rounded-2xl overflow-hidden shadow-sm animate-in slide-in-from-top-4">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900">
                  Task Reassignment
                </h3>
                <p className="text-sm text-amber-700 font-medium">
                  Redirect this task to another active worker or picker.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-amber-900 font-bold">
                  Assign To (Worker)
                </Label>
                <Select onValueChange={setReassignUserId}>
                  <SelectTrigger className="rounded-xl border-amber-200 bg-white">
                    <SelectValue placeholder="Search available workers..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-amber-100">
                    <SelectItem value="w1">Rahul Sharma (Picker)</SelectItem>
                    <SelectItem value="w2">Amit Kumar (Picker)</SelectItem>
                    <SelectItem value="w3">Priya Singh (Super User)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-amber-900 font-bold">
                  Reason for Reassignment
                </Label>
                <Textarea
                  className="rounded-xl border-amber-200 bg-white resize-none"
                  placeholder="Provide context for the next person..."
                  rows={1}
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-amber-100">
              <Button
                variant="ghost"
                className="text-amber-700 font-bold"
                onClick={() => setIsReassigning(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl px-8"
                onClick={handleReassign}
                disabled={!reassignUserId}
              >
                Execute Reassignment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Status
          </p>
          <div className="flex pt-1">
            <Badge
              className={`rounded-lg px-3 py-1 font-bold ${status.className}`}
            >
              {status.label}
            </Badge>
          </div>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Picklist ID
          </p>
          <p className="text-base font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-blue-600" />{" "}
            {taskSummary.picklistid}
          </p>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Created At
          </p>
          <p className="text-base font-bold text-slate-700 flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" /> {taskSummary.createdAt}
          </p>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Assigned Worker
          </p>
          <p className="text-base font-bold text-slate-700 flex items-center gap-2 truncate">
            <User className="h-4 w-4 text-slate-400" />{" "}
            {taskSummary.userId || "Not Assigned"}
          </p>
        </Card>
      </div>

      {/* Tabs & Items */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
        )}
        <div className="px-6 pt-6 flex items-center justify-between border-b">
          <Tabs
            defaultValue="all"
            className="w-[400px]"
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-slate-50 border border-slate-100 p-1 mb-[-1px] rounded-t-xl rounded-b-none h-11 border-b-white">
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-bold"
              >
                All Items
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-none font-bold"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-none font-bold"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> Finished:{" "}
              {taskItems.filter((i) => i.status === 2).length}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-4">
              <div className="w-2 h-2 rounded-full bg-amber-500" /> Pending:{" "}
              {taskItems.filter((i) => i.status === 1).length}
            </div>
          </div>
        </div>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead className="font-bold text-slate-900 pl-6">
                  Doc Entry
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Line ID
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Item Code
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Whs Code
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-right">
                  Allocated
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-right">
                  Completed
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-right pr-6">
                  Remaining
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-40 text-center text-slate-400 font-medium"
                  >
                    No items in this category
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="font-bold text-slate-800 pl-6">
                      {item.DocEntry}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {item.LineId}
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {item.ItemCode}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {item.WhsCode}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-400">
                      {item.AllocatedQty}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-lg font-black ${item.CompletedQty === item.AllocatedQty ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}
                      >
                        {item.CompletedQty}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {item.RemainingQty > 0 ? (
                        <span className="text-amber-600 font-black">
                          {item.RemainingQty}
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;

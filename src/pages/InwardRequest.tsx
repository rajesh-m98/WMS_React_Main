import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Checkbox } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ArrowRight,
  PackageCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchInwardRequests, setGenerating } from "@/app/store/requestSlice";
import api from "@/lib/api";

const PAGE_SIZE = 10;

const InwardRequest = () => {
  const dispatch = useAppDispatch();
  const { data, loading, totalCount } = useAppSelector(
    (state) => state.request.inward,
  );
  const isGenerating = useAppSelector((state) => state.request.isGenerating);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Local state for quantity overrides before dispatching to API
  const [localData, setLocalData] = useState<any[]>([]);

  useEffect(() => {
    dispatch(
      fetchInwardRequests({
        page,
        size: PAGE_SIZE,
        search: debouncedSearch,
        from_date: fromDate,
        to_date: toDate,
      }),
    );
  }, [dispatch, page, debouncedSearch, fromDate, toDate]);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const toggleAll = () => {
    if (selected.size === localData.length) setSelected(new Set());
    else setSelected(new Set(localData.map((r) => r.id)));
  };

  const toggleRow = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const updateQty = (id: number, val: number) => {
    setLocalData((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, putQty: Math.max(0, Math.min(val, r.availableQty)) }
          : r,
      ),
    );
  };

  const executeGenerate = async () => {
    dispatch(setGenerating(true));
    const selectedRows = localData.filter((r) => selected.has(r.id));

    try {
      const response = await api.post("/api/picklist/create_picklist", {
        picklist_type: 1,
        picklistitems: selectedRows.map((r) => ({
          id: r.id,
          itemcode: r.itemcode,
          qty: r.putQty,
          whscode: r.whscode,
        })),
      });

      if (response.data.status) {
        toast.success("Inward Picklist successfully created");
        setSelected(new Set());
        setIsConfirmOpen(false);
        dispatch(
          fetchInwardRequests({
            page,
            size: PAGE_SIZE,
            search: debouncedSearch,
            from_date: fromDate,
            to_date: toDate,
          }),
        );
      } else {
        toast.error(response.data.message || "Failed to create picklist");
      }
    } catch (error) {
      toast.error("Failed to generate picklist");
    } finally {
      dispatch(setGenerating(false));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Filters Area */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Doc Num, Item, or Customer..."
                className="pl-11 h-12 rounded-xl bg-slate-50/30 border-slate-200 hover:border-slate-300 transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-0 bg-slate-50/30 rounded-xl px-2 h-12 border border-slate-200 hover:border-slate-300 transition-all focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500">
              <div className="flex items-center px-2">
                <Input
                  type="text"
                  placeholder="From: YYYY-MM-DD"
                  className="w-[140px] h-9 border-0 bg-transparent focus-visible:ring-0 text-[13px] font-medium text-slate-600 placeholder:text-slate-400"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <Calendar className="h-4 w-4 text-slate-400 ml-1" />
              </div>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <div className="flex items-center px-2">
                <Input
                  type="text"
                  placeholder="To: YYYY-MM-DD"
                  className="w-[140px] h-9 border-0 bg-transparent focus-visible:ring-0 text-[13px] font-medium text-slate-600 placeholder:text-slate-400"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <Calendar className="h-4 w-4 text-slate-400 ml-1" />
              </div>
            </div>

            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={selected.size === 0 || loading}
                  className="h-12 bg-blue-600 hover:bg-blue-700 shadow-blue-200/50 shadow-lg px-8 rounded-xl font-bold flex items-center gap-2 group transition-all active:scale-95"
                >
                  Generate Picklist
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 rounded-3xl overflow-hidden border-0 shadow-2xl">
                <div className="bg-slate-900 p-8 text-white relative">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg">
                      <ClipboardCheck className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black tracking-tight">
                        Confirm Picklist
                      </DialogTitle>
                      <p className="text-slate-400 text-sm font-medium">
                        Verify execution quantities for the selected{" "}
                        {selected.size} line items.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-0 border-b max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 sticky top-0 z-10">
                      <TableRow className="border-b shadow-sm">
                        <TableHead className="font-bold text-slate-900 py-4 pl-8">
                          Item Description
                        </TableHead>
                        <TableHead className="font-bold text-slate-900">
                          Doc Number
                        </TableHead>
                        <TableHead className="font-bold text-slate-900 text-right">
                          Available
                        </TableHead>
                        <TableHead className="font-bold text-slate-900 text-right pr-8 w-40">
                          Putaway Qty
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localData
                        .filter((r) => selected.has(r.id))
                        .map((row) => (
                          <TableRow
                            key={row.id}
                            className="border-b-slate-100 hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="py-4 pl-8">
                              <p className="font-bold text-slate-800 leading-none mb-1">
                                {row.name}
                              </p>
                              <p className="text-xs font-semibold text-blue-500 font-mono tracking-tight">
                                {row.itemcode}
                              </p>
                            </TableCell>
                            <TableCell>
                              <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                                {row.docnum}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-black text-slate-400">
                              {row.availableQty}
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <div className="flex items-center justify-end">
                                <Input
                                  type="number"
                                  className="w-24 h-9 text-right font-black text-blue-600 rounded-lg border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all bg-white"
                                  value={row.putQty}
                                  onChange={(e) =>
                                    updateQty(
                                      row.id,
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <DialogFooter className="p-6 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 mr-auto">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Manual overrides enabled
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      className="rounded-xl font-bold text-slate-500"
                      onClick={() => setIsConfirmOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 font-bold shadow-lg"
                      onClick={executeGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <PackageCheck className="h-5 w-5 mr-2" /> Create
                          Picklist
                        </>
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-14 text-center">
                  <Checkbox
                    checked={
                      localData.length > 0 && selected.size === localData.length
                    }
                    onCheckedChange={toggleAll}
                    disabled={loading || localData.length === 0}
                  />
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Doc No
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Partner
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-center">
                  Doc Date
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Item Code
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Item Name
                </TableHead>
                <TableHead className="font-bold text-slate-900">
                  Warehouse
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-right">
                  Available
                </TableHead>
                <TableHead className="font-bold text-slate-900 text-right pr-6">
                  Putaway Qty
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localData.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-60 text-center text-slate-400 font-medium"
                  >
                    No inward requests found
                  </TableCell>
                </TableRow>
              ) : (
                localData.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selected.has(row.id)}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      {row.docnum}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      <p className="leading-tight">{row.cardname}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {row.cardcode}
                      </p>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium text-center">
                      {row.docdate}
                    </TableCell>
                    <TableCell className="text-blue-600 font-black">
                      {row.itemcode}
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium truncate max-w-[150px]">
                      {row.name}
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">
                      {row.whscode}
                    </TableCell>
                    <TableCell className="text-right font-black text-slate-400">
                      {row.availableQty}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Input
                        type="number"
                        className="w-20 ml-auto h-9 text-right font-bold rounded-lg border-slate-200 bg-slate-50/50 focus:bg-white"
                        value={row.putQty}
                        onChange={(e) =>
                          updateQty(row.id, parseInt(e.target.value) || 0)
                        }
                        disabled={loading}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-sm font-medium text-slate-400">
          Showing{" "}
          <span className="text-slate-900">
            {localData.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-slate-900">
            {Math.min(page * PAGE_SIZE, totalCount)}
          </span>{" "}
          of <span className="text-slate-900">{totalCount}</span> results
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
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InwardRequest;

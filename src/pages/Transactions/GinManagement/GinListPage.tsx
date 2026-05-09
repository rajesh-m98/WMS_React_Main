import {
  handleDeleteGinHeader,
  handleDeleteGinLine,
  handleFetchGins,
} from "@/app/manager/ginManager";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
} from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface GinListPageProps {
  type: "putaway" | "flow-through";
}

const PAGE_SIZE = 10;

const GinListPage = ({ type }: GinListPageProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, total } = useAppSelector((state) => state.gin);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<any | null>(null);

  const ginType = type === "putaway" ? 2 : 1;

  useEffect(() => {
    dispatch(
      handleFetchGins({
        gin_type: ginType,
        page: page,
        size: PAGE_SIZE,
        is_paginate: true,
      }),
    );
  }, [dispatch, ginType, page]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-0 hover:bg-emerald-500 hover:text-white transition-all cursor-default font-black uppercase tracking-widest text-[9px] px-3 py-1">
            Dispatched
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-0 hover:bg-amber-500 hover:text-white transition-all cursor-default font-black uppercase tracking-widest text-[9px] px-3 py-1">
            Pending
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-rose-50 text-rose-700 border-0 hover:bg-rose-600 hover:text-white transition-all cursor-default font-black uppercase tracking-widest text-[9px] px-3 py-1">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="font-black uppercase tracking-widest text-[9px]"
          >
            Unknown
          </Badge>
        );
    }
  };

  const handleDeleteLine = async () => {
    if (deleteId) {
      const success = await dispatch(handleDeleteGinLine(deleteId.id));
      if (success) {
        dispatch(
          handleFetchGins({
            gin_type: ginType,
            page,
            size: PAGE_SIZE,
            is_paginate: true,
          }),
        );
      }
      setDeleteId(null);
    }
  };

  const handleDeleteHeader = async () => {
    if (deleteId) {
      const success = await dispatch(handleDeleteGinHeader(deleteId.header.id));
      if (success) {
        dispatch(
          handleFetchGins({
            gin_type: ginType,
            page,
            size: PAGE_SIZE,
            is_paginate: true,
          }),
        );
      }
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Group items by Gate Pass Number to show unique gate passes
  const uniqueHeaders = useMemo(() => {
    const gpMap = new Map();
    items.forEach((item: any) => {
      const gpNumber = item.gate_pass_number || item.header?.gate_pass_number;
      if (gpNumber && !gpMap.has(gpNumber)) {
        gpMap.set(gpNumber, item.header || item);
      }
    });
    return Array.from(gpMap.values());
  }, [items]);

  const filteredHeaders = uniqueHeaders.filter(
    (header) =>
      (header?.gate_pass_number || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (header?.card_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (header?.card_code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="border-0 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-3 border-b border-slate-100/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-2/5 shrink-0">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
              <Input
                placeholder="Search by Gate Pass, Vendor or Card Code..."
                className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 justify-end w-full lg:w-auto">
              <Button
                variant="outline"
                className="rounded-2xl border-indigo-100 hover:bg-indigo-50 transition-all font-black gap-3 h-12 px-8 bg-white shadow-sm hover:shadow-indigo-100/50 active:scale-95 text-indigo-600 uppercase tracking-widest text-xs"
                onClick={() =>
                  dispatch(
                    handleFetchGins({
                      gin_type: ginType,
                      page,
                      size: PAGE_SIZE,
                      is_paginate: true,
                    }),
                  )
                }
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-50/40">
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  SL NO
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Gate Pass Details
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Supplier / Vendor
                </th>
                {type === "flow-through" && (
                  <th className="px-6 py-6 text-center text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                    GRPO Doc Entry
                  </th>
                )}
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Created By
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Sync Info
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50/30">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                      <p className="label-bold !text-slate-400">
                        Loading Master Data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredHeaders.length > 0 ? (
                filteredHeaders.map((header, idx) => (
                  <tr
                    key={header.id}
                    className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer border-b border-slate-200 hover:shadow-[0_10px_30px_rgba(59,130,246,0.05)] relative z-0 hover:z-10"
                    onClick={() =>
                      navigate(
                        `/transactions/gin/view/gp/${header.gate_pass_number}`,
                      )
                    }
                  >
                    <td className="px-6 py-6 font-black text-black whitespace-nowrap">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm tracking-tight">
                          GATE PASS #{header.gate_pass_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-700 text-sm">
                          {header.card_name} - {header.card_code}
                        </span>
                      </div>
                    </td>
                    {type === "flow-through" && (
                      <td className="px-6 py-6 text-center">
                        <Badge className="text-white border-indigo-100 font-black rounded-lg">
                          {header.grpo_docentry || "---"}
                        </Badge>
                      </td>
                    )}
                    <td className="px-6 py-6">
                      <span className="font-black text-slate-600 text-xs tracking-wider transition-all">
                        {header.created_by || "System"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-indigo-900/80 text-xs tracking-tight">
                          {formatDate(header.sync_date)}
                        </span>
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-tight mt-1">
                          {formatTime(header.sync_date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {getStatusBadge(header.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                      <ClipboardCheck className="w-16 h-16 text-slate-400" />
                      <p className="text-lg font-black text-slate-400 uppercase tracking-widest">
                        No Master Records Found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-indigo-50/50 flex flex-col md:flex-row items-center justify-between gap-6 bg-indigo-50/10">
            <div className="flex items-center gap-3">
              <Badge className="h-10 px-6 rounded-2xl border-blue-200 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                GATE PASSES: {filteredHeaders.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-10 px-5 rounded-2xl border-indigo-100 bg-white hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest gap-2 transition-all active:scale-95 disabled:opacity-30 text-indigo-600"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>

              <div className="flex items-center gap-1 mx-2">
                {[...Array(Math.ceil(filteredHeaders.length / PAGE_SIZE))]
                  .slice(0, 5)
                  .map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "ghost"}
                      size="icon"
                      className={`w-10 h-10 rounded-2xl font-black text-xs ${page === i + 1 ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-indigo-900/40 hover:bg-white hover:text-indigo-600 hover:shadow-sm"}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                {Math.ceil(filteredHeaders.length / PAGE_SIZE) > 5 && (
                  <span className="text-indigo-200 font-black px-2">...</span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page * PAGE_SIZE >= filteredHeaders.length}
                onClick={() => setPage((p) => p + 1)}
                className="h-10 px-5 rounded-2xl border-indigo-100 bg-white hover:bg-indigo-50 font-black uppercase text-[10px] tracking-widest gap-2 transition-all active:scale-95 disabled:opacity-30 text-indigo-600"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Selection */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="heading-section text-center text-slate-900 uppercase text-lg">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center body-main text-rose-500 font-bold uppercase tracking-widest text-[10px]">
              Line: #{deleteId?.id} | Header: #
              {deleteId?.header_id || deleteId?.header?.id}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 gap-3 py-4">
            <Button
              className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold text-base shadow-lg shadow-rose-100 uppercase tracking-widest"
              onClick={handleDeleteHeader}
            >
              Delete Full Header
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-base uppercase tracking-widest"
              onClick={handleDeleteLine}
            >
              Delete Only This Line
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl w-full border-0 text-slate-400 uppercase font-black text-[10px] tracking-widest">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GinListPage;

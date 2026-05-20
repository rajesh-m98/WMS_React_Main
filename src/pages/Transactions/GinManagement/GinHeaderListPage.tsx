import {
  handleFetchGins,
  handleDeleteGinHeader,
} from "@/app/manager/ginManager";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Loader2,
  RefreshCw,
  Search,
  Calendar,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PAGE_SIZE = 10;

const GinHeaderListPage = () => {
  const { type, gpNumber } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { flowThroughItems, putawayItems, loading } = useAppSelector(
    (state) => state.gin,
  );
  const items = type === "putaway" ? putawayItems : flowThroughItems;
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteHeaderTarget, setDeleteHeaderTarget] = useState<number | null>(
    null,
  );

  const ginType = type === "putaway" ? 2 : 1;

  const handleDelete = async () => {
    if (deleteHeaderTarget) {
      const success = await dispatch(handleDeleteGinHeader(deleteHeaderTarget));
      if (success) {
        dispatch(handleFetchGins({ gin_type: ginType, is_paginate: true }));
      }
      setDeleteHeaderTarget(null);
    }
  };

  useEffect(() => {
    dispatch(
      handleFetchGins({
        gin_type: ginType,
        page: 1,
        size: 100,
        is_paginate: true,
        gate_pass_number: gpNumber,
      }),
    );
  }, [dispatch, ginType, gpNumber]);

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

  // Filter and Group Headers for the specific Gate Pass
  const gpHeaders = useMemo(() => {
    const headerMap = new Map();
    items.forEach((item: any) => {
      const header = item.header || {};
      const itemGP = header.gate_pass_number;

      if (String(itemGP) === String(gpNumber)) {
        const headerId = header.id || item.header_id;
        if (!headerMap.has(headerId)) {
          headerMap.set(headerId, header);
        }
      }
    });
    return Array.from(headerMap.values());
  }, [items, gpNumber]);

  const filteredHeaders = gpHeaders.filter(
    (h: any) =>
      String(h.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.grpo_docentry || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const paginatedHeaders = filteredHeaders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <Card className="border border-slate-100 p-4 shadow-[0_0_25px_rgba(0,0,0,0.06),0_10px_20px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-5 border-b border-slate-100/50 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-slate-200 shadow-md shadow-slate-300 hover:bg-slate-50 hover:shadow-slate-400"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </Button>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  Gate Pass: {gpNumber}
                </h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Select a Purchase Order / Header to view details
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="rounded-2xl border-indigo-100 hover:bg-indigo-50 transition-all font-black gap-3 h-12 px-8 bg-white shadow-sm hover:shadow-indigo-100/50 active:scale-95 text-indigo-600 uppercase tracking-widest text-xs"
                onClick={() =>
                  dispatch(
                    handleFetchGins({
                      gin_type: ginType,
                      is_paginate: true,
                      forceRefresh: true,
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
        <CardContent className="p-0 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100 hover:scrollbar-thumb-slate-200">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  SL NO
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  PO NO
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  GRPO NO
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  Created By
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-6 text-left text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  Time
                </th>
                <th className="px-6 py-6 text-right text-[11px] font-black text-slate-600/80 uppercase tracking-widest whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                      <p className="label-bold !text-slate-400">
                        Loading Headers...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedHeaders.length > 0 ? (
                paginatedHeaders.map((header, idx) => (
                  <tr
                    key={header.id}
                    className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() =>
                      navigate(`/transactions/gin/view/${type}/${header.id}`)
                    }
                  >
                    <td className="px-6 py-6 font-black text-black whitespace-nowrap">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-black text-slate-800 text-sm tracking-tight uppercase">
                        PO: {header.id}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <Badge className="bg-blue-600 text-white font-black text-[10px] px-3 py-1 rounded-lg shadow-sm shadow-blue-100">
                        {header.grpo_docentry || "N/A"}
                      </Badge>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                          {header.created_by || "System"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-indigo-500">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[11px] font-black uppercase tracking-tight">
                          {formatDate(header.sync_date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-800 tracking-widest bg-slate-100 px-2 py-0.5 rounded shadow-sm shadow-slate-100/50">
                          {formatTime(header.sync_date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/transactions/gin/edit/${header.id}`);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-100 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteHeaderTarget(header.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-30">
                      <ClipboardCheck className="w-16 h-16 text-slate-400" />
                      <p className="text-lg font-black text-slate-400 uppercase tracking-widest">
                        No Headers Found
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
                TOTAL HEADERS: {filteredHeaders.length}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteHeaderTarget}
        onOpenChange={() => setDeleteHeaderTarget(null)}
      >
        <AlertDialogContent className="rounded-[40px] border-0 shadow-2xl max-w-sm bg-white p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-center text-slate-900 uppercase tracking-tight">
              Delete Header?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 leading-relaxed">
              Are you sure you want to delete this Gate Pass Header? This will
              remove all associated line items and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-3 mt-8">
            <Button
              className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-xs shadow-lg shadow-rose-100 uppercase tracking-widest w-full transition-all active:scale-95"
              onClick={handleDelete}
            >
              Confirm Deletion
            </Button>
            <AlertDialogCancel className="h-14 rounded-2xl border-slate-200 text-slate-400 uppercase font-black text-[10px] tracking-widest w-full mt-0 hover:bg-slate-50 transition-all active:scale-95">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GinHeaderListPage;

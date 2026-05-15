import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleSelectGin,
  handleSelectByGatePass,
  handleDeleteGinHeader,
  handleDeleteGinLine,
} from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
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
  Package,
  Calendar,
  User,
  Loader2,
  FileText,
  Edit2,
  Trash2,
} from "lucide-react";

const GinDetail = () => {
  const { headerId, lineId, gpNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentHeader, currentLines, loading } = useAppSelector(
    (state) => state.gin,
  );
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "header" | "line";
    id: number;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(currentLines.length / itemsPerPage);
  const paginatedLines = currentLines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

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

  useEffect(() => {
    if (gpNumber) {
      dispatch(handleSelectByGatePass(gpNumber));
    } else if (headerId) {
      dispatch(
        handleSelectGin(Number(headerId), lineId ? Number(lineId) : undefined),
      );
    }
  }, [dispatch, headerId, lineId, gpNumber]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    let success = false;
    if (deleteTarget.type === "header") {
      success = await dispatch(handleDeleteGinHeader(deleteTarget.id));
      if (success) navigate(-1);
    } else {
      success = await dispatch(handleDeleteGinLine(deleteTarget.id));
      if (success) {
        dispatch(handleSelectGin(Number(headerId), undefined));
      }
    }
    setDeleteTarget(null);
  };

  if (loading && !currentHeader) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400 uppercase tracking-widest">
          Loading Transaction Details...
        </p>
      </div>
    );
  }

  if (!currentHeader && !loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center">
          <Package className="w-10 h-10 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="heading-section !text-2xl text-slate-900 uppercase">
            Transaction Not Found
          </h2>
          <p className="body-main !text-slate-400 mt-2 uppercase tracking-widest text-sm">
            We couldn't retrieve details for ID #{lineId || headerId}
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl px-8 h-12 border-slate-200 font-bold"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 overflow-hidden bg-[#f8fafc]/50 p-4">
      {/* NEW HEADER DESIGN */}
      <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white border border-slate-200 shadow-sm rounded-[32px] mb-2">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full shadow-md shadow-slate-400 hover:bg-slate-50 h-10 w-10 transition-all border border-slate-200 bg-white shadow-sm active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 leading-none">
              {currentHeader?.card_name}
              <span className="text-blue-600/30 font-black">/</span>
              <span className="text-slate-600">
                GP #{currentHeader?.gate_pass_number}
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                <User className="w-3 h-3 text-slate-600" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Created by: {currentHeader?.created_by || "System"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentHeader?.status === 1 && (
                  <Badge className="bg-emerald-600 text-white border-0 font-black uppercase text-[9px] px-4 py-1.5 rounded-xl shadow-lg shadow-emerald-100">
                    DISPATCHED
                  </Badge>
                )}
                {currentHeader?.status === 2 && (
                  <Badge className="bg-amber-500 text-white border-0 font-black uppercase text-[9px] px-4 py-1.5 rounded-xl shadow-lg shadow-amber-100">
                    PENDING
                  </Badge>
                )}
                {currentHeader?.status === 3 && (
                  <Badge className="bg-rose-600 text-white border-0 font-black uppercase text-[9px] px-4 py-1.5 rounded-xl shadow-lg shadow-rose-100">
                    CANCELLED
                  </Badge>
                )}
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-black uppercase text-[9px] px-4 py-1.5 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg transition-all duration-300 cursor-default">
                TOTAL LINES: {currentLines.length}
              </Badge>
              {currentLines[0]?.line_type !== 2 && (
                <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all cursor-default">
                  <FileText className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    DOC: {currentHeader?.grpo_docentry || "---"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-600 group transition-all cursor-default">
                <Calendar className="w-3 h-3 text-indigo-500 group-hover:text-white transition-all" />
                <span className="text-[10px] font-black text-indigo-600 group-hover:text-white uppercase tracking-widest transition-all">
                  SYNCED: {formatDate(currentHeader?.sync_date)} |{" "}
                  {formatTime(currentHeader?.sync_date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 min-h-0 items-start pb-10">
        {/* BOTTOM SECTION: LINE ITEMS TABLE */}
        <Card className="border-0 shadow-[0_20px_50px_rgba(59,130,246,0.08)] rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="bg-white p-7 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Transaction Line Items
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                  Showing {currentLines.length} products in this gate pass
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50/40">
                    <th className="px-8 py-6 text-left text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      SL NO
                    </th>
                    <th className="px-8 py-6 text-left text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      Item Description
                    </th>
                    <th className="px-6 py-6 text-center text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      Doc Entry
                    </th>

                    <th className="px-6 py-6 text-center text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      Line
                    </th>
                    <th className="px-8 py-6 text-center text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      MRP
                    </th>
                    <th className="px-8 py-6 text-center text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      Quantity Breakup
                    </th>
                    <th className="px-8 py-6 text-center text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      Dispatch Status
                    </th>
                    <th className="px-8 py-6 text-right pr-10 text-[11px] font-black text-black uppercase tracking-widest border-b border-indigo-100 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/30">
                  {paginatedLines.map((line, idx) => (
                    <tr
                      key={line.id}
                      className={`hover:bg-blue-600/5 transition-all duration-300 group cursor-default ${Number(lineId) === line.id ? "bg-blue-50 ring-2 ring-inset ring-blue-100" : ""}`}
                    >
                      <td className="px-8 py-6 text-sm font-black text-black font-mono">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800">
                            {line.item_desc}
                          </span>
                          <span className="text-xs font-black text-blue-600 tracking-widest uppercase mt-0.5">
                            {line.item_code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                          {(line as any).doc_number || "---"}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-black h-7 px-3 bg-blue-500 text-white border-0"
                        >
                          {(line as any).line_no || "---"}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-sm font-black text-black bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100">
                          ₹{line.mrp}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-black/40 uppercase tracking-widest">
                              Open
                            </span>
                            <span className="text-sm font-black text-slate-700">
                              {line.open_qty}
                            </span>
                          </div>
                          <div className="w-px h-6 bg-slate-200" />
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                              Recv
                            </span>
                            <span className="text-sm font-black text-blue-700">
                              {line.received_qty}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {line.status === 1 && (
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black uppercase text-[9px] px-3 py-1 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-default shadow-sm hover:shadow-emerald-100">
                            DISPATCHED
                          </Badge>
                        )}
                        {line.status === 2 && (
                          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-black uppercase text-[9px] px-3 py-1 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all cursor-default shadow-sm hover:shadow-amber-100">
                            PENDING
                          </Badge>
                        )}
                        {line.status === 3 && (
                          <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black uppercase text-[9px] px-3 py-1 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-default shadow-sm hover:shadow-rose-100">
                            CANCELLED
                          </Badge>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right pr-10">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            className="rounded-xl bg-blue-500 text-white transition-all shadow-sm active:scale-95"
                            onClick={() =>
                              navigate(
                                `/transactions/gin/picklist/${headerId}/${line.id}`,
                              )
                            }
                          >
                            Picklist
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="h-9 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-black uppercase text-[9px] tracking-widest gap-2 transition-all active:scale-95 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Prev
                  </Button>
                  <div className="flex items-center gap-1 mx-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "ghost"}
                        size="icon"
                        className={`w-8 h-8 rounded-lg font-black text-[10px] ${currentPage === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:bg-white hover:text-blue-600"}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="h-9 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 font-black uppercase text-[9px] tracking-widest gap-2 transition-all active:scale-95 disabled:opacity-30"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-sm bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="heading-section text-center text-slate-900 uppercase text-lg">
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center body-main text-rose-500 font-bold uppercase tracking-widest text-[10px] mt-2">
              {deleteTarget?.type === "header"
                ? "Are you sure you want to delete the entire Gate Pass Header? This will remove all associated line items and cannot be undone."
                : "Are you sure you want to delete this specific line item from the Gate Pass? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button
              className="h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-xs shadow-lg shadow-rose-100 uppercase tracking-widest w-full"
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
            <AlertDialogCancel className="h-12 rounded-2xl border-slate-200 text-slate-400 uppercase font-black text-[10px] tracking-widest w-full mt-0 hover:bg-slate-50 transition-all">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GinDetail;

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchGins,
  handleDeleteGinLine,
  handleDeleteGinHeader,
} from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Download,
  Plus,
  Filter,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
  Loader2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import config from "./GinConfig.json";
import { toast } from "sonner";

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
  const strings =
    type === "putaway" ? config.strings.putaway : config.strings.flowThrough;

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
        return <Badge variant="outline" className="font-black uppercase tracking-widest text-[9px]">Unknown</Badge>;
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

  const filteredItems = items.filter(
    (item) =>
      item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.header?.card_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="heading-section !text-2xl">{strings.title}</h1>
            <p className="body-main !text-sm mt-1">{strings.subtitle}</p>
          </div>
        </div>
      </div>

      <Card className="border-0 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="p-3 border-b border-slate-100/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="relative w-full lg:w-2/5 shrink-0">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
              <Input
                placeholder="Search by SKU, Description or Vendor..."
                className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 justify-end w-full lg:w-auto">
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold gap-2 h-12 px-6 bg-white shadow-sm hover:shadow-md active:scale-95"
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
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-3 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  ID
                </th>
                <th className="px-3 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Item Details
                </th>
                <th className="px-3 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Supplier / Vendor
                </th>
                <th className="px-3 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  MRP
                </th>
                <th className="px-3 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Quantities
                </th>
                <th className="px-3 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Created Date
                </th>
                <th className="px-3 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Created By
                </th>
                <th className="px-3 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-5 text-center pr-6 text-[11px] font-black text-slate-500 uppercase tracking-widest border-b-2 border-slate-900/10 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                      <p className="label-bold !text-slate-400">
                        Loading GIN Transactions...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-all duration-300 group cursor-default border-b border-slate-200 hover:shadow-[0_10px_30px_rgba(59,130,246,0.05)] relative z-0 hover:z-10"
                  >
                    <td className="px-3 py-5 label-bold !text-slate-400 whitespace-nowrap">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex flex-col">
                        <span className="body-strong !text-slate-800 text-sm  line-clamp-1">
                          {item.item_desc}
                        </span>
                        <span className="caption-small !text-blue-600 mt-0.5 text-sm">
                          {item.item_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex flex-col">
                        <span className="body-strong !text-slate-800 text-sm">
                          {item.header?.card_name || "Unknown Vendor"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-center">
                      <span className="text-sm font-black text-slate-900">
                        ₹{item.mrp || "0"}
                      </span>
                    </td>
                    <td className="px-3 py-5">
                      <div className="inline-flex items-center bg-slate-100/50 rounded-xl px-3 py-2 gap-4 border border-slate-300 shadow-sm">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase font-black text-slate-600 tracking-tighter">
                            Open
                          </span>
                          <span className="body-strong !text-slate-700">
                            {item.open_qty}
                          </span>
                        </div>
                        <div className="w-px h-7 bg-slate-700" />
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] uppercase font-black text-blue-500 tracking-tighter">
                            Recv
                          </span>
                          <span className="body-strong !text-blue-700">
                            {item.received_qty}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex flex-col">
                        <span className="body-strong !text-slate-800 text-xs">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <span className="body-strong !text-slate-700 text-xs uppercase tracking-wider">
                          {item.header?.created_by || "System"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-5">{getStatusBadge(item.status)}</td>
                    <td className="px-3 py-5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2 transition-all">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white shadow-sm border border-slate-100 hover:border-blue-500 transition-all duration-300 active:scale-95"
                          onClick={() =>
                            navigate(
                              `/transactions/gin/view/${item.header_id || item.header?.id}/${item.id}`,
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-orange-500 hover:text-white shadow-sm border border-slate-100 hover:border-orange-400 transition-all duration-300 active:scale-95"
                          onClick={() =>
                            navigate(
                              `/transactions/gin/edit/${item.header_id || item.header?.id}/${item.id}`,
                            )
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white shadow-sm border border-slate-100 hover:border-rose-500 transition-all duration-300 active:scale-95"
                          onClick={() => setDeleteId(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                      <ClipboardCheck className="w-20 h-20 text-slate-400" />
                      <p className="text-xl font-black text-slate-400 uppercase">
                        {strings.emptyState}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <Badge className="h-10 px-4 rounded-xl border text-blue-600 border-slate-600 bg-slate-50/50 label-bold uppercase tracking-widest text-[11px] hover:text-white hover:font-bold">
              Total Records: <span className=" ml-2 font-black ">{total}</span>
            </Badge>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page * PAGE_SIZE >= total || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-6 w-6 text-slate-600" />
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

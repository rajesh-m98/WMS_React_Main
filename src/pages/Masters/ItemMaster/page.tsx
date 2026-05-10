import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Input,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  ScrollArea,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Edit2,
  Package,
  Layers,
  Settings,
  X,
  Box,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  handleFetchAllItems,
  handleCreateItem,
  handleDeleteItem,
  handleRefreshItems,
} from "@/app/manager/itemManager";
import { handleFetchBins } from "@/app/manager/binManager";
import { useDebounce } from "@/hooks/use-debounce";
import config from "./ItemConfig.json";
import { ItemDTO } from "@/core/models/master.model";

const PAGE_SIZE = 15;

export const ItemMaster = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: items,
    loading,
    totalCount,
  } = useAppSelector((state) => state.item);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(
      handleFetchAllItems({ page, size: PAGE_SIZE, search: debouncedSearch }),
    );
    dispatch(handleFetchBins({ warehouseid: 1 }));
    return () => {
      dispatch({ type: "item/clearItems" }); // Reset core state on navigate out
    };
  }, [dispatch, page, debouncedSearch]);

  const handleSync = async () => {
    setIsRefreshing(true);
    const success = await dispatch(handleRefreshItems());
    if (success) {
      dispatch(
        handleFetchAllItems({ page, size: PAGE_SIZE, search: debouncedSearch }),
      );
      toast.success(config.strings.syncSuccess);
    }
    setIsRefreshing(false);
  };

  const handleOpenDialog = (item: ItemDTO | null = null) => {
    if (item) {
      navigate(`/masters/items/${item.id}/edit`);
    } else {
      navigate("/masters/items/create");
    }
  };

  const handleView = (id: number) => {
    navigate(`/masters/items/${id}?type=item`);
  };


  const handleRemove = async (id: number) => {
    const success = await dispatch(handleDeleteItem(id));
    if (success) {
      toast.success("Item removed successfully");
      // Trigger a smart refetch on the current page to keep context
      dispatch(
        handleFetchAllItems({ page, size: PAGE_SIZE, search: debouncedSearch }),
      );
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const endPage = Math.min(totalPages, Math.max(page + 2, 5));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="h-12 px-5 rounded-xl border border-slate-200 body-strong text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              onClick={handleSync}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`icon-sm ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="ml-2 uppercase tracking-widest text-[10px] font-black">Sync Catalog</span>
            </Button>
            
            <Button
              className="h-12 px-6 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100 flex items-center gap-2"
              onClick={() => handleOpenDialog(null)}
            >
              <Plus className="h-5 w-5" />
              <span className="uppercase tracking-widest text-[10px]">Create New Item</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl p-4 rounded-[2.5rem] overflow-hidden bg-white relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200 hover:bg-slate-50/80">
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[150px]">
                    ITEM CODE
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-auto">
                    DESCRIPTION
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[150px]">
                    EAN BARCODE
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[120px]">
                    OPEN QTY
                  </TableHead>
                  <TableHead className="px-5 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap text-right w-[150px]">
                    ACTIONS
                  </TableHead>
                </TableRow>

              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="icon-xl text-blue-600 animate-spin" />
                        <p className="caption-small !text-slate-400">
                          Loading Items...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest"
                    >
                      {config.strings.noItems}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="group border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/50 transition-all font-bold"
                    >
                      <TableCell className="px-5 py-4 text-[13px] font-black text-slate-950 uppercase tracking-tight whitespace-nowrap">
                        {item.item_code}
                      </TableCell>
                      <TableCell className="px-5 text-[13px] font-bold text-slate-800 py-4 leading-relaxed group-hover:text-slate-950 transition-colors">
                        {item.item_description}
                      </TableCell>
                      <TableCell className="px-5 py-4 font-mono text-[12px] font-bold text-slate-600 whitespace-nowrap">
                        {item.ean_barcode || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="rounded-lg border border-blue-200 bg-blue-50/30 font-mono text-[11px] font-bold px-3 py-1 text-blue-700 shadow-sm whitespace-nowrap"
                        >
                          {item.open_quantity ?? 0}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right px-5 py-4">
                        <div className="flex items-center justify-end gap-2 text-left transition-all">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            onClick={() => handleView(item.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                              <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                                <Trash2 className="icon-xl text-white animate-in zoom-in-50 duration-500 relative z-10" />
                                <AlertDialogTitle className="text-2xl font-black text-white tracking-tight relative z-10">
                                  {config.strings.deleteDialog.title}
                                </AlertDialogTitle>
                              </div>
                              <div className="p-10 text-center flex flex-col items-center">
                                <AlertDialogHeader className="flex flex-col items-center">
                                  <AlertDialogDescription className="body-strong text-slate-500 pt-2 text-[15px] leading-relaxed  mx-auto text-center">
                                    {config.strings.deleteDialog.descriptionTemplate.replace(
                                      "{itemcode}",
                                      item.item_code,
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-4 w-full mt-10">
                                  <AlertDialogCancel className="rounded-xl border-slate-200 body-strong flex-1 h-12 text-slate-600 hover:bg-slate-50">
                                    {config.strings.deleteDialog.cancelBtn}
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-rose-600 hover:bg-rose-700 body-strong rounded-xl px-10 flex-1 h-12 text-white shadow-lg shadow-rose-100 transition-all active:scale-95"
                                    onClick={() => handleRemove(item.id)}
                                  >
                                    {config.strings.deleteDialog.confirmBtn}
                                  </AlertDialogAction>
                                </div>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                {config.strings.totalCatalog}
              </span>
              <span className="h-4 w-[2px] bg-slate-200 rounded-full mx-1" />
              <span className="text-sm font-black text-slate-900 tabular-nums">
                {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === 1 || loading}
                onClick={() => setPage(1)}
              >
                <ChevronsLeft className="icon-sm text-slate-600" />
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>
              <div className="flex items-center gap-2 px-4">
                {Array.from(
                  { length: Math.min(totalPages, endPage - startPage + 1) },
                  (_, i) => {
                    const p = startPage + i;
                    if (p <= 0) return null;
                    return (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "ghost"}
                        className={`h-10 w-10 rounded-xl font-black text-xs ${page === p ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-900"}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    );
                  },
                )}
              </div>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-6 w-6 text-slate-600" />
              </Button>
              <Button
                variant="outline"
                className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
                disabled={page === totalPages || loading}
                onClick={() => setPage(totalPages)}
              >
                <ChevronsRight className="icon-sm text-slate-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ItemMaster;

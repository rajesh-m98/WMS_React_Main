import { useState, useEffect } from "react";
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
import { useDebounce } from "@/hooks/use-debounce";
import config from "./ItemConfig.json";
import { ItemDTO } from "@/core/models/master.model";

const PAGE_SIZE = 15;

export const ItemMaster = () => {
  const dispatch = useAppDispatch();
  const {
    data: items,
    loading,
    totalCount,
  } = useAppSelector((state) => state.item);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemDTO | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ItemDTO>>({
    companyid: 1,
    warehouse_id: 1,
    item_code: "",
    item_description: "",
    itmsgrpcod: "Items",
    manbtchnum: "N",
    mansernum: "N",
    invntryuom: "Items",
    active: "Y",
    barcode: "",
    opening_stock: 0,
    current_stock: 0,
    location_mapping: "Single",
  });

  useEffect(() => {
    dispatch(
      handleFetchAllItems({ page, size: PAGE_SIZE, search: debouncedSearch }),
    );
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
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        companyid: 1,
        warehouse_id: 1,
        item_code: "",
        item_description: "",
        itmsgrpcod: "Items",
        manbtchnum: "N",
        mansernum: "N",
        invntryuom: "Items",
        active: "Y",
        barcode: "",
        opening_stock: 0,
        current_stock: 0,
        location_mapping: "Single",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.item_code || !formData.item_description) {
      toast.error("Code and Description are required");
      return;
    }

    const success = await dispatch(
      handleCreateItem(formData, editingItem?.id || 1),
    );
    if (success) {
      toast.success(editingItem ? "Item updated" : "Item created");
      setIsDialogOpen(false);
      // Trigger a smart refetch on the current page to keep context
      dispatch(
        handleFetchAllItems({ page, size: PAGE_SIZE, search: debouncedSearch }),
      );
    }
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
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white body-strong transition-all shadow-lg shadow-blue-100 active:scale-95 flex-1 md:flex-none"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="icon-sm mr-2" />
              {config.strings.dialog.create}
            </Button>
            <Button
              variant="outline"
              className="h-12 px-5 rounded-xl border border-slate-200 body-strong text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              onClick={handleSync}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`icon-sm ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl p-4 rounded-[2.5rem] overflow-hidden bg-white relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-premium scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-[1600px]">
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-b-2 border-slate-900/10">
                  <TableHead className="label-bold pl-4 whitespace-nowrap">
                    {config.strings.table.id}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.code}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.description}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.batch}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.barcode}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.location}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.opening}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.current}
                  </TableHead>
                  <TableHead className="label-bold whitespace-nowrap">
                    {config.strings.table.status}
                  </TableHead>
                  <TableHead className="label-bold text-right pr-8 whitespace-nowrap">
                    {config.strings.table.manage}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-80 text-center">
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
                      colSpan={10}
                      className="h-80 text-center text-slate-400 font-bold uppercase tracking-widest"
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
                      <TableCell className="pl-4 py-5 body-strong">
                        {item.id}
                      </TableCell>
                      <TableCell className="table-cell-font py-5">
                        {item.item_code}
                      </TableCell>
                      <TableCell className="body-strong !text-slate-600 max-w-[280px] py-5 leading-relaxed">
                        {item.item_description}
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          variant="outline"
                          className="rounded-lg border-2 border-slate-100 bg-white font-mono text-xs px-2.5 py-1 text-slate-600"
                        >
                          {item.manbtchnum || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          variant="outline"
                          className="rounded-lg border-2 border-slate-100 bg-white table-id-font px-2.5 py-1 text-slate-600"
                        >
                          {item.barcode || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-5 font-bold text-slate-600">
                        {item.location_mapping || "Single"}
                      </TableCell>
                      <TableCell className="py-5 font-black text-slate-900 tabular-nums">
                        {item.opening_stock || 0}
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black tabular-nums">
                          {item.current_stock || 0}
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          className={`rounded-xl px-4 py-1.5 border-0 caption-small shadow-sm ${item.active === "Y" ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}
                        >
                          {item.active === "Y" ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-5">
                        <div className="flex items-center justify-end gap-2 transition-all">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-2xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
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
            <div className="flex items-center gap-4">
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">
                {config.strings.totalCatalog}{" "}
                <span className="text-slate-900 ml-2 border-b-2 border-blue-500">
                  {totalCount}
                </span>
              </p>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-0 shadow-3xl bg-white rounded-[2rem]">
          <DialogHeader className="p-8 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <DialogTitle className="text-3xl font-black tracking-tighter flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Plus className="icon-base text-white" />
              </div>
              {editingItem
                ? config.strings.dialog.edit
                : config.strings.dialog.create}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] p-8 px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 px-4">
              {/* Section 1: Core Identification */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">
                    {config.strings.dialog.coreInfo}
                  </h3>
                </div>

                <div className="space-y-2.5">
                  <Label className="caption-small !text-slate-400">
                    {config.strings.dialog.itemCode}
                  </Label>
                  <Input
                    value={formData.item_code}
                    onChange={(e) =>
                      setFormData({ ...formData, item_code: e.target.value })
                    }
                    placeholder="E.g. SKU-7402"
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 transition-all"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="caption-small !text-slate-400">
                    {config.strings.dialog.description}
                  </Label>
                  <Input
                    value={formData.item_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        item_description: e.target.value,
                      })
                    }
                    placeholder="Detailed item name..."
                    className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="caption-small !text-slate-400">
                      {config.strings.dialog.groupCode}
                    </Label>
                    <Input
                      value={formData.itmsgrpcod}
                      onChange={(e) =>
                        setFormData({ ...formData, itmsgrpcod: e.target.value })
                      }
                      className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="caption-small !text-slate-400">
                      {config.strings.dialog.barcode}
                    </Label>
                    <Input
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 font-mono transition-all disabled:opacity-50"
                      disabled={!!editingItem}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Logistics & Configuration */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-amber-500 rounded-full" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg">
                    {config.strings.dialog.logistics}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="caption-small !text-slate-400">
                      {config.strings.dialog.uom}
                    </Label>
                    <Input
                      value={formData.invntryuom}
                      onChange={(e) =>
                        setFormData({ ...formData, invntryuom: e.target.value })
                      }
                      className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 transition-all text-center"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="caption-small !text-slate-400">
                      {config.strings.dialog.status}
                    </Label>
                    <Input
                      value={formData.active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          active: e.target.value.toUpperCase(),
                        })
                      }
                      maxLength={1}
                      className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 text-center transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="caption-small !text-slate-400">
                      {config.strings.table.opening}
                    </Label>
                    <Input
                      type="number"
                      value={formData.opening_stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          opening_stock: Number(e.target.value),
                        })
                      }
                      className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="caption-small !text-slate-400">
                      {config.strings.table.location}
                    </Label>
                    <Select
                      value={formData.location_mapping}
                      onValueChange={(val) =>
                        setFormData({ ...formData, location_mapping: val })
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white body-strong !text-slate-900 transition-all">
                        <SelectValue placeholder="Select Mapping" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-2xl p-2 bg-white">
                        <SelectItem
                          value="Single"
                          className="rounded-xl font-bold py-3"
                        >
                          Single Location
                        </SelectItem>
                        <SelectItem
                          value="Multiple"
                          className="rounded-xl font-bold py-3"
                        >
                          Multiple Locations
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase  ml-1">
                      {config.strings.dialog.batch}
                    </Label>
                    <Input
                      value={formData.manbtchnum}
                      onChange={(e) =>
                        setFormData({ ...formData, manbtchnum: e.target.value })
                      }
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase  ml-1">
                      {config.strings.dialog.serial}
                    </Label>
                    <Input
                      value={formData.mansernum}
                      onChange={(e) =>
                        setFormData({ ...formData, mansernum: e.target.value })
                      }
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <Separator className="col-span-1 md:col-span-2 bg-slate-100 my-4" />

              {/* Section 3: Extended Attributes */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-5 w-5 text-slate-400" />
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    {config.strings.dialog.attributes} (1-10)
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Label className="label-bold !text-slate-600 !tracking-tighter !font-semibold">
                        Attr {i + 1}
                      </Label>
                      <Input
                        value={(formData as any)[`attribute${i + 1}`] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`attribute${i + 1}`]: e.target.value,
                          })
                        }
                        className="h-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 text-xs font-bold transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Structural Layers */}
              <div className="space-y-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-4 mt-8">
                  <Layers className="h-5 w-5 text-slate-400" />
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    {config.strings.dialog.layers} (1-6)
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <Label className="label-bold !text-slate-600 !tracking-tighter !font-semibold">
                        Layer {i + 1}
                      </Label>
                      <Input
                        value={(formData as any)[`layer${i + 1}`] || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`layer${i + 1}`]: e.target.value,
                          })
                        }
                        className="h-10 rounded-xl bg-blue-50/50 border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 text-xs font-black text-blue-700 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="pb-10 col-span-1 md:col-span-2" />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-4 rounded-b-[2rem]">
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-2 border-slate-200 font-black text-slate-600 hover:bg-white transition-all active:scale-95"
              onClick={() => setIsDialogOpen(false)}
            >
              {config.strings.dialog.cancel}
            </Button>
            <Button
              className="h-14 px-12 rounded-2xl bg-blue-600 hover:bg-slate-900 text-white font-black transition-all shadow-xl shadow-blue-100 hover:shadow-slate-200 active:scale-95"
              onClick={handleSubmit}
            >
              {editingItem
                ? config.strings.dialog.submitEdit
                : config.strings.dialog.submitCreate}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemMaster;

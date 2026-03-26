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
  }, [dispatch, page, debouncedSearch]);

  const handleSync = async () => {
    setIsRefreshing(true);
    await dispatch(handleRefreshItems());
    setIsRefreshing(false);
    toast.success(config.strings.syncSuccess);
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
    }
  };

  const handleRemove = async (id: number) => {
    const success = await dispatch(handleDeleteItem(id));
    if (success) {
      toast.success("Item removed successfully");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-14 h-14 rounded-2xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold text-slate-700 shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black transition-all shadow-lg hover:shadow-slate-200 active:scale-95 flex-1 md:flex-none"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-5 w-5 mr-3" />
              {config.strings.dialog.create}
            </Button>
            <Button
              variant="outline"
              className="h-14 px-6 rounded-2xl border-2 border-slate-100 font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              onClick={handleSync}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 z-10" />
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-premium">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] h-16 pl-8">
                    {config.strings.table.code}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.description}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.batch}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.barcode}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.location}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.opening}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.current}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em]">
                    {config.strings.table.status}
                  </TableHead>
                  <TableHead className="font-black text-[11px] text-slate-400 uppercase tracking-[0.2em] text-right pr-10">
                    {config.strings.table.manage}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-80 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          Loading Repository...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-80 text-center text-slate-400 font-bold uppercase tracking-widest"
                    >
                      {config.strings.noItems}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="group hover:bg-slate-50/80 transition-all border-b border-slate-50"
                    >
                      <TableCell className="pl-8 font-black text-slate-900 py-5">
                        <div className="flex flex-col">
                          <span>{item.item_code}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                            ID: #{item.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-600 max-w-[250px] truncate py-5">
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
                          className="rounded-lg border-2 border-slate-100 bg-white font-mono text-xs px-2.5 py-1 text-slate-600"
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
                          className={`rounded-xl px-4 py-1.5 border-0 font-black text-[10px] shadow-sm tracking-widest ${item.active === "Y" ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}
                        >
                          {item.active === "Y" ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-0 shadow-2xl p-8">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                  {config.strings.deleteDialog.title}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-500 font-bold pt-4 text-[15px] leading-relaxed">
                                  {config.strings.deleteDialog.descriptionTemplate.replace(
                                    "{itemcode}",
                                    item.item_code,
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="pt-8 gap-3">
                                <AlertDialogCancel className="rounded-2xl border-2 border-slate-100 h-12 font-black px-8">
                                  {config.strings.deleteDialog.cancelBtn}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-rose-600 hover:bg-black text-white h-12 rounded-2xl font-black px-8 transition-all"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  {config.strings.deleteDialog.confirmBtn}
                                </AlertDialogAction>
                              </AlertDialogFooter>
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
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <Box className="h-6 w-6" />
              </div>
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
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-6 w-6 text-slate-600" />
              </Button>
              <div className="flex items-center gap-2 px-4">
                {[...Array(Math.min(5, Math.ceil(totalCount / PAGE_SIZE)))].map(
                  (_, i) => {
                    const p = i + 1;
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
                disabled={page * PAGE_SIZE >= totalCount || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-6 w-6 text-slate-600" />
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
                <Plus className="h-6 w-6 text-white" />
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
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    {config.strings.dialog.itemCode}
                  </Label>
                  <Input
                    value={formData.item_code}
                    onChange={(e) =>
                      setFormData({ ...formData, item_code: e.target.value })
                    }
                    placeholder="E.g. SKU-7402"
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold transition-all"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
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
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      {config.strings.dialog.groupCode}
                    </Label>
                    <Input
                      value={formData.itmsgrpcod}
                      onChange={(e) =>
                        setFormData({ ...formData, itmsgrpcod: e.target.value })
                      }
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-black transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      {config.strings.dialog.barcode}
                    </Label>
                    <Input
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-mono transition-all disabled:opacity-50"
                      disabled={!!editingItem} // Barcode usually non-editable
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
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      {config.strings.dialog.uom}
                    </Label>
                    <Input
                      value={formData.invntryuom}
                      onChange={(e) =>
                        setFormData({ ...formData, invntryuom: e.target.value })
                      }
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
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
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-black text-center transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
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
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-black transition-all"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      {config.strings.table.location}
                    </Label>
                    <Select 
                      value={formData.location_mapping}
                      onValueChange={(val) => setFormData({...formData, location_mapping: val})}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold transition-all">
                        <SelectValue placeholder="Select Mapping" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl p-2 bg-white">
                        <SelectItem value="Single" className="rounded-xl font-bold py-3">Single Location</SelectItem>
                        <SelectItem value="Multiple" className="rounded-xl font-bold py-3">Multiple Locations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
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
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
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
                      <Label className="text-[11px] text-slate-600 font-semibold uppercase tracking-tighter">
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
                      <Label className="text-[11px] text-slate-600 font-semibold uppercase tracking-tighter">
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

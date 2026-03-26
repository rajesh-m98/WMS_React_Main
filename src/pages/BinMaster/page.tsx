import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import {
  Plus,
  Search,
  Barcode,
  ChevronRight,
  Download,
  Pencil,
  Trash2,
  Layers,
  Loader2,
  Upload,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchBins,
  handleCreateOrUpdateBin,
  handleDeleteBin,
  handleExportBins,
  handleImportBins
} from "@/app/manager/binManager";
import { parseCSV } from "@/core/utils/csvHelper";
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
  selectNode,
  setCreateOpen,
  setEditOpen,
  clearSelection
} from "@/app/store/binSlice";
import config from "./BinConfig.json";

interface LayerConfigData {
  id: number;
  layer: number;
  value: string;
  barcode: string;
  children: LayerConfigData[];
}

export const LocationMaster: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    columns, 
    selectedPath, 
    loading,
    formStatus 
  } = useAppSelector((state) => state.bins);

  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    value: "",
    barcode: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(handleFetchBins({ warehouseid: 1 }));
  }, [dispatch]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    parseCSV(file).then((jsonResult) => {
      dispatch(handleImportBins(jsonResult));
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleNodeClick = (node: any, colIndex: number) => {
    dispatch(selectNode({ node, colIndex }));
  };

  const isNodeSelected = (id: number) => selectedPath.some((n) => n.id === id);

  const handleCreateSubmit = async () => {
    const nextLayerLevel = selectedPath.length + 1;
    if (nextLayerLevel > 6) return; // Should be disabled in UI

    const body: any = {
      companyid: 1,
      warehouse_id: 1,
      barcode: formData.barcode,
    };

    selectedPath.forEach((node, idx) => {
      body[`layer${idx + 1}`] = node.value;
    });
    body[`layer${nextLayerLevel}`] = formData.value;

    const result = await dispatch(handleCreateOrUpdateBin({ body }));
    if (result) {
      setFormData({ value: "", barcode: "" });
    }
  };

  const handleEditSubmit = async () => {
    if (!formData.value) return;
    const activeNode = selectedPath[selectedPath.length - 1];
    if (!activeNode) return;

    const body: any = {
      companyid: 1,
      warehouse_id: 1,
      barcode: formData.barcode,
    };

    selectedPath.slice(0, -1).forEach((node, idx) => {
      body[`layer${idx + 1}`] = node.value;
    });
    body[`layer${selectedPath.length}`] = formData.value;

    await dispatch(handleCreateOrUpdateBin({
      layer_id: activeNode.id,
      body,
    }));
  };

  const onDeleteConfirm = async () => {
    const activeNode = selectedPath[selectedPath.length - 1];
    if (!activeNode) return;
    await dispatch(handleDeleteBin(activeNode.id));
    dispatch(clearSelection());
  };

  const openEdit = () => {
    const activeNode = selectedPath[selectedPath.length - 1];
    if (activeNode) {
      setFormData({
        value: activeNode.value,
        barcode: activeNode.barcode || "",
      });
      dispatch(setEditOpen(true));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Bar */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide shrink-0">
            <Dialog 
              open={formStatus.isCreateOpen} 
              onOpenChange={(open) => {
                dispatch(setCreateOpen(open));
                if (!open) setFormData({ value: "", barcode: "" });
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 h-11 px-6 font-bold flex shrink-0 items-center gap-2 shadow-lg shadow-blue-100 transition-all"
                  disabled={selectedPath.length >= 6}
                >
                  <Plus className="h-4 w-4" /> {config.strings.addNodeBtn}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
                <div className="bg-slate-900 p-6 text-white text-center">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black mx-auto">
                      {config.strings.createNode.title.replace(
                        "{level}",
                        (selectedPath.length + 1).toString(),
                      )}
                    </DialogTitle>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] pt-2 italic">
                      {config.strings.createNode.subtitlePrefix}{" "}
                      {selectedPath.map((n) => n.value).join(" > ") ||
                        config.strings.createNode.rootName}
                    </p>
                  </DialogHeader>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      {config.strings.createNode.valueLabel}
                    </Label>
                    <Input
                      placeholder={config.strings.createNode.valuePlaceholder}
                      className="rounded-xl h-11 border-slate-200 font-bold"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      {config.strings.createNode.barcodeLabel}
                    </Label>
                    <div className="relative">
                      <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder={config.strings.createNode.barcodePlaceholder}
                        className="rounded-xl h-11 border-slate-200 pl-10 font-mono"
                        value={formData.barcode}
                        onChange={(e) =>
                          setFormData({ ...formData, barcode: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="ghost"
                      className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px] text-slate-500"
                      onClick={() => dispatch(setCreateOpen(false))}
                    >
                      {config.strings.createNode.cancelBtn}
                    </Button>
                    <Button
                      className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 px-8 font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-blue-100"
                      onClick={handleCreateSubmit}
                      disabled={formStatus.loading}
                    >
                      {formStatus.loading ? <Loader2 className="animate-spin h-4 w-4" /> : config.strings.createNode.submitBtn}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex bg-slate-100/80 rounded-xl p-1 shrink-0">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
              <Button
                variant="ghost"
                className="rounded-lg h-9 px-4 font-black uppercase tracking-widest text-[10px] text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 text-blue-500" /> {config.strings.importBtn}
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg h-9 px-4 font-black uppercase tracking-widest text-[10px] text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-2"
                onClick={() => dispatch(handleExportBins())}
              >
                <Download className="h-4 w-4 text-emerald-500" /> {config.strings.exportBtn}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hierarchy Browser */}
      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white relative min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 pb-24">
            {columns.map((column, idx) => (
              <Card
                key={idx}
                className="border border-slate-100 shadow-sm bg-slate-50/30 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {config.strings.levelCard.prefix} {idx + 1}
                    </span>
                    <span className="text-[9px] font-bold text-blue-600 uppercase">
                      {config.strings.levelCard.suffix}
                    </span>
                  </div>
                  <Badge className="text-[9px] font-bold bg-slate-100 text-slate-500 border-0 uppercase">
                    {column.length} {config.strings.levelCard.items}
                  </Badge>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {column.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node, idx)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group border ${
                          isNodeSelected(node.id)
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200/50 ring-4 ring-blue-50"
                            : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md text-slate-700"
                        }`}
                      >
                        <div className="flex flex-col items-start text-left">
                          <span className={`text-[14px] font-bold leading-tight ${isNodeSelected(node.id) ? "text-white" : "text-slate-800"}`}>
                            {node.value}
                          </span>
                          {node.barcode && (
                            <span className={`text-[11px] font-mono mt-1 px-1.5 py-0.5 rounded ${isNodeSelected(node.id) ? "bg-white/20 text-blue-50" : "bg-slate-100 text-slate-500"}`}>
                              {node.barcode}
                            </span>
                          )}
                        </div>
                        {node.children && node.children.length > 0 && (
                          <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${isNodeSelected(node.id) ? "text-white" : "text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}

            {columns.length === 0 && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center gap-4 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                  <Layers className="h-10 w-10" />
                </div>
                <p className="font-bold uppercase tracking-widest text-[10px]">No hierarchy data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Floating Action Menu */}
      {selectedPath.length > 0 && (
        <div className="fixed bottom-8 right-8 animate-in slide-in-from-bottom-10 flex gap-4 z-50">
          <Dialog 
            open={formStatus.isEditOpen} 
            onOpenChange={(v) => dispatch(setEditOpen(v))}
          >
            <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
              <div className="bg-blue-600 p-6 text-white text-center">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black mx-auto">
                    {config.strings.editNode.title}
                  </DialogTitle>
                  <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] pt-2 italic">
                    {config.strings.editNode.subtitlePrefix} {selectedPath[selectedPath.length - 1]?.id}
                  </p>
                </DialogHeader>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                    {config.strings.editNode.valueLabel}
                  </Label>
                  <Input
                    className="rounded-xl h-11 border-slate-200 font-bold"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                    {config.strings.editNode.barcodeLabel}
                  </Label>
                  <Input
                    className="rounded-xl h-11 border-slate-200 font-mono bg-slate-50 cursor-not-allowed opacity-70"
                    value={formData.barcode}
                    disabled={true}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="ghost"
                    className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px] text-slate-500"
                    onClick={() => dispatch(setEditOpen(false))}
                  >
                    {config.strings.editNode.cancelBtn}
                  </Button>
                  <Button
                    className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 px-8 font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-blue-100"
                    onClick={handleEditSubmit}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? <Loader2 className="animate-spin h-4 w-4" /> : config.strings.editNode.submitBtn}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="border-0 shadow-2xl shadow-blue-900/20 rounded-2xl bg-slate-900 text-white p-3 pr-6 flex items-center gap-6 ring-8 ring-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/10">
                <Barcode className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 tracking-[0.2em]">
                  {config.strings.activeFocus}
                </p>
                <p className="text-sm font-black tracking-tight">
                  {selectedPath[selectedPath.length - 1].value}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                onClick={openEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black">
                      {config.strings.deleteAlert.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 font-medium">
                      {config.strings.deleteAlert.descriptionTemplate.replace(
                        "{value}",
                        selectedPath[selectedPath.length - 1].value,
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-4">
                    <AlertDialogCancel className="rounded-xl font-bold">
                      {config.strings.deleteAlert.cancelBtn}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold px-8 shadow-lg shadow-rose-100"
                      onClick={onDeleteConfirm}
                    >
                      {config.strings.deleteAlert.confirmBtn}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

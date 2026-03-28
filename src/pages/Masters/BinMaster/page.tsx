import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui";
import BarcodeDisplay from "react-barcode";
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
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchBins,
  handleCreateOrUpdateBin,
  handleDeleteBin,
  handleExportBins,
  handleImportBins,
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
  clearSelection,
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
  const { columns, selectedPath, loading, formStatus } = useAppSelector(
    (state) => state.bins,
  );

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

    await dispatch(
      handleCreateOrUpdateBin({
        layer_id: activeNode.id,
        body,
      }),
    );
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
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
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
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 h-11 px-6 body-strong flex shrink-0 items-center gap-2 shadow-lg shadow-blue-100 transition-all text-white border-0"
                  disabled={selectedPath.length >= 6}
                >
                  <Plus className="icon-sm" /> {config.strings.addNodeBtn}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
                <DialogHeader className="p-8 bg-slate-900 text-white relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <DialogTitle className="text-xl font-black mx-auto relative z-10 font-display">
                    {config.strings.createNode.title.replace(
                      "{level}",
                      (selectedPath.length + 1).toString(),
                    )}
                  </DialogTitle>
                  <p className="label-bold !text-slate-400 pt-2 italic relative z-10">
                    {config.strings.createNode.subtitlePrefix}{" "}
                    {selectedPath.map((n) => n.value).join(" > ") ||
                      config.strings.createNode.rootName}
                  </p>
                </DialogHeader>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="caption-small uppercase text-slate-400">
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
                  {selectedPath.length >= 4 && (
                    <div className="space-y-2">
                      <Label className="caption-small uppercase text-slate-400">
                        {config.strings.createNode.barcodeLabel}
                      </Label>
                      <div className="relative">
                        <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
                        <Input
                          placeholder={
                            config.strings.createNode.barcodePlaceholder
                          }
                          className="rounded-xl h-11 border-slate-200 pl-10 font-mono"
                          value={formData.barcode}
                          onChange={(e) =>
                            setFormData({ ...formData, barcode: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="ghost"
                      className="rounded-xl h-11 px-6 label-bold text-slate-500"
                      onClick={() => dispatch(setCreateOpen(false))}
                    >
                      {config.strings.createNode.cancelBtn}
                    </Button>
                    <Button
                      className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 px-8 body-strong text-white border-0 shadow-lg shadow-blue-100"
                      onClick={handleCreateSubmit}
                      disabled={formStatus.loading}
                    >
                      {formStatus.loading ? (
                        <Loader2 className="animate-spin icon-sm" />
                      ) : (
                        config.strings.createNode.submitBtn
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex bg-slate-100/80 rounded-xl p-1 shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
              <Button
                variant="ghost"
                className="rounded-lg h-9 px-4 label-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="icon-sm text-blue-500" />{" "}
                {config.strings.importBtn}
              </Button>
              <Button
                variant="ghost"
                className="rounded-lg h-9 px-4 label-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-2"
                onClick={() => dispatch(handleExportBins())}
              >
                <Download className="icon-sm text-emerald-500" />{" "}
                {config.strings.exportBtn}
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
                    <span className="label-bold !text-slate-400">
                      {config.strings.levelCard.prefix} {idx + 1}
                    </span>
                    <span className="caption-small text-blue-600 !text-[10px] uppercase font-black">
                      {config.strings.levelCard.suffix}
                    </span>
                  </div>
                  <Badge className="caption-small !text-[10px] bg-slate-100 text-slate-500 border-0 uppercase px-3 py-1 bg-white hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm font-black tracking-tighter cursor-default">
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
                          <span
                            className={`table-cell-bold leading-tight w-full ${isNodeSelected(node.id) ? "!text-white" : "text-slate-800"}`}
                          >
                            {idx >= 4 ? (
                              <div
                                className={`p-2 bg-white rounded-lg shadow-sm border border-slate-100 flex flex-col items-center justify-center w-full min-h-[100px] ${isNodeSelected(node.id) ? "ring-2 ring-white/50" : ""}`}
                              >
                                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                  <BarcodeDisplay
                                    value={node.value}
                                    width={1.8}
                                    height={50}
                                    fontSize={14}
                                    background="transparent"
                                    displayValue={true}
                                    format="CODE128"
                                  />
                                </div>
                              </div>
                            ) : (
                              node.value
                            )}
                          </span>
                          {node.barcode && idx < 4 && (
                            <span
                              className={`table-id-font mt-1 px-1.5 py-0.5 rounded !text-[10px] ${isNodeSelected(node.id) ? "bg-white/20 !text-blue-50" : "bg-slate-100 !text-slate-500"}`}
                            >
                              {node.barcode}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {node.children && node.children.length > 0 && (
                            <Badge
                              variant="secondary"
                              className={`!text-[10px] font-black px-2 py-0.5 rounded-lg border-0 transition-all duration-300 ${
                                isNodeSelected(node.id)
                                  ? "bg-white/20 text-white"
                                  : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200"
                              }`}
                            >
                              {node.children.length}
                            </Badge>
                          )}
                          {node.children && node.children.length > 0 && (
                            <ChevronRight
                              className={`h-4 w-4 shrink-0 transition-transform ${isNodeSelected(node.id) ? "text-white" : "text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500"}`}
                            />
                          )}
                        </div>
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
                <p className="font-bold uppercase tracking-widest text-[10px]">
                  No hierarchy data available
                </p>
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
              <DialogHeader className="p-8 bg-blue-600 text-white relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <DialogTitle className="text-xl font-black mx-auto relative z-10 font-display">
                  {config.strings.editNode.title}
                </DialogTitle>
                <p className="label-bold !text-blue-100 pt-2 italic relative z-10">
                  {config.strings.editNode.subtitlePrefix}{" "}
                  {selectedPath[selectedPath.length - 1]?.id}
                </p>
              </DialogHeader>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                    {config.strings.editNode.valueLabel}
                  </Label>
                  <Input
                    className="rounded-xl h-11 border-slate-200 font-bold"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
                {selectedPath.length >= 5 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400 tracking-wider font-sans">
                      {config.strings.editNode.barcodeLabel}
                    </Label>
                    <Input
                      className="rounded-xl h-11 border-slate-200 font-mono bg-slate-50 cursor-not-allowed opacity-70"
                      value={formData.barcode}
                      disabled={true}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="ghost"
                    className="rounded-xl h-11 px-6 label-bold text-slate-500"
                    onClick={() => dispatch(setEditOpen(false))}
                  >
                    {config.strings.editNode.cancelBtn}
                  </Button>
                  <Button
                    className="rounded-xl h-11 bg-blue-600 hover:bg-blue-700 px-8 body-strong text-white border-0 shadow-lg shadow-blue-100"
                    onClick={handleEditSubmit}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? (
                      <Loader2 className="animate-spin icon-sm" />
                    ) : (
                      config.strings.editNode.submitBtn
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="border-0 shadow-2xl shadow-blue-900/20 rounded-2xl bg-slate-900 text-white p-3 pr-6 flex items-center gap-6 ring-8 ring-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/10">
                <Barcode className="icon-base" />
              </div>
              <div>
                <p className="label-bold !text-slate-500 mb-0.5">
                  {config.strings.activeFocus}
                </p>
                <p className="body-strong text-white !text-sm">
                  {selectedPath[selectedPath.length - 1].value}
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 text-slate-400 hover:text-white shadow-lg shadow-slate-300 hover:bg-orange-500 rounded-xl transition-all shadow-sm border border-white/10"
                onClick={openEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 text-rose-400   hover:text-white hover:bg-rose-600 rounded-xl transition-all shadow-sm border border-white/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                  <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                    <Trash2 className="icon-xl text-white animate-in zoom-in-50 duration-500 relative z-10" />
                    <AlertDialogTitle className="text-2xl font-black text-white tracking-tight relative z-10">
                      {config.strings.deleteAlert.title}
                    </AlertDialogTitle>
                  </div>
                  <div className="p-10 text-center flex flex-col items-center">
                    <AlertDialogHeader>
                      <AlertDialogDescription className="body-strong text-slate-500 pt-2 text-[15px] leading-relaxed  mx-auto text-center">
                        {config.strings.deleteAlert.descriptionTemplate.replace(
                          "{value}",
                          selectedPath[selectedPath.length - 1].value,
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-4 w-full mt-10">
                      <AlertDialogCancel className="rounded-xl border-slate-200 body-strong flex-1 h-12 text-slate-600 hover:bg-slate-50">
                        {config.strings.deleteAlert.cancelBtn}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-rose-600 hover:bg-rose-700 body-strong rounded-xl px-10 flex-1 h-12 text-white shadow-lg shadow-rose-100 transition-all"
                        onClick={onDeleteConfirm}
                      >
                        {config.strings.deleteAlert.confirmBtn}
                      </AlertDialogAction>
                    </div>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

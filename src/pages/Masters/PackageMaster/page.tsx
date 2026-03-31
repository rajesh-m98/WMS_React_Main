import * as React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
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
  Label,
  Separator,
  ScrollArea,
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
  Trash2,
  Loader2,
  Plus,
  Edit2,
  Smartphone,
  Box,
  Hash,
  X,
  CheckCircle2,
  Printer,
  Download,
  Settings2,
  Wifi,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  handleFetchAllPackages,
  handleCreatePackage,
  handleDeletePackage,
} from "@/app/manager/packageManager";
import { useDebounce } from "@/hooks/use-debounce";
import config from "./PackageConfig.json";
import { PackageDTO } from "@/core/models/master.model";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const PAGE_SIZE = 15;

// Printable component for barcodes
const PrintableBarcodes = forwardRef<
  HTMLDivElement,
  { codes: string[]; typeName: string }
>(({ codes, typeName }, ref) => (
  <div
    ref={ref}
    id="barcode-print-root"
    className="p-10 bg-white grid grid-cols-2 gap-8 w-[210mm]"
  >
    {codes.map((code, idx) => (
      <div
        key={idx}
        className="label-item border-2 border-slate-900 p-8 flex flex-col items-center justify-center gap-4 rounded-xl overflow-hidden w-full h-[80mm] bg-white box-border"
      >
        <div className="bg-white p-2 w-full flex justify-center overflow-hidden">
          <Barcode
            value={code}
            width={2.2}
            height={140}
            fontSize={0}
            displayValue={false}
            background="#ffffff"
            lineColor="#000000"
            margin={0}
          />
        </div>
      </div>
    ))}
  </div>
));

export const PackageMaster = () => {
  const dispatch = useAppDispatch();
  const {
    data: packages,
    loading,
    totalCount,
  } = useAppSelector((state) => state.master.packages);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageDTO | null>(null);

  // Generation state
  const [generateCount, setGenerateCount] = useState<number>(4);
  const [generatePrefix, setGeneratePrefix] = useState<string>("PKG");
  const [generatedBarcodes, setGeneratedBarcodes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [typeNameForBatch, setTypeNameForBatch] =
    useState<string>("Standard Package");

  // Form state
  const [formData, setFormData] = useState<Partial<PackageDTO>>({
    package_type_name: "",
    package_code: "",
    description: "",
    status: "Active",
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Barcodes_${typeNameForBatch}_${Date.now()}`,
  });

  const handleDownloadImage = async () => {
    if (!printRef.current) return;
    try {
      toast.info("Preparing digital media...");
      const dataUrl = await toPng(printRef.current, {
        quality: 1,
        backgroundColor: "#fff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `Labels_${typeNameForBatch}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to download image.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      toast.info("Generating high-speed PDF...");
      console.log("PDF Speed Engine: Initializing parallel capture...");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;

      const items = printRef.current.querySelectorAll(".label-item");

      // PARALLEL CAPTURE - Much faster!
      const imgDatas = await Promise.all(
        Array.from(items).map((item) =>
          toPng(item as HTMLElement, {
            pixelRatio: 2,
            backgroundColor: "#fff",
          }),
        ),
      );

      let currentHeight = margin;

      for (let i = 0; i < imgDatas.length; i++) {
        const imgData = imgDatas[i];
        const imgProps = pdf.getImageProperties(imgData);

        // Split into 2 columns
        const targetWidth = (pageWidth - margin * 3) / 2;
        const targetHeight = (imgProps.height * targetWidth) / imgProps.width;

        // Smart page break
        if (currentHeight + targetHeight > pageHeight - margin) {
          pdf.addPage();
          currentHeight = margin;
        }

        let xPos = margin;
        if (i % 2 !== 0) {
          xPos = pageWidth / 2 + margin / 2;
        }

        pdf.addImage(
          imgData,
          "PNG",
          xPos,
          currentHeight,
          targetWidth,
          targetHeight,
        );

        // Move currentHeight only after the second item in the row
        if (i % 2 !== 0 || i === imgDatas.length - 1) {
          currentHeight += targetHeight + 10;
        }
      }

      pdf.save(`Labels_${typeNameForBatch}_${Date.now()}.pdf`);
      toast.success("PDF Downloaded!");
      console.log("PDF Sync Complete.");
    } catch (err) {
      console.error("PDF Generate Error:", err);
      toast.error("Process failed. Try a smaller batch.");
    }
  };

  useEffect(() => {
    dispatch(
      handleFetchAllPackages({
        page,
        size: PAGE_SIZE,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  const handleOpenDialog = (item: PackageDTO | null = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        package_type_name: "",
        package_code: "",
        description: "",
        status: "Active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.package_code || !formData.package_type_name) {
      toast.error("Code and Name are required");
      return;
    }

    const success = await dispatch(
      handleCreatePackage(formData, editingItem?.id || undefined),
    );
    if (success) {
      toast.success(editingItem ? "Package updated" : "Package created");
      setIsDialogOpen(false);
      dispatch(
        handleFetchAllPackages({
          page,
          size: PAGE_SIZE,
          search: debouncedSearch,
        }),
      );
    }
  };

  const handleRemove = async (id: number) => {
    const success = await dispatch(handleDeletePackage(id));
    if (success) {
      toast.success("Package removed successfully");
      dispatch(
        handleFetchAllPackages({
          page,
          size: PAGE_SIZE,
          search: debouncedSearch,
        }),
      );
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const newCodes: string[] = [];
    const timestamp = new Date().getTime().toString().slice(-4);

    for (let i = 0; i < generateCount; i++) {
      let code = "";
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        code = `${generatePrefix}-${timestamp}-${random}`;

        const alreadyExists =
          packages.some((p) => p.package_code === code) ||
          newCodes.includes(code);
        if (!alreadyExists) {
          isUnique = true;
        }
        attempts++;
      }
      newCodes.push(code);
    }

    setGeneratedBarcodes(newCodes);
    setIsGenerating(false);
    toast.success(`${newCodes.length} barcodes generated uniquely`);
  };

  const saveGeneratedBarcodes = async () => {
    toast.info("Saving generated batch...");
    for (const code of generatedBarcodes) {
      await dispatch(
        handleCreatePackage({
          package_code: code,
          package_type_name: typeNameForBatch,
          description: `Batch generated at ${new Date().toLocaleDateString()}`,
          status: "Active",
        }),
      );
    }
    toast.success("Batch saved to master");
    setIsGenerateOpen(false);
    setGeneratedBarcodes([]);
    dispatch(handleFetchAllPackages({ page, size: PAGE_SIZE }));
  };

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
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-800 hover:text-white text-white body-strong transition-all shadow-lg shadow-blue-100 active:scale-95 flex-1 md:flex-none"
              onClick={() => setIsGenerateOpen(true)}
            >
              {/* <Hash className="icon-sm mr-2" /> */}
              <Plus className="icon-sm mr-2" />
              {config.strings.dialog.generate}
            </Button>
            {/* <Button
              className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white body-strong transition-all shadow-lg shadow-blue-100 active:scale-95 flex-1 md:flex-none"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="icon-sm mr-2" />
              {config.strings.dialog.create}
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-2xl p-4 rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    CODE
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    TYPE NAME
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider">
                    STATUS
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black text-slate-900 uppercase tracking-wider text-right">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : packages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest"
                    >
                      {config.strings.noItems}
                    </TableCell>
                  </TableRow>
                ) : (
                  packages.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="group hover:bg-blue-50/50 transition-all"
                    >
                      <TableCell className="px-6 py-4 text-[13px] font-black text-slate-950 uppercase">
                        {pkg.package_code}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-slate-600 font-medium">
                        {pkg.package_type_name}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-lg ${pkg.status === "Active" ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}
                        >
                          {pkg.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <div className="flex items-center justify-end gap-2 text-left transition-all">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100/50"
                            onClick={() => handleOpenDialog(pkg)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-slate-100/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                              <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2">
                                <Trash2 className="h-8 w-8 text-white animate-in zoom-in-50 duration-500" />
                                <AlertDialogTitle className="text-2xl font-black text-white">
                                  Delete Package
                                </AlertDialogTitle>
                              </div>
                              <div className="p-10 text-center flex flex-col items-center">
                                <AlertDialogDescription className="body-strong text-slate-500 text-[15px]">
                                  {config.strings.deleteDialog.descriptionTemplate.replace(
                                    "{code}",
                                    pkg.package_code,
                                  )}
                                </AlertDialogDescription>
                                <div className="flex gap-4 w-full mt-10">
                                  <AlertDialogCancel className="rounded-xl flex-1">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-rose-600 hover:bg-rose-700 rounded-xl flex-1 text-white"
                                    onClick={() => handleRemove(pkg.id)}
                                  >
                                    Delete
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
        </CardContent>
      </Card>

      {/* Manual Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 shadow-3xl bg-white rounded-[2rem]">
          <DialogHeader className="p-8 bg-slate-900 text-white">
            <DialogTitle className="text-2xl font-black tracking-tight">
              {editingItem
                ? config.strings.dialog.edit
                : config.strings.dialog.create}
            </DialogTitle>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase">
                  Package Code
                </Label>
                <Input
                  value={formData.package_code}
                  onChange={(e) =>
                    setFormData({ ...formData, package_code: e.target.value })
                  }
                  className="h-12 rounded-xl"
                  placeholder="e.g. PKG-001"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase">
                  Type Name
                </Label>
                <Input
                  value={formData.package_type_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      package_type_name: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl"
                  placeholder="e.g. Outer Box"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase">
                Description
              </Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="h-12 rounded-xl"
                placeholder="Detailed description..."
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="h-14 flex-1 rounded-2xl"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-14 flex-1 rounded-2xl bg-blue-600 text-white"
                onClick={handleSubmit}
              >
                Save Package
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Generation Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-7xl p-0 overflow-hidden border-0 shadow-4xl bg-white rounded-[2.5rem] max-h-[95vh] flex flex-col [&>button]:text-white/80 [&>button]:hover:text-white">
          <DialogHeader className="p-10 shrink-0 bg-gradient-to-r from-slate-900 to-blue-900 text-white relative">
            <div className="relative z-10">
              <DialogTitle className="text-2xl font-black tracking-lighter text-white uppercase">
                Batch Package Generator
              </DialogTitle>
              <p className="text-blue-200 text-sm mt-1 opacity-90 font-medium tracking-tight">
                Enterprise Label Provisioning Engine
              </p>
            </div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-20">
              <Wifi className="h-8 w-8 text-white animate-pulse" />
              <Settings2 className="h-12 w-12 text-white animate-spin-slow" />
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto px-10 pb-10">
            <div className="mt-8 flex flex-col lg:flex-row gap-10">
              {/* Configuration Panel */}
              <div className="flex-[1] space-y-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Type Name
                    </Label>
                    <Input
                      value={typeNameForBatch}
                      onChange={(e) => setTypeNameForBatch(e.target.value)}
                      className="h-12 rounded-xl bg-white border-slate-200 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Prefix
                      </Label>
                      <Input
                        value={generatePrefix}
                        onChange={(e) =>
                          setGeneratePrefix(e.target.value.toUpperCase())
                        }
                        className="h-12 rounded-xl bg-white border-slate-200"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Quantity
                      </Label>
                      <Input
                        type="number"
                        value={generateCount}
                        onChange={(e) =>
                          setGenerateCount(Number(e.target.value))
                        }
                        className="h-12 rounded-xl bg-white border-slate-200"
                        min={1}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-14 rounded-2xl bg-blue-600 text-white hover:bg-slate-900 transition-all font-black text-lg shadow-xl shadow-blue-50"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="mr-2" size={20} />
                    )}
                    Build Batch
                  </Button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="flex-[2] space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Generated Batch
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      Ready for registration
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 rounded-xl border-2 border-blue-100 bg-blue-50/50 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      onClick={handleDownloadImage}
                      disabled={generatedBarcodes.length === 0}
                    >
                      <ImageIcon className="mr-2 h-3.5 w-3.5" /> Download Image
                      (PNG)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-6 rounded-xl border-2 border-emerald-100 bg-emerald-50/50 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      onClick={handleDownloadPDF}
                      disabled={generatedBarcodes.length === 0}
                    >
                      <Download className="mr-2 h-3.5 w-3.5" /> Download PDF
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  {generatedBarcodes.length > 0 ? (
                    generatedBarcodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4 group hover:border-blue-600 transition-all shadow-sm"
                      >
                        <div className="bg-white w-full p-6 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                          <Barcode
                            value={code}
                            width={1.2}
                            height={50}
                            fontSize={10}
                            background="transparent"
                          />
                        </div>
                        <span className="font-black text-[12px] text-slate-900 tracking-tight uppercase border-t border-slate-200 pt-3 w-full text-center">
                          {typeNameForBatch}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full h-64 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-slate-50/20">
                      <div className="p-6 rounded-full bg-slate-100/50">
                        <Box className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        Create Batch
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-5 shrink-0 rounded-b-[2.5rem]">
            <Button
              variant="ghost"
              className="h-14 px-10 rounded-2xl text-slate-800 bg-gray-200 font-bold hover:text-slate-600 uppercase tracking-widest text-[11px]"
              onClick={() => setIsGenerateOpen(false)}
            >
              Discard
            </Button>
            <Button
              className="h-14 px-14 rounded-2xl bg-blue-600 text-white font-black text-lg transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:bg-slate-200 disabled:shadow-none uppercase tracking-tighter"
              disabled={generatedBarcodes.length === 0}
              onClick={saveGeneratedBarcodes}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Off-screen printable barcodes component (Optimized for High-Speed PDF) */}
      <div className="opacity-0 pointer-events-none absolute -bottom-[300%] left-0">
        <PrintableBarcodes
          ref={printRef}
          codes={generatedBarcodes}
          typeName={typeNameForBatch}
        />
      </div>
    </div>
  );
};

export default PackageMaster;

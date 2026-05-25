import { useState, useEffect, useRef, forwardRef, useMemo } from "react";
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
  ScrollArea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Wifi,
  Settings2,
  Download,
  ImageIcon,
  Warehouse,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/store";
import {
  handleFetchAllPackages,
  handleDeletePackage,
  handleCreatePackage,
} from "@/app/manager/packageManager";
import { clearPackages } from "@/app/store/packageSlice";
import { useDebounce } from "@/hooks/use-debounce";
import config from "./PackageConfig.json";
import { PackageDTO } from "@/core/models/master.model";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";

const PAGE_SIZE = 10;

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
        <div className="text-center font-black text-xl uppercase tracking-widest text-slate-900 border-t-2 border-slate-900 pt-4 w-full">
          {typeName}
        </div>
      </div>
    ))}
  </div>
));

export const PackageList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: packages,
    loading,
    totalCount,
  } = useAppSelector((state) => state.package);
  const { data: warehouses } = useAppSelector((state) => state.warehouse);

  const getWarehouseNameByCode = (code: string): string => {
    if (!code) return "Warehouse";
    const found = warehouses.find(
      (w) => w.warehouse_code?.toLowerCase() === code.toLowerCase(),
    );
    return found ? found.warehouse_name : "Warehouse";
  };

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Generation state
  const [generateCount, setGenerateCount] = useState<number>(4);
  const [generatePrefix, setGeneratePrefix] = useState<string>("PKG");
  const [generatedBarcodes, setGeneratedBarcodes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [typeNameForBatch, setTypeNameForBatch] =
    useState<string>("Standard Package");

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
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;

      const items = printRef.current.querySelectorAll(".label-item");

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

        const targetWidth = (pageWidth - margin * 3) / 2;
        const targetHeight = (imgProps.height * targetWidth) / imgProps.width;

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

        if (i % 2 !== 0 || i === imgDatas.length - 1) {
          currentHeight += targetHeight + 10;
        }
      }

      pdf.save(`Labels_${typeNameForBatch}_${Date.now()}.pdf`);
      toast.success("PDF Downloaded!");
    } catch (err) {
      console.error("PDF Generate Error:", err);
      toast.error("Process failed. Try a smaller batch.");
    }
  };

  useEffect(() => {
    dispatch(handleFetchAllWarehouses({ is_paginate: false }));
    return () => {
      dispatch(clearPackages());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      handleFetchAllPackages({
        is_paginate: false,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, debouncedSearch]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const newCodes: string[] = [];
    const timestamp = new Date().getTime().toString().slice(-4);

    for (let i = 0; i < generateCount; i++) {
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const code = `${generatePrefix}-${timestamp}-${random}`;
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
          package_type_name: typeNameForBatch,
          package_code: code,
          package_type: 1, // Default to 1
          status: "Active",
        }),
      );
    }
    toast.success("Batch saved to master");
    setIsGenerateOpen(false);
    setGeneratedBarcodes([]);
    dispatch(handleFetchAllPackages({ is_paginate: false }));
  };

  // Group packages by whscode
  const groupedPackages = useMemo(() => {
    const groups: Record<
      string,
      { whscode: string; name: string; count: number; id: number }
    > = {};
    packages.forEach((pkg: any) => {
      const whsCode = pkg.whscode || "---";
      const whsName =
        pkg.whsname || pkg.name || (pkg.whscode ? "Warehouse" : "---");

      if (!groups[whsCode]) {
        groups[whsCode] = {
          whscode: whsCode,
          name: whsName,
          count: 0,
          id: pkg.id,
        };
      }
      groups[whsCode].count++;
    });
    return Object.values(groups);
  }, [packages]);

  const totalPages = Math.ceil(groupedPackages.length / PAGE_SIZE);
  const paginatedGroups = useMemo(() => {
    return groupedPackages.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [groupedPackages, page]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="shrink-0 flex items-center justify-between px-8 py-6 bg-white border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl w-full">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-blue-50">
            <Box className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Package <span className="text-blue-600">Master</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Warehouse Asset & Barcode Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Search By Warehouse Name ..."
              className="pl-12 h-12 w-80 rounded-lg bg-slate-50 border-1 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm font-black shadow-lg shadow-slate-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 flex gap-2 active:scale-95 transition-all"
            onClick={() => navigate("/masters/packages/print")}
          >
            <Printer className="w-4 h-4" />
            Print Label
          </Button>
          <Button
            className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100 flex gap-2 active:scale-95 transition-all"
            onClick={() => navigate("/masters/packages/create")}
          >
            <Plus className="w-4 h-4" />
            Add Package
          </Button>
        </div>
      </div>

      <Card className="bborder-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 hover:bg-slate-100 border-b border-slate-200">
                  <TableHead className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    SL No
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Warehouse Name
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Whs Code
                  </TableHead>
                  <TableHead className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Generated Barcodes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-14 w-14 text-blue-600 animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                          Fetching Packages List...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-32 text-center text-slate-400 font-black uppercase tracking-widest"
                    >
                      No Assets Found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups.map((pkg, idx) => (
                    <TableRow
                      key={pkg.whscode}
                      className="hover:bg-blue-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group cursor-pointer"
                      onClick={() =>
                        navigate(`/masters/packages/detail/${pkg.whscode}`)
                      }
                    >
                      <TableCell className="px-8 py-5 font-black text-slate-700 text-sm">
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                            <Warehouse className="w-4 h-4 text-blue-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            {getWarehouseNameByCode(pkg.whscode)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200 font-black text-sm px-3 py-1 rounded-lg"
                        >
                          {pkg.whscode}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-center">
                        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-0 font-black text-sm px-4 py-1.5 rounded-xl shadow-sm shadow-blue-100/50">
                          {pkg.count} Barcodes
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION SECTION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-10 py-8 bg-slate-50/50 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Showing page <span className="text-blue-600">{page}</span> of{" "}
                  <span className="text-blue-600">{totalPages}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-12 px-8 rounded-2xl border-0 bg-white hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 transition-all active:scale-95 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-12 px-8 rounded-2xl border-0 bg-white hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 transition-all active:scale-95 disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Generation Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent className="max-w-7xl p-0 overflow-hidden border-0 shadow-4xl bg-white rounded-[3rem] max-h-[90vh] flex flex-col">
          <DialogHeader className="p-12 shrink-0 bg-slate-950 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-20" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <DialogTitle className="text-3xl font-black tracking-tighter text-white uppercase italic">
                  Packaging Engine
                </DialogTitle>
                <p className="text-blue-400 text-xs mt-2 font-black uppercase tracking-[0.3em] opacity-80">
                  Mass Provisioning & Label Services
                </p>
              </div>
              <div className="flex items-center gap-6 opacity-40">
                <Wifi className="h-10 w-10 text-white animate-pulse" />
                <Settings2 className="h-14 w-14 text-white animate-spin-slow" />
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto px-12 pb-12">
            <div className="mt-10 flex flex-col lg:flex-row gap-12">
              {/* Configuration Panel */}
              <div className="flex-[1] space-y-10 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Box Type Designation
                    </label>
                    <Input
                      value={typeNameForBatch}
                      onChange={(e) => setTypeNameForBatch(e.target.value)}
                      className="h-14 rounded-2xl bg-white border-slate-200 focus:ring-4 focus:ring-blue-100 body-strong shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Prefix
                      </label>
                      <Input
                        value={generatePrefix}
                        onChange={(e) =>
                          setGeneratePrefix(e.target.value.toUpperCase())
                        }
                        className="h-14 rounded-2xl bg-white border-slate-200 text-center font-black"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Volume
                      </label>
                      <Input
                        type="number"
                        value={generateCount}
                        onChange={(e) =>
                          setGenerateCount(Number(e.target.value))
                        }
                        className="h-14 rounded-2xl bg-white border-slate-200 text-center font-black"
                        min={1}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-16 rounded-[1.5rem] bg-blue-600 text-white hover:bg-slate-900 transition-all font-black text-xl shadow-2xl shadow-blue-200 active:scale-95 group mt-4"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <RefreshCw
                        className="mr-3 group-hover:rotate-180 transition-transform duration-700"
                        size={24}
                      />
                    )}
                    Generate Batch
                  </Button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="flex-[2] space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      Sequence Verification
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                      {generatedBarcodes.length} Labels Prepared
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="h-12 px-5 rounded-2xl border-2 border-blue-100 bg-blue-50/50 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      onClick={handleDownloadImage}
                      disabled={generatedBarcodes.length === 0}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" /> PNG Export
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 px-5 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      onClick={handleDownloadPDF}
                      disabled={generatedBarcodes.length === 0}
                    >
                      <Download className="mr-2 h-4 w-4" /> PDF Export
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-2">
                  {generatedBarcodes.length > 0 ? (
                    generatedBarcodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 flex flex-col items-center gap-6 group hover:border-blue-600 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-50/50"
                      >
                        <div className="bg-slate-50/50 w-full p-8 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-slate-100">
                          <Barcode
                            value={code}
                            width={1.5}
                            height={60}
                            fontSize={12}
                            background="transparent"
                            fontOptions="bold"
                          />
                        </div>
                        <span className="font-black text-[14px] text-slate-900 tracking-tighter uppercase border-t-2 border-slate-50 pt-4 w-full text-center">
                          {typeNameForBatch}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full h-80 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-6 bg-slate-50/30">
                      <div className="p-8 rounded-full bg-slate-100/50 shadow-inner">
                        <Box className="h-14 w-14 text-slate-200" />
                      </div>
                      <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        System Ready for Generation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-10 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-5 shrink-0">
            <Button
              variant="ghost"
              className="h-16 px-12 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all"
              onClick={() => setIsGenerateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-16 px-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
              disabled={generatedBarcodes.length === 0}
              onClick={saveGeneratedBarcodes}
            >
              Commit to Master
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden printing target */}
      <div className="hidden">
        <PrintableBarcodes
          ref={printRef}
          codes={generatedBarcodes}
          typeName={typeNameForBatch}
        />
      </div>

    </div>
  );
};

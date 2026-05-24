import { useState, useRef, forwardRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Input, Button, Label } from "@/components/ui";
import {
  Box,
  RefreshCw,
  Loader2,
  Download,
  ImageIcon,
  X,
  ChevronDown,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleCreatePackage,
  handleGenerateBarcodes,
} from "@/app/manager/packageManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";
import Barcode from "react-barcode";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

// Printable component for high-quality capture
const PrintableBarcodes = forwardRef<
  HTMLDivElement,
  { codes: string[]; typeName: string }
>(({ codes, typeName }, ref) => (
  <div ref={ref} className="p-10 bg-white grid grid-cols-2 gap-8 w-[210mm]">
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
        <div className="text-center font-bold text-xl uppercase text-slate-900 border-t-2 border-slate-900 pt-4 w-full">
          {typeName}
        </div>
      </div>
    ))}
  </div>
));

export const CreatePackage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: warehouses } = useAppSelector((state) => state.warehouse);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number>(0);
  const [selectedWhsCode, setSelectedWhsCode] = useState<string>("");
  const [batchName, setBatchName] = useState("Warehouse Asset");
  const [packageType] = useState(2); // Type 2 = Warehouse
  const [batchCount, setBatchCount] = useState(10);
  const [generatedBarcodes, setGeneratedBarcodes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    dispatch(handleFetchAllWarehouses({ is_paginate: false }));
  }, [dispatch]);

  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerateBatch = async () => {
    if (!selectedWarehouseId) {
      toast.error("Please select a target warehouse");
      return;
    }
    if (batchCount <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setIsGenerating(true);
    const result = await dispatch(
      handleGenerateBarcodes({
        package_type: packageType,
        warehouse_id: selectedWarehouseId,
        whscode: selectedWhsCode,
        quntity: batchCount,
      }),
    );

    if (result && Array.isArray(result)) {
      setGeneratedBarcodes(result);
      toast.success(`${result.length} sequences generated from server`);
    }
    setIsGenerating(false);
  };

  const handleSaveBatch = async () => {
    if (generatedBarcodes.length === 0) {
      toast.error("Please generate barcodes first");
      return;
    }

    toast.info("Saving packages...");
    let successCount = 0;

    for (const code of generatedBarcodes) {
      const success = await dispatch(
        handleCreatePackage({
          package_type_name: batchName,
          package_code: code,
          package_type: packageType,
          warehouse_id: selectedWarehouseId,
          whscode: selectedWhsCode,
          status: "Active",
        }),
      );
      if (success) successCount++;
    }

    if (successCount > 0) {
      toast.success(`${successCount} packages registered`);
      navigate("/masters/packages");
    } else {
      toast.error("Failed to register packages");
    }
  };

  const downloadAsImage = async () => {
    if (!printRef.current || generatedBarcodes.length === 0) return;
    try {
      toast.info("Preparing image...");
      const dataUrl = await toPng(printRef.current, {
        quality: 1,
        backgroundColor: "#fff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `Labels_Warehouse.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  const downloadAsPDF = async () => {
    if (!printRef.current || generatedBarcodes.length === 0) return;
    try {
      toast.info("Generating PDF...");
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
        if (i % 2 !== 0) xPos = pageWidth / 2 + margin / 2;

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

      pdf.save(`Labels_Warehouse.pdf`);
      toast.success("PDF Downloaded");
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Configuration
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">
                  Select Warehouse
                </Label>
                <div className="relative group">
                  <select
                    className="h-11 w-full pl-4 pr-12 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all bg-white text-sm font-bold outline-none appearance-none cursor-pointer hover:border-blue-300 group-hover:bg-slate-50/50"
                    value={selectedWarehouseId}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const whs = warehouses.find((w) => w.id === id);
                      setSelectedWarehouseId(id);
                      setSelectedWhsCode(whs?.warehouse_Code || "");
                    }}
                  >
                    <option value="0" disabled>
                      Select Warehouse Node
                    </option>
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>
                        {wh.warehouse_Code} - {wh.warehouse_Name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                {selectedWhsCode && (
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest pl-1 mt-1">
                    Active Node: {selectedWhsCode}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">
                  Quantity (Number of Packages)
                </Label>
                <Input
                  type="number"
                  value={batchCount === 0 ? "" : batchCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBatchCount(val === "" ? 0 : parseInt(val, 10));
                  }}
                  className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-bold"
                  min={1}
                  placeholder="0"
                />
              </div>

              <Button
                className="w-full h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs shadow-md shadow-blue-100 transition-all active:scale-95"
                onClick={handleGenerateBatch}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Generate Sequence
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-slate-200 shadow-sm rounded-2xl bg-blue-50/30 text-slate-900 overflow-hidden">
          <CardContent className="p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-600">
                  Sequence Preview
                </h3>
                <p className="text-[11px] text-blue-400 font-semibold">
                  {generatedBarcodes.length} Barcodes prepared
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm"
                  disabled={generatedBarcodes.length === 0}
                  onClick={downloadAsImage}
                >
                  <ImageIcon className="mr-2 h-3.5 w-3.5" /> PNG
                </Button>
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm"
                  disabled={generatedBarcodes.length === 0}
                  onClick={downloadAsPDF}
                >
                  <Download className="mr-2 h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-blue-100">
              {generatedBarcodes.length > 0 ? (
                generatedBarcodes.map((code, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-blue-50 rounded-xl p-4 flex flex-col items-center gap-3 shadow-sm hover:border-blue-300 transition-all"
                  >
                    <div className="bg-slate-50 w-full p-2 rounded-lg flex items-center justify-center border border-slate-100">
                      <Barcode
                        value={code}
                        width={1}
                        height={35}
                        fontSize={10}
                        background="transparent"
                      />
                    </div>
                    <span className="font-bold text-[10px] text-slate-500">
                      {code}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-full h-60 flex flex-col items-center justify-center opacity-40 border-2 border-dashed border-blue-100 rounded-2xl bg-white">
                  <Box className="h-12 w-12 mb-4 text-blue-200" />
                  <span className="text-xs font-semibold text-blue-300">
                    Generate barcodes to see preview
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
        <Button
          variant="outline"
          className="h-11 px-8 rounded-xl border border-slate-200 font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
          onClick={() => navigate("/masters/packages")}
        >
          <X className="mr-2 h-4 w-4" /> Discard
        </Button>
        <Button
          className="h-11 px-10 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
          onClick={handleSaveBatch}
          disabled={isGenerating || generatedBarcodes.length === 0}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save & Register Barcodes
        </Button>
      </div>

      <div
        className="fixed -top-[10000px] -left-[10000px] bg-white pointer-events-none"
        style={{ width: "210mm" }}
      >
        <PrintableBarcodes
          ref={printRef}
          codes={generatedBarcodes}
          typeName={batchName}
        />
      </div>
    </div>
  );
};

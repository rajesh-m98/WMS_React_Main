import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Input, Button, Label } from "@/components/ui";
import {
  RefreshCw,
  Loader2,
  X,
  ChevronDown,
  Search,
  Check,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleCreatePackage,
  handleGenerateBarcodes,
} from "@/app/manager/packageManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";

// ─── Local Searchable Dropdown Component ────────────────────────────────────
interface SearchableDropdownProps {
  options: { value: string | number; label: string; code?: string }[];
  placeholder: string;
  value: string | number;
  onChange: (value: string | number, code: string) => void;
  disabled?: boolean;
}

const SearchableDropdown = ({
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    (opt.code && opt.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className="h-11 w-full px-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 transition-all bg-white text-sm font-bold flex items-center justify-between cursor-pointer disabled:opacity-50 text-slate-900 text-left outline-none hover:border-blue-300"
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
            <Search className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              autoFocus
              placeholder="Search warehouse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold outline-none py-1.5 text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value, opt.code || "");
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-sm font-bold text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 text-center font-semibold">
                No matching warehouses found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CreatePackage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: warehouses } = useAppSelector((state) => state.warehouse);
  
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number>(0);
  const [selectedWhsCode, setSelectedWhsCode] = useState<string>("");
  const [batchCount, setBatchCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    dispatch(handleFetchAllWarehouses({ is_paginate: false }));
  }, [dispatch]);

  const handleGenerateAndSave = async () => {
    if (!selectedWarehouseId) {
      toast.error("Please select a target warehouse");
      return;
    }
    if (batchCount <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setIsGenerating(true);
    toast.info("Generating sequences from SAP...");

    // 1. Generate barcodes
    const generated = await dispatch(
      handleGenerateBarcodes({
        package_type: 2, // Type 2 = Warehouse Asset
        warehouse_id: selectedWarehouseId,
        whscode: selectedWhsCode,
        quntity: batchCount,
      }),
    );

    if (generated && Array.isArray(generated) && generated.length > 0) {
      toast.info(`Registering ${generated.length} packages to database...`);
      let successCount = 0;

      // 2. Loop and save each package
      for (const code of generated) {
        const success = await dispatch(
          handleCreatePackage({
            package_type_name: "Warehouse Asset",
            package_code: code,
            package_type: 2,
            warehouse_id: selectedWarehouseId,
            whscode: selectedWhsCode,
            status: "Active",
          }),
        );
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast.success(`🎉 Successfully created and registered ${successCount} packages!`);
        navigate("/masters/packages");
      } else {
        toast.error("Failed to register generated packages");
      }
    } else {
      toast.error("Failed to generate barcodes from SAP API");
    }
    setIsGenerating(false);
  };

  // Map warehouses for SearchableDropdown
  const warehouseOptions = warehouses.map((wh) => ({
    value: wh.id,
    label: `${wh.warehouse_code} - ${wh.warehouse_name}`,
    code: wh.warehouse_code,
  }));

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full max-w-2xl border border-slate-200 shadow-xl rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <button
              onClick={() => navigate("/masters/packages")}
              disabled={isGenerating}
              className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer group disabled:opacity-50 shrink-0"
              title="Back to Packages"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Configuration
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Generate & Register Barcode Assets
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Warehouse Dropdown */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">
                Select Warehouse
              </Label>
              <SearchableDropdown
                options={warehouseOptions}
                placeholder="Select Warehouse Node"
                value={selectedWarehouseId}
                onChange={(val, code) => {
                  setSelectedWarehouseId(Number(val));
                  setSelectedWhsCode(code);
                }}
                disabled={isGenerating}
              />
              {selectedWhsCode && (
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest pl-1 mt-1">
                  Active Node: {selectedWhsCode}
                </p>
              )}
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">
                Quantity (Number of Packages)
              </Label>
              <Input
                type="number"
                disabled={isGenerating}
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

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-md shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 order-1 sm:order-2"
                onClick={handleGenerateAndSave}
                disabled={isGenerating || !selectedWarehouseId || batchCount <= 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Generate Sequence</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all order-2 sm:order-1"
                onClick={() => navigate("/masters/packages")}
                disabled={isGenerating}
              >
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

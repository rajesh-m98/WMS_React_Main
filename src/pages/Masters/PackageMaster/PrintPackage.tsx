import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Button, Label } from "@/components/ui";
import {
  Printer,
  Loader2,
  Warehouse,
  Package,
  ChevronDown,
  Search,
  Check,
  ArrowLeft,
  X,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import axios from "axios";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PackagingItem {
  id: number;
  barcode: string;
  whscode: string;
}

// ─── Local Searchable Dropdown Component ────────────────────────────────────
interface SearchableDropdownProps {
  options: { value: string; label: string; code?: string }[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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
        <span className={selectedOption ? "text-slate-900 text-ellipsis overflow-hidden whitespace-nowrap" : "text-slate-400"}>
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
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-sm font-bold text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-ellipsis overflow-hidden whitespace-nowrap">{opt.label}</span>
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

// ─── Print Sheet Component ──────────────────────────────────────────────────
const PrintSheet = React.forwardRef<
  HTMLDivElement,
  { packages: PackagingItem[]; warehouses: any[] }
>(({ packages, warehouses }, ref) => (
  <div
    ref={ref}
    style={{
      backgroundColor: "#fff",
      boxSizing: "border-box",
      width: "100%",
    }}
  >
    <style>{`
      @media print {
        @page {
          margin: 0;
          size: auto;
        }
        body {
          margin: 0;
        }
      }
    `}</style>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0",
        paddingTop: "15mm",
      }}
    >
      {packages.map((pkg, idx) => {
        const wh = warehouses.find(
          (w) => w.warehouse_code?.trim().toLowerCase() === pkg.whscode?.trim().toLowerCase()
        );
        const displayName = wh ? wh.warehouse_name : pkg.whscode;

        return (
          <div
            key={`${pkg.id}-${idx}`}
            style={{
              border: "1.5px solid #222",
              borderRadius: 8,
              padding: "6mm 4mm",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              width: "90mm",
              height: "45mm",
              boxSizing: "border-box",
              margin: "0 auto 8mm auto",
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: "#111",
                margin: "0 0 3mm 0",
                textAlign: "center",
                fontWeight: "black",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                wordBreak: "break-all",
                fontFamily: "sans-serif",
              }}
            >
              {displayName}
            </p>

            <div style={{ width: "100%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
              <Barcode
                value={pkg.barcode || `ID-${pkg.id}`}
                width={1.8}
                height={65}
                fontSize={0}
                displayValue={false}
                background="#ffffff"
                lineColor="#000000"
                margin={0}
              />
            </div>

            <p
              style={{
                fontSize: 10,
                color: "#222",
                margin: "2mm 0 0 0",
                textAlign: "center",
                fontFamily: "monospace",
                letterSpacing: 0.5,
                wordBreak: "break-all",
                fontWeight: "bold",
              }}
            >
              {pkg.barcode}
            </p>
          </div>
        );
      })}
    </div>
  </div>
));

export const PrintPackage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: warehouses } = useAppSelector((state) => state.warehouse);

  const [allPackages, setAllPackages] = useState<PackagingItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [selectedWhscode, setSelectedWhscode] = useState("");

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Labels_${selectedWhscode}`,
    onAfterPrint: () => {
      toast.success(`✅ ${packagesForWarehouse.length} label(s) sent to printer`);
      navigate("/masters/packages");
    },
  });

  useEffect(() => {
    fetchPackages();
    if (warehouses.length === 0) {
      dispatch(handleFetchAllWarehouses({ is_paginate: false }));
    }
  }, [dispatch, warehouses.length]);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await axios.get(
        "http://115.244.101.29:9096/api/v1/packaging/get_all_packagings",
        { params: { is_paginate: false, page: 1, size: 1000 } }
      );
      const raw: any[] = res.data?.data?.items || res.data?.data || [];
      setAllPackages(
        raw.map((p) => ({ id: p.id, barcode: p.barcode, whscode: p.whscode || "" }))
      );
    } catch {
      toast.error("Failed to load packaging list.");
    } finally {
      setLoadingPackages(false);
    }
  };

  const warehouseCodes = useMemo(
    () => Array.from(new Set(allPackages.map((p) => p.whscode).filter(Boolean))),
    [allPackages]
  );

  const packagesForWarehouse = useMemo(
    () => allPackages.filter((p) => p.whscode === selectedWhscode),
    [allPackages, selectedWhscode]
  );

  // Map distinct warehouses for SearchableDropdown
  const warehouseDropdownOptions = useMemo(() => {
    return warehouseCodes.map((code) => {
      const wh = warehouses.find(
        (w) => w.warehouse_code?.trim().toLowerCase() === code.trim().toLowerCase()
      );
      const count = allPackages.filter((p) => p.whscode === code).length;
      const whName = wh ? wh.warehouse_name : "Warehouse";
      return {
        value: code,
        label: `${code} - ${whName} (${count})`,
        code: code,
      };
    });
  }, [warehouseCodes, warehouses, allPackages]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="w-full max-w-2xl border border-slate-200 shadow-xl rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-10 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <button
              onClick={() => navigate("/masters/packages")}
              disabled={loadingPackages}
              className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer group disabled:opacity-50 shrink-0"
              title="Back to Packages"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Print Labels
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Single column thermal roll format
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {loadingPackages ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Loading packages...
                </p>
              </div>
            ) : (
              <>
                {/* Searchable Warehouse Dropdown */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 pl-0.5">
                    <Warehouse className="w-3.5 h-3.5 text-blue-500" />
                    Select Warehouse
                  </Label>
                  <SearchableDropdown
                    options={warehouseDropdownOptions}
                    placeholder="Search and select warehouse..."
                    value={selectedWhscode}
                    onChange={(val) => setSelectedWhscode(val)}
                  />
                </div>

                {/* Summary */}
                {selectedWhscode && packagesForWarehouse.length > 0 && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <Package className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce-slow" />
                    <div>
                      <p className="text-sm font-black text-emerald-900">
                        {packagesForWarehouse.length} label(s) ready to print
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">
                        Warehouse: {selectedWhscode} · Stacked layout
                      </p>
                    </div>
                  </div>
                )}

                {/* Tip */}
                <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed pt-2">
                  💡 Browser print dialog will open — select your <strong>TSC</strong> printer
                </p>
              </>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-md shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 order-1 sm:order-2"
                onClick={() => handlePrint()}
                disabled={!selectedWhscode || packagesForWarehouse.length === 0 || loadingPackages}
              >
                <Printer className="h-4 w-4" />
                <span>Print {packagesForWarehouse.length > 0 ? `(${packagesForWarehouse.length})` : ""}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border border-slate-200 font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all order-2 sm:order-1"
                onClick={() => navigate("/masters/packages")}
                disabled={loadingPackages}
              >
                <X className="mr-1.5 h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden print target — off screen */}
      <div className="fixed -top-[9999px] -left-[9999px] pointer-events-none">
        <PrintSheet
          ref={printRef}
          packages={packagesForWarehouse}
          warehouses={warehouses}
        />
      </div>
    </div>
  );
};

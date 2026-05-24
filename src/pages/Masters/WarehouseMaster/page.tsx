import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Search,
  Upload,
  RefreshCw,
  Building2,
  FileText,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DatabaseZap,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui";
import { Badge } from "@/components/ui";
import * as XLSX from "xlsx";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchAllWarehouses,
  handleRefreshWarehouse,
} from "@/app/manager/warehouseManager";
import { useDebounce } from "@/hooks/use-debounce";
import { WarehouseItem } from "@/app/store/warehouseSlice";

export const WarehouseMaster = () => {
  const dispatch = useAppDispatch();
  const {
    data: warehouses,
    loading: isFetching,
    totalCount,
  } = useAppSelector((state) => state.warehouse);

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(
      handleFetchAllWarehouses({
        page,
        size: pageSize,
        is_paginate: true,
      }),
    );
  }, [dispatch, page]);

  // Handle search separately or integrated
  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch === "") {
      dispatch(
        handleFetchAllWarehouses({
          page: 1,
          size: pageSize,
          is_paginate: true,
          // If API supports search param, add it here
        }),
      );
      setPage(1);
    }
  }, [debouncedSearch, dispatch]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls");
    const isCsv = fileName.endsWith(".csv");

    if (!isExcel && !isCsv) {
      toast.error("Please upload a valid CSV or Excel file");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: isCsv ? "string" : "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const extractedData: any[] = jsonData.map((row: any) => {
          // Helper to find value by key name case-insensitively
          const getValue = (targetKey: string) => {
            const key = Object.keys(row).find(
              (k) => k.toLowerCase() === targetKey.toLowerCase(),
            );
            return key ? String(row[key]) : "";
          };

          return {
            warehouse_Code: getValue("warehouse_Code") || "",
            warehouse_Name: getValue("warehouse_Name") || "",
            city: getValue("city") || "",
            state: getValue("state") || "",
          };
        });

        // For now, we just toast, as we should probably have a "Save to DB" action
        toast.success(
          `${extractedData.length} Warehouses parsed from file. API integration recommended for saving.`,
        );
      } catch (error) {
        toast.error("Failed to parse file. Check format.");
        console.error(error);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsLoading(false);
      }
    };

    if (isCsv) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleRefresh = async () => {
    toast.info("Syncing with Master Data...");
    const success = await dispatch(handleRefreshWarehouse());
    if (success) {
      toast.success("Warehouse data synchronized");
      dispatch(handleFetchAllWarehouses({ page: 1, size: pageSize }));
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Search by Warehouse Name (min 5 characters)..."
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-3/4"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search.length > 0 && search.length < 5 && (
              <p className="absolute -bottom-6 left-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">
                Type {5 - search.length} more characters to filter...
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv, .xlsx, .xls"
              className="hidden"
            />
            {/* <Button
              className="h-12 px-6 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all active:scale-95 flex items-center gap-2 group shadow-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="icon-sm group-hover:-translate-y-1 transition-transform" />
              <span className="uppercase tracking-widest text-[10px] font-bold">
                Import File
              </span>
            </Button> */}

            <Button
              className="h-12 px-6 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all active:scale-95 flex items-center gap-2 group shadow-sm"
              onClick={handleRefresh}
            >
              <RefreshCw
                className={`icon-sm ${isFetching ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
              <span className="uppercase tracking-widest text-[10px] font-bold">
                Refresh
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-1 border-slate-200 shadow-lg shadow-slate-300 rounded-2xl overflow-hidden bg-white relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-slate-100 border-b border-slate-200 hover:bg-slate-100">
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[100px]">
                    SL NO
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap">
                    WAREHOUSE NAME
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[200px]">
                    WAREHOUSE CODE
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[180px]">
                    CITY
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap w-[150px]">
                    STATE
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching || isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="icon-xl text-blue-600 animate-spin" />
                        <p className="body-strong text-slate-400 uppercase tracking-[0.2em]">
                          {isLoading
                            ? "Processing File Data..."
                            : "Fetching Warehouse Data..."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : warehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-60 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <Building2 className="icon-xl" />
                        <p className="text-sm font-black uppercase tracking-widest">
                          No Warehouse Data Found
                        </p>
                        <Button
                          variant="link"
                          className="text-blue-600 font-bold uppercase text-[10px]"
                          onClick={handleRefresh}
                        >
                          Sync from Backend Master
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  warehouses.map((wh, index) => (
                    <TableRow
                      key={wh.id}
                      className="group border-b border-slate-50 even:bg-slate-50/20 hover:bg-blue-50/50 transition-all font-semibold text-slate-700"
                    >
                      <TableCell className="px-6 py-5 text-xs font-bold text-slate-900">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Building2 className="icon-sm text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {wh.warehouse_Name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5 font-mono text-[12px] font-black text-blue-600 tracking-wider">
                        {wh.warehouse_Code}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {wh.city || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className="rounded-lg border-slate-200 bg-white font-bold text-[10px] text-slate-600 px-3 py-1 uppercase tracking-widest"
                        >
                          {wh.state}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalCount > 0 && (
            <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/30">
              <div className="flex items-center gap-3 bg-blue-600 px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-100">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Total Entries
                </span>
                <span className="h-4 w-[1px] bg-white/20" />
                <span className="text-sm font-black text-white tabular-nums">
                  {totalCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-10 w-10 rounded-xl border border-slate-200 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95 bg-white"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  <ChevronsLeft className="h-4 w-4 text-slate-600" />
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-10 rounded-xl border border-slate-200 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95 bg-white"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </Button>

                <div className="flex items-center gap-1.5 px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">
                    Page
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-900 shadow-sm">
                    {page}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mx-2">
                    of
                  </span>
                  <span className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                    {totalPages || 1}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="h-10 w-10 rounded-xl border border-slate-200 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95 bg-white"
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-10 rounded-xl border border-slate-200 p-0 flex items-center justify-center disabled:opacity-30 transition-all active:scale-95 bg-white"
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(totalPages)}
                >
                  <ChevronsRight className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarehouseMaster;

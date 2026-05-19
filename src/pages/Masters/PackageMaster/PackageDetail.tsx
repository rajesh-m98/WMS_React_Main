import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  ArrowLeft,
  Loader2,
  Box,
  CheckCircle2,
  XCircle,
  Tag,
  Warehouse,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchAllPackages } from "@/app/manager/packageManager";

const PackageDetail = () => {
  const { whsCode } = useParams<{ whsCode: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: packages, loading } = useAppSelector((state) => state.package);

  useEffect(() => {
    // Fetch all packages for this warehouse (non-paginated for detail view)
    dispatch(handleFetchAllPackages({ is_paginate: false }));
  }, [dispatch]);

  const warehousePackages = packages.filter((pkg) => pkg.whscode === whsCode);
  const warehouseName = warehousePackages[0]?.whsname || warehousePackages[0]?.package_type_name || "Warehouse Assets";

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="shrink-0 flex items-center justify-between px-8 py-6 bg-white border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[32px] w-full">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-slate-200 text-slate-700 shadow-lg shadow-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                {whsCode}
              </h1>
              <Badge className="bg-blue-600 text-white border-0 font-black text-sm px-3 py-1 rounded-lg shadow-lg shadow-blue-100">
                {warehouseName}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1.5">
              <div className="flex items-center gap-2">
                <Warehouse className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Master Assets
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 pr-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Barcodes
            </span>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {warehousePackages.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BARCODE TABLE */}
      <Card className="border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 border-0">
                  <TableHead className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    SL No
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Barcode
                  </TableHead>
                  <TableHead className="px-6 py-5 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-20 text-center">
                      <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : warehousePackages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-20 text-center text-slate-400 font-black uppercase tracking-widest"
                    >
                      No Barcodes Found
                    </TableCell>
                  </TableRow>
                ) : (
                  warehousePackages.map((pkg, idx) => (
                    <TableRow
                      key={pkg.id}
                      className="hover:bg-blue-50/30 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <TableCell className="px-8 py-5 font-black text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Tag className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-black text-slate-900 font-mono tracking-tight">
                            {pkg.package_code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className={`rounded-lg font-black text-[10px] uppercase tracking-widest px-3 py-1 flex items-center gap-2 w-fit ${
                            pkg.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-50 text-slate-500 border-slate-100"
                          }`}
                        >
                          {pkg.status === "Active" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Unassigned
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Assigned
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageDetail;

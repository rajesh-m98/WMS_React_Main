import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Loader2,
  ClipboardList,
  Calendar,
  MapPin,
  Barcode,
} from "lucide-react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Input,
  Badge,
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { handleFetchDispatchHistory } from "@/app/manager/dispatchManager";
import { useDebounce } from "@/hooks/use-debounce";

export const DispatchHistory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: storeData,
    loading,
    totalCount,
  } = useAppSelector((state) => state.dispatch);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    dispatch(
      handleFetchDispatchHistory({
        page,
        size: pageSize,
        search: debouncedSearch || undefined,
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  // Group by warehouse
  const uniqueWarehouses = useMemo(() => {
    const whsMap = new Map();
    storeData.forEach((item) => {
      const whsCode = item.whscode || "N/A";
      if (!whsMap.has(whsCode)) {
        whsMap.set(whsCode, {
          whscode: whsCode,
          whsname: item.whsname || "Mylapore - Sannadhi Street",
        });
      }
    });
    return Array.from(whsMap.values());
  }, [storeData]);

  const filteredWhs = uniqueWarehouses.filter(
    (whs) =>
      whs.whscode.toLowerCase().includes(search.toLowerCase()) ||
      whs.whsname.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by Warehouse Name or Code..."
            className="pl-11 h-12 rounded-[1.25rem] bg-white border-2 border-slate-100 hover:border-blue-400 transition-all text-sm font-medium shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden relative">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b-2 border-slate-900/10">
                  <TableHead className="px-8 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    SL NO
                  </TableHead>
                  <TableHead className="px-8 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Warehouse Name
                  </TableHead>
                  <TableHead className="px-8 py-6 text-left text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    WHS Code
                  </TableHead>
                  <TableHead className="px-8 py-6 text-right text-[11px] font-black text-slate-600 uppercase tracking-widest">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-96 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="label-bold !text-slate-400">
                          Loading Dispatch History...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredWhs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <ClipboardList className="h-20 w-20 text-slate-400" />
                        <p className="text-xl font-black text-slate-400 uppercase">
                          No Warehouses Found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWhs.map((whs, idx) => (
                    <TableRow
                      key={whs.whscode}
                      className="hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer border-b border-slate-100"
                      onClick={() =>
                        navigate(`/transactions/dispatch/${whs.whscode}`)
                      }
                    >
                      <td className="px-8 py-6 font-black text-slate-900">
                        {idx + 1}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-black text-slate-800 text-sm uppercase tracking-tight">
                            {whs.whsname}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 font-black px-3 py-1 border-slate-200"
                        >
                          {whs.whscode}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          size="sm"
                          className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/transactions/dispatch/${whs.whscode}`);
                          }}
                        >
                          View Details
                        </Button>
                      </td>
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

export default DispatchHistory;

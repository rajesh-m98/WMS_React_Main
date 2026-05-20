import { useState, useEffect } from "react";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Loader2,
  RefreshCw,
  ClipboardList,
  Clock,
  ArrowRight,
  Layers,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchOnwardPicklist } from "@/app/manager/requestManager";

const PicklistGenerationPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: onwardData, loading } = useAppSelector(
    (state) => state.request.onward,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(handleFetchOnwardPicklist());
  }, [dispatch]);

  // Use the onwardData directly, it's already filtered for onward picklist by the backend
  const picklistHeaders = onwardData || [];

  const filteredData = picklistHeaders.filter((row: any) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (row.docnum || "").toString().toLowerCase().includes(searchStr) ||
      (row.docentry || "").toString().toLowerCase().includes(searchStr) ||
      (row.doctype || "").toLowerCase().includes(searchStr)
    );
  });

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 bg-[#f8fafc]/50 p-4 min-h-screen">
      {/* HEADER SECTION */}
      <div className="shrink-0 flex items-center justify-between px-8 py-6 bg-white border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[32px] mb-2 w-full">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-blue-50">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Picklist <span className="text-blue-600">Generation</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Manage Stock Transfer Headers for Manual Picking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input
              placeholder="Search by Doc Num ..."
              className="pl-12 h-12 w-80 rounded-2xl bg-slate-50 border-1 border-slate-200 shadow-lg shadow-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-sm font-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 border-1 border-slate-300 shadow-md shadow-slate-400 font-black text-[10px] uppercase tracking-widest text-slate-600 flex gap-2 active:scale-95 transition-all"
            onClick={() => dispatch(handleFetchOnwardPicklist())}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Card className="border-1 border-slate-50 shadow-lg shadow-slate-400 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100 hover:scrollbar-thumb-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-8 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    SL NO
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc Entry
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc Date
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc Type
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Line Items
                  </th>
                  <th className="px-8 py-5 text-right pr-12 text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-14 w-14 text-blue-600 animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                          Processing Headers...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <PackageSearch className="h-24 w-24 text-slate-300" />
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                          No Picklist Requests Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row: any, idx) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group cursor-pointer"
                      onClick={() =>
                        navigate(`/transactions/picklist/generation/${row.id}`)
                      }
                    >
                      <td className="px-8 py-5 font-black text-slate-700 font-mono text-xs">
                        {(page - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                            {row.docentry}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-sm font-bold text-slate-600 uppercase">
                            {formatDate(row.docdate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge
                          variant="outline"
                          className="bg-blue-500 text-white text-[12px] font-black px-3 py-2"
                        >
                          {row.doctype}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span className="text-[14px] font-black text-slate-900">
                            {(row.lines || row.db_line || []).length}{" "}
                            {(row.lines || row.db_line || []).length === 1
                              ? "Item"
                              : "Items"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right pr-12">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-slate-400 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/transactions/picklist/generation/${row.id}`,
                            );
                          }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PAGINATION SECTION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-10 py-6 bg-white rounded-[32px] shadow-xl shadow-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-400" />
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
              className="h-12 px-8 rounded-2xl border-0 bg-slate-50 hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-12 px-8 rounded-2xl border-0 bg-slate-50 hover:bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PicklistGenerationPage;

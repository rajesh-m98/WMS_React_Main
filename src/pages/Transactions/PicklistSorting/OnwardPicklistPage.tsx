import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
} from "@/components/ui";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
  Clock,
  ArrowRightLeft,
  Calendar,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchSorting } from "@/app/manager/requestManager";

const OnwardPicklistPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.request.sorting);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(handleFetchSorting({ is_paginate: true, page, size: 50 }));
  }, [dispatch, page]);

  const filteredData = Array.isArray(data) ? data.filter((item: any) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      item.doc_entry?.toString().toLowerCase().includes(searchStr) ||
      item.doc_num?.toString().toLowerCase().includes(searchStr)
    );
  }) : [];

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
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
            <ArrowRightLeft className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Picklist <span className="text-indigo-600">Sorting</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Onward Picklist Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input
              placeholder="Search by Doc Num or Card..."
              className="pl-12 h-12 w-80 rounded-2xl bg-slate-50 border-0 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-black shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 border-0 shadow-lg shadow-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-600 flex gap-2 active:scale-95 transition-all"
            onClick={() => dispatch(handleFetchSorting({ is_paginate: true, page, size: 50 }))}
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
                    SL
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc Num
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc Date
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc Type
                  </th>
                  <th className="px-6 py-5 text-center text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Total Lines
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
                        <Loader2 className="h-14 w-14 text-indigo-600 animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                          Syncing Onward Picklists...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <Filter className="h-24 w-24 text-slate-300" />
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                          No Records Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group cursor-pointer"
                      onClick={() => navigate(`/transactions/picklist/sorting/${item.id}`)}
                    >
                      <td className="px-8 py-5 font-black text-slate-400 font-mono text-xs">
                        {(page - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 tracking-tight">
                             #{item.doc_num || item.doc_entry}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">
                             Entry: {item.doc_entry}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-sm font-black text-slate-700 uppercase whitespace-nowrap">
                            {formatDate(item.docdate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-600 border-slate-200 font-black text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider"
                        >
                          {item.doctype}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge className="bg-indigo-50 text-indigo-600 border-0 font-black text-sm px-4 py-1.5 rounded-xl shadow-sm shadow-indigo-100/50">
                          {item.db_line?.length || 0} {item.db_line?.length === 1 ? 'Line' : 'Lines'}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-right pr-12">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-200 text-slate-700 shadow-lg shadow-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/transactions/picklist/sorting/${item.id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
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
              Showing page <span className="text-indigo-600">{page}</span> of{" "}
              <span className="text-indigo-600">{totalPages}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-12 px-8 rounded-2xl border-0 bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-12 px-8 rounded-2xl border-0 bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30"
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

export default OnwardPicklistPage;

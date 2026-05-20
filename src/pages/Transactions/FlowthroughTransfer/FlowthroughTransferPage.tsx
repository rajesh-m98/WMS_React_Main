import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, Badge, Button, Input } from "@/components/ui";
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  PackageSearch,
  Loader2,
  RefreshCw,
  Shuffle,
  Clock,
  ArrowRight,
  ClipboardList,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchOutwardRequests } from "@/app/manager/requestManager";

const FlowthroughTransferPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: outwardData, loading } = useAppSelector(
    (state) => state.request.outward,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    dispatch(handleFetchOutwardRequests({ page: 1, size: 100 }));
  }, [dispatch]);

  // FILTER: Grpo Doc Entry must NOT be null, empty, 'N', 'N/A' or 'null' for Flowthrough
  const flowthroughHeaders = outwardData.filter(
    (row: any) =>
      row.grpo_docentry !== null &&
      row.grpo_docentry !== undefined &&
      String(row.grpo_docentry).trim() !== "" &&
      String(row.grpo_docentry).trim().toUpperCase() !== "N" &&
      String(row.grpo_docentry).trim().toUpperCase() !== "N/A" &&
      String(row.grpo_docentry).trim().toLowerCase() !== "null",
  );

  // GROUP BY GRPO: Group headers by their grpo_docentry
  const groupedHeaders = useMemo(() => {
    const groups: { [key: string]: any } = {};
    flowthroughHeaders.forEach((row: any) => {
      const grpo = String(row.grpo_docentry).trim();
      if (!groups[grpo]) {
        groups[grpo] = {
          ...row,
          lines: [...(row.lines || [])],
          allDocEntries: [row.docentry],
          allDocNums: [row.docnum],
        };
      } else {
        // Merge lines, ensuring uniqueness
        const existingLines = groups[grpo].lines;
        (row.lines || []).forEach((newLine: any) => {
          const isDuplicate = existingLines.some(
            (el: any) =>
              el.itemcode === newLine.itemcode && el.lineid === newLine.lineid,
          );
          if (!isDuplicate) {
            existingLines.push(newLine);
          }
        });
        if (!groups[grpo].allDocEntries.includes(row.docentry)) {
          groups[grpo].allDocEntries.push(row.docentry);
        }
        if (!groups[grpo].allDocNums.includes(row.docnum)) {
          groups[grpo].allDocNums.push(row.docnum);
        }
      }
    });
    return Object.values(groups);
  }, [flowthroughHeaders]);

  const filteredData = groupedHeaders.filter((row: any) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      (row.grpo_docentry || "").toString().toLowerCase().includes(searchStr) ||
      (row.doctype || "").toLowerCase().includes(searchStr) ||
      row.allDocEntries.some((d: any) =>
        (d || "").toString().toLowerCase().includes(searchStr),
      ) ||
      row.allDocNums.some((d: any) =>
        (d || "").toString().toLowerCase().includes(searchStr),
      )
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
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
            <Shuffle className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Flowthrough <span className="text-indigo-600">Transfer</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Manage Stock Transfer Headers (GRPO Assigned)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input
              placeholder="Search by GRPO No ..."
              className="pl-12 h-12 w-80 rounded-2xl bg-slate-50 border-1 border-slate-200 shadow-lg shadow-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 border-1 border-slate-200 shadow-lg shadow-slate-300 font-black text-[10px] uppercase tracking-widest text-slate-600 flex gap-2 active:scale-95 transition-all"
            onClick={() =>
              dispatch(
                handleFetchOutwardRequests({
                  page: 1,
                  size: 100,
                  forceRefresh: true,
                }),
              )
            }
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
                  {/* <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    Doc No
                  </th> */}
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    GRPO No
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
                    <td colSpan={7} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-14 w-14 text-indigo-600 animate-spin" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                          Processing Headers...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                        <PackageSearch className="h-24 w-24 text-slate-300" />
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">
                          No Flowthrough Headers Detected
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row: any, idx) => (
                    <tr
                      key={row.grpo_docentry}
                      className="hover:bg-indigo-50/30 transition-all duration-300 border-b border-slate-100 last:border-0 group cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/transactions/flow-through/transfer/${row.grpo_docentry}`,
                        )
                      }
                    >
                      <td className="px-8 py-5 font-black text-slate-400 font-mono text-xs">
                        {(page - 1) * itemsPerPage + idx + 1}
                      </td>
                      {/* <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-indigo-600 tracking-tight">
                            Doc Num: {row.docnum}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Doc Entry: {row.docentry}
                          </span>
                        </div>
                      </td> */}
                      <td className="px-6 py-5">
                        <Badge className="bg-blue-500 text-white border-0 font-black text-sm px-3 py-1 rounded-lg shadow-lg shadow-blue-100">
                          GRPO: {row.grpo_docentry}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-sm font-black text-slate-600 uppercase">
                            {formatDate(row.docdate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-500 border-slate-200 text-sm font-black px-2 py-0.5"
                        >
                          {row.doctype}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-black text-slate-900">
                            {row.lines?.length || 0}{" "}
                            {row.lines?.length === 1 ? "Line" : "Lines"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right pr-12">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-md shadow-slate-300 active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/transactions/flow-through/transfer/${row.grpo_docentry}`,
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

export default FlowthroughTransferPage;

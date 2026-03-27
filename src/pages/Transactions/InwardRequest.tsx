import { useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DUMMY_INWARD_DATA = [
  {
    id: 7402,
    inwardheader: {
      docentry: 1045,
      docnum: "GR-2024-001",
      cardcode: "V-900",
      cardname: "Global Logistics Inc.",
      docdate: "2024-03-26",
    },
    lineid: 1,
    itemcode: "WMS-ACK-882",
    name: "Industrial Storage Rack 2U",
    whscode: "WH-01",
    batchnumber: "BCH-0012",
    quantity: 50,
    putQty: 12,
  },
  {
    id: 7401,
    inwardheader: {
      docentry: 1046,
      docnum: "GR-2024-002",
      cardcode: "V-342",
      cardname: "Techative Solutions",
      docdate: "2024-03-25",
    },
    lineid: 3,
    itemcode: "ELC-SNR-004",
    name: "Precision Motion Sensor",
    whscode: "WH-02",
    batchnumber: "BCH-0045",
    quantity: 200,
    putQty: 45,
  },
  {
    id: 7400,
    inwardheader: {
      docentry: 1047,
      docnum: "GR-2024-003",
      cardcode: "V-118",
      cardname: "Zenith Warehousing",
      docdate: "2024-03-25",
    },
    lineid: 1,
    itemcode: "MCH-PLT-JCK",
    name: "Hydraulic Pallet Jack",
    whscode: "WH-01",
    batchnumber: "SER-8821",
    quantity: 8,
    putQty: 2,
  },
  {
    id: 7399,
    inwardheader: {
      docentry: 1048,
      docnum: "GR-2024-004",
      cardcode: "V-900",
      cardname: "Global Logistics Inc.",
      docdate: "2024-03-24",
    },
    lineid: 2,
    itemcode: "NET-WRL-RT",
    name: "High-Speed Mesh Router",
    whscode: "WH-03",
    batchnumber: "N/A",
    quantity: 15,
    putQty: 0,
  },
];

const InwardRequest = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Filters Area */}
      <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-2/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Document, Item, or Partner..."
                className="pl-11 h-12 rounded-2xl bg-slate-50/50 border-slate-200 hover:border-blue-400 transition-all text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-0 bg-slate-50/50 rounded-2xl px-2 h-12 border border-slate-200">
              <div className="flex items-center px-2">
                <Input
                  type="text"
                  placeholder="From: YYYY-MM-DD"
                  className="w-[180px] h-9 border-0 bg-transparent focus-visible:ring-0 text-[13px] font-medium text-slate-600"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <Calendar className="h-4 w-4 text-blue-600 ml-1" />
              </div>
              <div className="w-px h-6 bg-slate-200 mx-2" />
              <div className="flex items-center px-2">
                <Input
                  type="text"
                  placeholder="To: YYYY-MM-DD"
                  className="w-[180px] h-9 border-0 bg-transparent focus-visible:ring-0 text-[13px] font-medium text-slate-600"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <Calendar className="h-4 w-4 text-blue-600 ml-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-0 relative">
          <Table className="min-w-max border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b border-slate-100">
                <TableHead className="label-bold !text-slate-900 px-8 py-5 tracking-widest uppercase text-left whitespace-nowrap">
                  ID
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  DocEntry
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Doc Number
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Card Code
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Card Name
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-center whitespace-nowrap">
                  Doc Date
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-6 tracking-widest uppercase text-center whitespace-nowrap">
                  Line
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Item Code
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Item Name
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Warehouse
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-left whitespace-nowrap">
                  Batch No
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-right whitespace-nowrap">
                  Available Qty
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-4 tracking-widest uppercase text-right whitespace-nowrap">
                  Put Qty
                </TableHead>
                <TableHead className="label-bold !text-slate-900 px-8 tracking-widest uppercase text-right whitespace-nowrap pr-10">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DUMMY_INWARD_DATA.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <Package className="h-16 w-16 mb-4 text-slate-300" />
                      <p className="heading-section !text-xl text-slate-400">
                        NO INWARD DOCUMENTS FOUND
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                DUMMY_INWARD_DATA.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-blue-50/40 border-b border-slate-50 last:border-0 transition-all duration-300 group"
                  >
                    <td className="px-8 py-5 text-[12px] font-black text-slate-400 font-mono">
                      #{row.id}
                    </td>
                    <td className="px-4 font-bold text-slate-900 tabular-nums">
                      {row.inwardheader?.docentry || "-"}
                    </td>
                    <td className="px-4 font-black text-blue-600 tabular-nums">
                      <span className="px-2.5 py-1 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
                        {row.inwardheader?.docnum || "-"}
                      </span>
                    </td>
                    <td className="px-4 text-slate-500 label-bold !tracking-wide">
                      {row.inwardheader?.cardcode || "-"}
                    </td>
                    <td className="px-4 text-slate-800 font-black !text-[12px] truncate max-w-[180px]">
                      {row.inwardheader?.cardname || "-"}
                    </td>
                    <td className="px-4 text-slate-500 font-bold text-center tabular-nums text-[12px] whitespace-nowrap">
                      {row.inwardheader?.docdate || "-"}
                    </td>
                    <td className="px-6 text-center font-black text-slate-400 tabular-nums">
                      {row.lineid || "-"}
                    </td>
                    <td className="px-4 font-black text-blue-600 text-[12px]">
                      {row.itemcode}
                    </td>
                    <td className="px-4 text-slate-600 font-bold text-[12px] truncate max-w-[200px]">
                      {row.name}
                    </td>
                    <td className="px-4 font-black text-slate-800 text-[12px]">
                      {row.whscode}
                    </td>
                    <td className="px-4 text-slate-400 label-bold !tracking-tight">
                      {row.batchnumber || "N/A"}
                    </td>
                    <td className="px-4 text-right font-black text-slate-900 tabular-nums">
                      {row.quantity || 0}
                    </td>
                    <td className="px-4 text-right">
                      <span className="px-4 py-1.5 bg-slate-100 rounded-xl font-black !text-slate-900 tabular-nums border border-slate-200">
                        {row.putQty || 0}
                      </span>
                    </td>
                    <td className="px-8 text-right pr-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl shadow-lg shadow-slate-300 bg-slate-50/80 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                        onClick={() =>
                          navigate(`/transactions/tasks/${row.id}`)
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Static Pagination Information */}
      <div className="flex items-center justify-end px-6 pt-2">
        <div className="flex gap-2 opacity-50 cursor-not-allowed">
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl px-8 h-12 border-slate-200 font-bold pointer-events-none"
            disabled
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> PREV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl px-8 h-12 border-slate-200 font-bold pointer-events-none"
            disabled
          >
            NEXT <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InwardRequest;

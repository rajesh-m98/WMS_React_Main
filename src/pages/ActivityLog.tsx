import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";

const ALL_ACTIVITY = [
  {
    id: "7402",
    type: "Inward",
    item: "Industrial Storage Rack 2U",
    qty: 50,
    date: "2024-03-26",
    time: "10:15 AM",
    status: "Completed",
    partner: "Global Logistics",
  },
  {
    id: "9101",
    type: "Outward",
    item: "Precision Motion Sensor",
    qty: 120,
    date: "2024-03-26",
    time: "11:30 AM",
    status: "In Progress",
    partner: "Tech Solutions",
  },
  {
    id: "7401",
    type: "Inward",
    item: "High-Speed Mesh Router",
    qty: 200,
    date: "2024-03-25",
    time: "09:45 AM",
    status: "Completed",
    partner: "A1 Warehouse",
  },
  {
    id: "9102",
    type: "Outward",
    item: "Hydraulic Pallet Jack",
    qty: 8,
    date: "2024-03-25",
    time: "02:20 PM",
    status: "Pending",
    partner: "Express Freight",
  },
  {
    id: "7399",
    type: "Inward",
    item: "Safety Helmet Pro",
    qty: 300,
    date: "2024-03-24",
    time: "11:00 AM",
    status: "Completed",
    partner: "Safety First",
  },
  {
    id: "7398",
    type: "Outward",
    item: "RFID Readers",
    qty: 45,
    date: "2024-03-24",
    time: "03:15 PM",
    status: "Completed",
    partner: "Retail Corp",
  },
  {
    id: "7397",
    type: "Inward",
    item: "Fiber Optic Cables",
    qty: 1000,
    date: "2024-03-24",
    time: "08:30 AM",
    status: "Completed",
    partner: "NetLink",
  },
  {
    id: "7396",
    type: "Outward",
    item: "Universal Converters",
    qty: 50,
    date: "2024-03-23",
    time: "01:45 PM",
    status: "Completed",
    partner: "Innovate Inc",
  },
];

export const ActivityLog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = ALL_ACTIVITY.filter(
    (item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.includes(searchTerm) ||
      item.partner.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Main Table */}
      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-slate-50/30 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Entry ID
                  </th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Item Description
                  </th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    Partner
                  </th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">
                    Qty
                  </th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/40 transition-all duration-300 group cursor-pointer"
                    onClick={() => navigate(`/transactions/tasks/${tx.id}`)}
                  >
                    <td className="px-10 py-6 text-sm font-black text-slate-900 font-mono">
                      {tx.id}
                    </td>
                    <td className="px-10 py-6">
                      <Badge
                        className={`rounded-xl px-4 py-1.5 border-0 font-black text-[10px] tracking-widest text-white shadow-sm ${tx.type === "Inward" ? "bg-blue-600 shadow-blue-100" : "bg-indigo-600 shadow-indigo-100"}`}
                      >
                        {tx.type === "Inward" ? (
                          <ArrowUpRight className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3 mr-1 inline" />
                        )}
                        {tx.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {tx.item}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          Movement Record #{Math.floor(Math.random() * 10000)}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="body-strong !text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                        {tx.partner}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="bg-slate-900 px-4 py-2 rounded-xl text-white font-black text-xs tabular-nums shadow-lg">
                        {tx.qty}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right font-black text-slate-400 text-xs uppercase tracking-widest tabular-nums font-mono">
                      <div>{tx.date}</div>
                      <div className="text-[9px] text-blue-500 mt-0.5">
                        {tx.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="p-20 text-center">
              <ClipboardList className="h-20 w-20 text-slate-200 mx-auto mb-4" />
              <p className="heading-sub !text-slate-400">
                No matching activities found
              </p>
            </div>
          )}
          <div className="p-8 bg-slate-50/30 border-t flex items-center justify-between">
            <p className="caption-small !text-slate-400 uppercase tracking-[0.2em] font-black">
              End of Global Audit Ledger
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled
                className="h-10 rounded-xl px-4 body-strong text-xs"
              >
                PREV
              </Button>
              <Button
                variant="outline"
                disabled
                className="h-10 rounded-xl px-4 body-strong text-xs"
              >
                NEXT
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;

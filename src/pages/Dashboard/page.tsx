import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Box,
  Smartphone,
  Warehouse,
  ArrowUpRight,
  ArrowDownLeft,
  ClipboardList,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Package,
  Truck,
  BarChart3,
  Heart,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchDashboardData } from "@/app/manager/dashboardManager";
import { handleFetchUsers } from "@/app/manager/masterManager";
import { handleFetchAllHST } from "@/app/manager/hstManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";
import { handleFetchAllItems } from "@/app/manager/itemManager";
import config from "./DashboardConfig.json";

const iconMap: Record<string, any> = {
  Users,
  Box,
  Smartphone,
  Warehouse,
  ArrowUpRight,
  ArrowDownLeft,
  ClipboardList,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Package,
  Truck,
  BarChart3,
  Heart,
  ShieldCheck,
  Server,
  Zap,
};

const DUMMY_CHART_WEEK = [
  { name: "Mon", inward: 420, outward: 310 },
  { name: "Tue", inward: 580, outward: 450 },
  { name: "Wed", inward: 390, outward: 520 },
  { name: "Thu", inward: 710, outward: 480 },
  { name: "Fri", inward: 850, outward: 610 },
  { name: "Sat", inward: 460, outward: 390 },
  { name: "Sun", inward: 320, outward: 280 },
];

const DUMMY_CHART_MONTH = [
  { name: "Week 1", inward: 2100, outward: 1850 },
  { name: "Week 2", inward: 2450, outward: 2100 },
  { name: "Week 3", inward: 2200, outward: 2400 },
  { name: "Week 4", inward: 2600, outward: 2250 },
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "7402",
    type: "Inward",
    item: "Industrial Storage Rack 2U",
    qty: 50,
    date: "10:15 AM",
  },
  {
    id: "9101",
    type: "Outward",
    item: "Precision Motion Sensor",
    qty: 120,
    date: "11:30 AM",
  },
  {
    id: "7401",
    type: "Inward",
    item: "High-Speed Mesh Router",
    qty: 200,
    date: "09:45 AM",
  },
  {
    id: "9102",
    type: "Outward",
    item: "Hydraulic Pallet Jack",
    qty: 8,
    date: "02:20 PM",
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [analysisType, setAnalysisType] = useState<"week" | "month">("week");
  const { kpis, recentTransactions, chartData, loading } = useAppSelector(
    (state) => state.dashboard,
  );
  const { totalCount: realUserCount } = useAppSelector(
    (state) => state.master.users,
  );
  const { totalCount: hstCount } = useAppSelector((state) => state.hst);
  const { totalCount: warehouseCount } = useAppSelector(
    (state) => state.warehouse,
  );
  const { totalCount: itemCount } = useAppSelector((state) => state.item);
  const [deltas, setDeltas] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(handleFetchDashboardData());
    dispatch(handleFetchUsers({ companyid: 1 }));
    dispatch(handleFetchAllHST());
    dispatch(handleFetchAllWarehouses());
    dispatch(handleFetchAllItems());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      const lastSeen = JSON.parse(
        localStorage.getItem("dashboard_last_seen_metrics") || "{}",
      );
      const calculateDelta = (current: number, field: string) => {
        const last = lastSeen[field];
        if (last === undefined) return "+0";
        const diff = current - last;
        return diff >= 0 ? `+${diff}` : `${diff}`;
      };
      setDeltas({
        hst: calculateDelta(hstCount, "hst"),
        warehouse: calculateDelta(warehouseCount, "warehouse"),
        users: calculateDelta(realUserCount, "users"),
        items: calculateDelta(itemCount, "items"),
      });
      localStorage.setItem(
        "dashboard_last_seen_metrics",
        JSON.stringify({
          hst: hstCount,
          warehouse: warehouseCount,
          users: realUserCount,
          items: itemCount,
        }),
      );
    }
  }, [loading, hstCount, warehouseCount, realUserCount, itemCount]);

  const activeChartData = chartData?.length
    ? chartData
    : analysisType === "week"
      ? DUMMY_CHART_WEEK
      : DUMMY_CHART_MONTH;
  const activeTransactions = recentTransactions?.length
    ? recentTransactions
    : DEFAULT_TRANSACTIONS;

  const displayKpis =
    kpis && kpis.length >= 4
      ? kpis
      : [
          {
            title: "HST Devices",
            value: hstCount.toString(),
            icon: "Smartphone",
            change: deltas.hst || "Syncing",
            up: deltas.hst !== "+0",
            bg: "kpi-card-blue",
            iconColor: "text-blue-600",
            link: "/masters/hst",
          },
          {
            title: "Warehouse Count",
            value: warehouseCount.toString(),
            icon: "Warehouse",
            change: deltas.warehouse || "Syncing",
            up: deltas.warehouse !== "+0",
            bg: "kpi-card-green",
            iconColor: "text-emerald-600",
            link: "/masters/warehouses",
          },
          {
            title: "Active Users",
            value: realUserCount.toString(),
            icon: "Users",
            change: deltas.users || "Syncing",
            up: deltas.users !== "+0",
            bg: "kpi-card-purple",
            iconColor: "text-purple-600",
            link: "/masters/users",
          },
          {
            title: "Total Items",
            value: itemCount.toLocaleString(),
            icon: "Box",
            change: deltas.items || "Syncing",
            up: deltas.items !== "+0",
            bg: "kpi-card-amber",
            iconColor: "text-amber-600",
            link: "/masters/items",
          },
          {
            title: "Inward Pending",
            value: "18",
            icon: "ArrowUpRight",
            change: "-2",
            up: false,
            bg: "kpi-card-rose",
            iconColor: "text-rose-600",
            link: "/transactions/InwardRequest",
          },
          {
            title: "Outward Pick",
            value: "42",
            icon: "ArrowDownLeft",
            change: "+8",
            up: true,
            bg: "kpi-card-cyan",
            iconColor: "text-cyan-600",
            link: "/transactions/OutwardRequest",
          },
        ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* KPI Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayKpis.map((kpi, idx) => {
          const Icon = iconMap[kpi.icon] || Box;
          return (
            <Card
              key={idx}
              className={`border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl group relative overflow-hidden ${kpi.bg || "bg-white"}`}
              onClick={() => kpi.link && navigate(kpi.link)}
            >
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-xl bg-white/40 shadow-sm backdrop-blur-md ${kpi.iconColor || "text-slate-600"}`}
                  >
                    <Icon className="icon-base" />
                  </div>
                  <Badge
                    className={`rounded-full px-2 py-0.5 border-0 caption-small !text-white ${kpi.up ? "bg-emerald-500" : "bg-rose-500"}`}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <h3 className="caption-small mb-1 opacity-60 uppercase">
                  {kpi.title}
                </h3>
                <p className="text-2xl heading-section tracking-tight tabular-nums">
                  {kpi.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full Width Activity Analytics */}
      <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-10 py-8 border-b border-slate-50 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          <CardTitle className="heading-section !text-2xl text-slate-900 uppercase">
            Activity Analytics
          </CardTitle>
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setAnalysisType("week")}
              className={`px-6 py-2.5 rounded-xl label-bold transition-all ${analysisType === "week" ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-400"}`}
            >
              7 DAYS
            </button>
            <button
              onClick={() => setAnalysisType("month")}
              className={`px-6 py-2.5 rounded-xl label-bold transition-all ${analysisType === "month" ? "bg-white text-blue-600 shadow-md scale-105" : "text-slate-400"}`}
            >
              30 DAYS
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-10 pt-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart key={analysisType} data={activeChartData}>
                <defs>
                  <linearGradient id="colorInward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutward" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                    fontWeight: 900,
                    padding: "16px",
                    fontSize: "12px",
                    fontFamily: "Outfit",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inward"
                  stroke="#2563eb"
                  strokeWidth={4}
                  fill="url(#colorInward)"
                  animationDuration={3000}
                />
                <Area
                  type="monotone"
                  dataKey="outward"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  fill="url(#colorOutward)"
                  animationDuration={3000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Ledger */}
      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 px-10 py-8 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 rounded-r-3xl" />
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="heading-section !text-2xl text-slate-900 uppercase">
                Real-time Ledger
              </CardTitle>
              <p className="caption-small !text-slate-400 mt-1 uppercase tracking-widest">
                Global Movement History
              </p>
            </div>
            <Button
              variant="ghost"
              className="rounded-2xl h-14 px-8 font-black text-slate-900 border-2 border-slate-50 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
              onClick={() => navigate("/activity-logs")}
            >
              VIEW ALL AUDITS
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6 label-bold !text-slate-400">
                    Entry ID
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400">
                    Operation
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400">
                    Specification
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-right">
                    Qty
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-right">
                    Sync
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer border-b border-slate-50 last:border-0"
                    onClick={() => navigate(`/transactions/tasks/${tx.id}`)}
                  >
                    <td className="px-10 py-6 text-sm font-black text-slate-400 font-mono">
                      #{tx.id}
                    </td>
                    <td className="px-10 py-6">
                      <Badge
                        className={`rounded-lg px-3 py-1.5 border-0 font-black text-[10px] tracking-widest text-white ${tx.type === "Inward" ? "bg-blue-600" : "bg-indigo-600"}`}
                      >
                        {tx.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {tx.item}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Document Verified
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="bg-slate-900 px-4 py-2 rounded-xl text-white font-black text-xs shadow-lg">
                        {tx.qty}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

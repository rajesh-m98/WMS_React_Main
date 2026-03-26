import { useEffect, useState } from "react";
import {
  Users,
  Smartphone,
  Box,
  Warehouse,
  ArrowUpRight,
  ArrowDownLeft,
  ClipboardList,
  Loader2,
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
import { useNavigate } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchDashboardData } from "@/app/manager/dashboardManager";
import { handleFetchUsers } from "@/app/manager/masterManager";
import { handleFetchAllHST } from "@/app/manager/hstManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";
import { handleFetchAllItems } from "@/app/manager/itemManager";
import { Button } from "@/components/ui";
import config from "./DashboardConfig.json";

const iconMap: Record<string, any> = {
  Users,
  Smartphone,
  Box,
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

const LOAD_COLORS = ["#2563eb", "#f1f5f9"];

const DUMMY_CHART_WEEK = [
  { name: "Mon", inward: 420, outward: 310 },
  { name: "Tue", inward: 380, outward: 450 },
  { name: "Wed", inward: 510, outward: 380 },
  { name: "Thu", inward: 440, outward: 520 },
  { name: "Fri", inward: 590, outward: 410 },
  { name: "Sat", inward: 340, outward: 290 },
  { name: "Sun", inward: 280, outward: 330 },
];

const DUMMY_CHART_MONTH = [
  { name: "Week 1", inward: 2100, outward: 1850 },
  { name: "Week 2", inward: 2450, outward: 2100 },
  { name: "Week 3", inward: 2200, outward: 2400 },
  { name: "Week 4", inward: 2600, outward: 2250 },
];

const DEFAULT_SYSTEMS = [
  { label: "Core Engine", value: "v1.2.4", icon: "Activity" },
  { label: "Primary Node", value: "99.9%", icon: "Server" },
  { label: "API Gateway", value: "18ms", icon: "Zap" },
  { label: "HST Bridge", value: "Live", icon: "Smartphone" },
  { label: "Database", value: "Active", icon: "ShieldCheck" },
];

const DEFAULT_TRANSACTIONS = [
  {
    id: "7402",
    type: "Inward",
    item: "High-Density Storage Racks",
    qty: 24,
    date: "10:45 AM",
  },
  {
    id: "7401",
    type: "Outward",
    item: "Wireless Barcode Scanners",
    qty: 15,
    date: "10:32 AM",
  },
  {
    id: "7400",
    type: "Inward",
    item: "Industrial Pallet Jacks",
    qty: 8,
    date: "10:15 AM",
  },
  {
    id: "7399",
    type: "Outward",
    item: "LED Motion Sensors",
    qty: 120,
    date: "09:58 AM",
  },
  {
    id: "7398",
    type: "Inward",
    item: "Universal Converters",
    qty: 50,
    date: "09:42 AM",
  },
  {
    id: "7397",
    type: "Outward",
    item: "Precision Scales",
    qty: 4,
    date: "09:30 AM",
  },
  {
    id: "7396",
    type: "Inward",
    item: "Heavy Duty Casters",
    qty: 200,
    date: "09:15 AM",
  },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [analysisType, setAnalysisType] = useState<"week" | "month">("week");
  const { kpis, recentTransactions, chartData, systemStatus, loading } =
    useAppSelector((state) => state.dashboard);
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

  // Session-persistent change tracking
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

      // Update snapshot for next session/refresh
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

  if (loading && (!kpis || kpis.length === 0)) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="icon-xl text-blue-600 animate-spin" />
        <div className="space-y-1 text-center font-black">
          <p className="heading-sub">
            {config.strings.loading.title}
          </p>
          <p className="caption-small">
            {config.strings.loading.subtitle}
          </p>
        </div>
      </div>
    );
  }

  // Fallback to dummy data if Redux lists are empty
  const activeChartData =
    chartData && chartData.length > 0
      ? chartData
      : analysisType === "week"
        ? DUMMY_CHART_WEEK
        : DUMMY_CHART_MONTH;

  const activeSystemStatus =
    systemStatus && systemStatus.length > 0 ? systemStatus : DEFAULT_SYSTEMS;

  const activeTransactions =
    recentTransactions && recentTransactions.length > 0
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

  const inwardKpi =
    displayKpis.find(
      (k) =>
        k.title?.toLowerCase().includes("inward") ||
        k.title?.toLowerCase().includes("inward"),
    ) || displayKpis[4];
  const outwardKpi =
    displayKpis.find(
      (k) =>
        k.title?.toLowerCase().includes("outward") ||
        k.title?.toLowerCase().includes("outward"),
    ) || displayKpis[5];

  const loadData = [
    { name: "Used", value: 68 },
    { name: "Free", value: 32 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayKpis.map((kpi, idx) => {
          const Icon = iconMap[kpi.icon] || Box;
          return (
            <Card
              key={idx}
              className={`border-0 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl group/card relative overflow-hidden ${kpi.bg || "bg-white"}`}
              onClick={() => kpi.link && navigate(kpi.link)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Icon className="icon-hero" />
              </div>
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-xl bg-white/40 shadow-sm backdrop-blur-md ${kpi.iconColor || "text-slate-600"}`}
                  >
                    <Icon className="icon-base group-hover/card:scale-110 transition-transform" />
                  </div>
                  <Badge
                    className={`rounded-full px-2 py-0.5 border-0 caption-small !text-white shadow-sm tracking-tighter transition-all duration-500 
                      ${kpi.change === "+0" 
                        ? "bg-slate-200 text-slate-500 group-hover/card:bg-slate-300 group-hover/card:text-slate-600" 
                        : kpi.up 
                          ? "bg-emerald-500 group-hover/card:bg-white group-hover/card:!text-emerald-600 hover:bg-emerald-600 hover:!text-white" 
                          : "bg-rose-500 group-hover/card:bg-white group-hover/card:!text-rose-600 hover:bg-rose-600 hover:!text-white"
                      }`}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div>
                  <h3 className="caption-small mb-1 opacity-60">
                    {kpi.title}
                  </h3>
                  <p className="text-2xl heading-section tracking-tight">
                    {kpi.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Operational Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inward Summary */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden group/opt transition-all hover:shadow-xl">
          <div className="h-1 w-full bg-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="caption-small mb-1">
                  {config.strings.operational.metrics.inward}
                </p>
                <h4 className="heading-section !text-3xl text-slate-900">
                  {inwardKpi?.value || "1,280"}
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center text-emerald-500 caption-small !tracking-normal bg-emerald-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="icon-xs mr-1" />
                    +12.5%
                  </div>
                  <span className="caption-small !tracking-tighter !text-slate-400">
                    vs last week
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 animate-pulse-soft">
                <BarChart3 className="icon-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outward Summary */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden group/opt transition-all hover:shadow-xl">
          <div className="h-1 w-full bg-indigo-600" />
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="caption-small mb-1">
                  {config.strings.operational.metrics.outward}
                </p>
                <h4 className="heading-section !text-3xl text-slate-900">
                  {outwardKpi?.value || "942"}
                </h4>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center text-amber-500 caption-small !tracking-normal bg-amber-50 px-2 py-0.5 rounded-full">
                    <TrendingDown className="icon-xs mr-1" />
                    -4.2%
                  </div>
                  <span className="caption-small !tracking-tighter !text-slate-400">
                    daily delta
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <Truck className="icon-lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Load */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden group/opt transition-all hover:shadow-xl">
          <div className="h-1 w-full bg-slate-900" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="caption-small mb-1">
                  {config.strings.operational.metrics.load}
                </p>
                <h4 className="heading-section !text-3xl text-slate-900">
                  68.4%
                </h4>
                <p className="caption-small !text-slate-400 mt-2">
                  Capacity Utilization
                </p>
              </div>
              <div className="h-20 w-20 flex-shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loadData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {loadData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={LOAD_COLORS[index % LOAD_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="icon-sm text-slate-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-slate-50 px-8 py-6 gap-4">
            <div>
              <CardTitle className="heading-section !text-xl text-slate-900">
                {config.strings.analytics.title}
              </CardTitle>
              <p className="caption-small !text-slate-400 mt-1">
                {config.strings.analytics.subtitle}
              </p>
            </div>
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setAnalysisType("week")}
                className={`px-4 py-2 rounded-xl caption-small transition-all ${analysisType === "week" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setAnalysisType("month")}
                className={`px-4 py-2 rounded-xl caption-small transition-all ${analysisType === "month" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                30 Days
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-10 px-4">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorInward"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorOutward"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.15}
                      />
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
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 10,
                      fontStyle: "normal",
                      fontWeight: "bold",
                    }}
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
                      fontWeight: 800,
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
                    fillOpacity={1}
                    fill="url(#colorInward)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="outward"
                    stroke="#8b5cf6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorOutward)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-0 shadow-xl rounded-3xl bg-white flex flex-col overflow-hidden">
          <CardHeader className="border-b border-slate-50 px-8 py-6 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="heading-section !text-xl text-slate-900">
                  {config.strings.health.title}
                </CardTitle>
                <p className="caption-small !text-slate-400 mt-1">
                  {config.strings.health.subtitle}
                </p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center animate-heartbeat shadow-lg shadow-emerald-100">
                <Activity className="icon-lg" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              {activeSystemStatus.map((status, idx) => {
                const StatusIcon = iconMap[status.icon] || Box;
                const isLive =
                  status.label?.toLowerCase().includes("node") ||
                  status.label?.toLowerCase().includes("server") ||
                  status.label?.toLowerCase().includes("bridge");

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-5 px-8 hover:bg-slate-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2.5 rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm ${isLive ? "relative" : ""}`}
                      >
                        <StatusIcon
                          className={`icon-base ${isLive ? "animate-heartbeat" : ""}`}
                        />
                        {isLive && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="body-strong !text-[13px] text-slate-700">
                          {status.label}
                        </span>
                        <span className="caption-small !text-slate-400 !tracking-tighter">
                          Performance Node
                        </span>
                      </div>
                    </div>
                    <span className="heading-section !text-xl !tracking-tighter tabular-nums group-hover:scale-110 transition-transform">
                      {status.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <div className="p-5 bg-slate-900 text-center">
            <p className="caption-small !text-emerald-400 tracking-[0.2em]">
              {config.strings.health.footer}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-2xl rounded-3xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 px-8 py-7 bg-white relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="heading-section !text-xl text-slate-900">
                {config.strings.recent.title}
              </CardTitle>
              <p className="caption-small !text-slate-400 mt-1">
                {config.strings.recent.subtitle}
              </p>
            </div>
            <Button
              variant="outline"
              className="body-strong !text-slate-900 rounded-2xl h-12 border-2 border-slate-100 px-6 hover:bg-slate-900 hover:!text-white hover:border-slate-900 transition-all duration-500 transform hover:-translate-y-1 shadow-sm active:scale-95"
            >
              {config.strings.recent.button}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  {config.strings.recent.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className={`px-8 py-4 table-header-font ${idx >= 3 ? "text-right" : ""}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer"
                  >
                    <td className="px-8 py-5 table-id-font !text-slate-900 !text-sm">
                      #{tx.id}
                    </td>
                    <td className="px-8 py-5">
                      <Badge
                        className={`rounded-xl px-3 py-1 border-0 caption-small !text-white !tracking-wider ${tx.type === "Inward" ? "bg-blue-600 shadow-lg shadow-blue-100" : "bg-amber-500 shadow-lg shadow-amber-100"}`}
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="body-strong !text-sm truncate max-w-[250px] !tracking-tight">
                          {tx.item}
                        </span>
                        <span className="caption-small !text-slate-400 !tracking-tighter">
                          SKU ID: {Math.floor(Math.random() * 9000) + 1000}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="bg-slate-900 px-3 py-1.5 rounded-xl body-strong !text-white tabular-nums !text-xs shadow-md">
                        {tx.qty}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right body-strong !text-slate-400 group-hover:!text-slate-900 transition-colors tabular-nums !text-[11px] !tracking-widest">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/20 border-t flex items-center justify-center">
            <p className="caption-small !text-slate-400 !tracking-[0.3em]">
              Real-time Ledger Feed Active
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useMemo } from "react";
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
  Loader2,
  ChevronRight,
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

import { handleFetchUsers } from "@/app/manager/masterManager";
import { handleFetchAllHST } from "@/app/manager/hstManager";
import { handleFetchAllWarehouses } from "@/app/manager/warehouseManager";
import { handleFetchAllItems } from "@/app/manager/itemManager";
import { handleFetchPutawayHistory } from "@/app/manager/putawayManager";
import { handleFetchGins } from "@/app/manager/ginManager";
import { handleFetchAllLayerConfigs } from "@/app/manager/locationManager";

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

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [analysisType, setAnalysisType] = useState<"week" | "month">("week");

  // Get real data from specialized master / transaction slices
  const { totalCount: realUserCount } = useAppSelector(
    (state) => state.master.users,
  );
  const { totalCount: hstCount } = useAppSelector((state) => state.hst);
  const { totalCount: warehouseCount } = useAppSelector(
    (state) => state.warehouse,
  );
  const { totalCount: itemCount } = useAppSelector((state) => state.item);
  const inward = useAppSelector((state) => state.putaway.inward);
  const outward = useAppSelector((state) => state.putaway.outward);
  const { totalFlowThrough, totalPutaway, flowThroughItems, putawayItems } =
    useAppSelector((state) => state.gin);

  const [deltas, setDeltas] = useState<Record<string, string>>({});
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const initFetch = async () => {
      try {
        await Promise.all([
          dispatch(handleFetchUsers({ companyid: 1, size: 5 })),
          dispatch(handleFetchAllHST()),
          dispatch(handleFetchAllWarehouses()),
          dispatch(handleFetchAllItems()),
          dispatch(handleFetchAllLayerConfigs(1)),
          dispatch(
            handleFetchGins({
              gin_type: 1,
              page: 1,
              size: 20,
              is_paginate: true,
            }),
          ),
          dispatch(
            handleFetchGins({
              gin_type: 2,
              page: 1,
              size: 20,
              is_paginate: true,
            }),
          ),
          dispatch(
            handleFetchPutawayHistory("inward", {
              page: 1,
              size: 50,
              forceRefresh: true,
            }),
          ),
        ]);
        setDataReady(true);
      } catch (err) {
        console.error("Dashboard init fetch failed:", err);
        setDataReady(true);
      }
    };
    initFetch();
  }, [dispatch]);

  // Combined and sorted transactions for the real-time ledger
  const activeTransactions = useMemo(() => {
    const combined = [
      ...inward.data.map((tx) => ({ ...tx, origin: "putaway" })),
      ...outward.data.map((tx) => ({ ...tx, origin: "putaway" })),
      ...flowThroughItems.map((tx) => ({
        ...tx,
        origin: "gin",
        putaway_type: 1,
      })),
      ...putawayItems.map((tx) => ({ ...tx, origin: "gin", putaway_type: 1 })),
    ];

    return combined
      .sort((a, b) => {
        const timeA = new Date(a.docdate || a.created_at || 0).getTime() || 0;
        const timeB = new Date(b.docdate || b.created_at || 0).getTime() || 0;
        return timeB - timeA;
      })
      .slice(0, 5);
  }, [inward.data, outward.data, flowThroughItems, putawayItems]);

  const displayTransactions = useMemo(() => {
    return activeTransactions.map((tx) => ({
      id: tx.id?.toString() || "---",
      headerId: tx.header_id,
      origin: tx.origin,
      type:
        tx.origin === "gin"
          ? "Inward (GIN)"
          : tx.putaway_type === 1
            ? "Inward"
            : "Outward",
      item: tx.item_code || "Unknown Item",
      qty: tx.quantity || tx.received_qty || 0,
      date:
        (tx.docdate || tx.created_at || "").toString().split("T")[0] || "---",
    }));
  }, [activeTransactions]);

  // Generate real chart data from transaction history
  const chartData = useMemo(() => {
    const days = analysisType === "week" ? 7 : 30;
    const dataPoints: any[] = [];
    const today = new Date();

    const allInward = [...inward.data, ...flowThroughItems, ...putawayItems];
    const allOutward = [...outward.data];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      // Local date string for robust matching (YYYY-MM-DD)
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const name =
        analysisType === "week"
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : `${month}/${day}`;

      const dayInward = allInward.filter((tx) =>
        (tx.docdate || tx.created_at)?.includes(dateStr),
      ).length;

      const dayOutward = allOutward.filter((tx) =>
        (tx.docdate || tx.created_at)?.includes(dateStr),
      ).length;

      dataPoints.push({ name, inward: dayInward, outward: dayOutward });
    }
    return dataPoints;
  }, [analysisType, inward.data, outward.data, flowThroughItems, putawayItems]);

  useEffect(() => {
    if (dataReady) {
      const today = new Date().toISOString().split("T")[0];
      const baselineStr = localStorage.getItem("dashboard_baseline_metrics");
      let baseline = baselineStr ? JSON.parse(baselineStr) : null;

      // Initialize or reset baseline if it's a new day
      if (!baseline || baseline.date !== today) {
        baseline = {
          date: today,
          counts: {
            hst: hstCount,
            warehouse: warehouseCount,
            users: realUserCount,
            items: itemCount,
          },
        };
        localStorage.setItem(
          "dashboard_baseline_metrics",
          JSON.stringify(baseline),
        );
      }

      const calculateDelta = (current: number, field: string) => {
        const baseValue = baseline.counts[field];
        if (baseValue === undefined) return "+0";
        const diff = current - baseValue;
        return diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "0";
      };

      setDeltas({
        hst: calculateDelta(hstCount, "hst"),
        warehouse: calculateDelta(warehouseCount, "warehouse"),
        users: calculateDelta(realUserCount, "users"),
        items: calculateDelta(itemCount, "items"),
      });
    }
  }, [dataReady, hstCount, warehouseCount, realUserCount, itemCount]);

  if (!dataReady) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-700">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
        <div className="text-center">
          <p className="caption-small !text-slate-400 uppercase tracking-widest mt-2">
            Synchronizing Warehouse Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const displayKpis = [
    {
      title: "HST Devices",
      value: hstCount.toString(),
      icon: "Smartphone",
      change: deltas.hst || "+0",
      up: deltas.hst !== "+0",
      bg: "kpi-card-blue",
      iconColor: "text-blue-600",
      link: "/masters/hst",
    },
    {
      title: "Warehouse Nodes",
      value: warehouseCount.toString(),
      icon: "Warehouse",
      change: deltas.warehouse || "+0",
      up: deltas.warehouse !== "+0",
      bg: "kpi-card-green",
      iconColor: "text-emerald-600",
      link: "/masters/warehouses",
    },
    {
      title: "Active Users",
      value: realUserCount.toString(),
      icon: "Users",
      change: deltas.users || "+0",
      up: deltas.users !== "+0",
      bg: "kpi-card-purple",
      iconColor: "text-purple-600",
      link: "/masters/users",
    },
    {
      title: "Master Items",
      value: itemCount.toLocaleString(),
      icon: "Box",
      change: deltas.items || "+0",
      up: deltas.items !== "+0",
      bg: "kpi-card-amber",
      iconColor: "text-amber-600",
      link: "/masters/items",
    },
    {
      title: "Inward Pending",
      value: (inward.totalCount + totalFlowThrough + totalPutaway).toString(),
      icon: "ArrowUpRight",
      change: "+Today",
      up: true,
      bg: "kpi-card-rose",
      iconColor: "text-rose-600",
      link: "/transactions/inward-history",
    },
    {
      title: "Outward History",
      value: outward.totalCount.toString(),
      icon: "ArrowDownLeft",
      change: "+Live",
      up: true,
      bg: "kpi-card-cyan",
      iconColor: "text-cyan-600",
      link: "/transactions/outward-history",
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
                    className={`rounded-full px-2 py-0.5 border-0 caption-small !text-white ${
                      kpi.change.startsWith("+")
                        ? "bg-emerald-500"
                        : kpi.change.startsWith("-")
                          ? "bg-rose-500"
                          : kpi.change === "0"
                            ? "bg-slate-400"
                            : "bg-emerald-500" // Default for +Today / +Live
                    }`}
                  >
                    {kpi.change === "0" ? "+0" : kpi.change}
                  </Badge>
                </div>
                <h3 className="caption-small mb-1 opacity-60 uppercase">
                  {kpi.title}
                </h3>
                <p className="text-2xl font-black heading-section tracking-tight tabular-nums">
                  {kpi.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real Analytics Chart */}
      <Card className="border-0 shadow-2xl rounded-[3rem] overflow-hidden bg-white">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between px-10 py-8 border-b border-slate-50 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          <div>
            <CardTitle className="heading-section !text-2xl text-slate-900 uppercase">
              Activity Analytics
            </CardTitle>
            <p className="caption-small !text-slate-400 mt-1 uppercase tracking-widest">
              Live Movement Trends
            </p>
          </div>
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
              <AreaChart data={chartData}>
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
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="outward"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  fill="url(#colorOutward)"
                  animationDuration={1500}
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
                Recent Logs
              </CardTitle>
              <p className="caption-small !text-slate-400 mt-1 uppercase tracking-widest">
                Global Movement History
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-2xl h-12 px-6 label-bold border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all group shadow-sm"
              onClick={() => navigate("/activity-logs")}
            >
              VIEW ALL
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-[11px] uppercase tracking-widest">
                    Entry ID
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-[11px] uppercase tracking-widest">
                    Operation
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-[11px] uppercase tracking-widest">
                    Specification
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-right text-[11px] uppercase tracking-widest">
                    Qty
                  </th>
                  <th className="px-10 py-6 label-bold !text-slate-400 text-right text-[11px] uppercase tracking-widest">
                    Sync
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer border-b border-slate-50 last:border-0"
                    onClick={() => {
                      if (tx.origin === "gin") {
                        navigate(`/transactions/gin/view/${tx.headerId}`);
                      } else {
                        navigate(`/transactions/tasks/${tx.id}`);
                      }
                    }}
                  >
                    <td className="px-10 py-6 text-sm font-black text-slate-400 font-mono">
                      #{tx.id}
                    </td>
                    <td className="px-10 py-6">
                      <Badge
                        className={`rounded-lg px-3 py-1.5 border-0 font-black text-[10px] tracking-widest text-white ${tx.type === "Inward" || tx.type === "Inward (GIN)" ? "bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.3)]" : "bg-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.3)]"}`}
                      >
                        {tx.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800">
                          {tx.item || "General Inventory"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Movement Verified
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-slate-600 font-black text-xs shadow-sm">
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

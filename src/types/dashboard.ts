export interface KPI {
  title: string;
  value: string | number;
  icon: string;
  change: string;
  up: boolean;
  bg?: string;
  iconColor?: string;
  link?: string;
}

export interface RecentTransaction {
  id: string;
  type: 'Inward' | 'Outward';
  item: string;
  qty: number;
  date: string;
}

export interface ChartDataPoint {
  name: string;
  inward: number;
  outward: number;
}

export interface SystemStatusNode {
  label: string;
  value: string | number;
  icon: string;
}

export interface DashboardStatsResponse {
  status: boolean;
  data: {
    kpis: KPI[];
    recentTransactions: RecentTransaction[];
    chartData: ChartDataPoint[];
    systemStatus: SystemStatusNode[];
  };
}

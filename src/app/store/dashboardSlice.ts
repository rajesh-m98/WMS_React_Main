import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KPI, RecentTransaction, ChartDataPoint, SystemStatusNode } from '@/types/dashboard';

interface DashboardState {
  kpis: KPI[];
  recentTransactions: RecentTransaction[];
  chartData: ChartDataPoint[];
  systemStatus: SystemStatusNode[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  kpis: [],
  recentTransactions: [],
  chartData: [],
  systemStatus: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    dashboardLoadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    dashboardLoadSuccess: (state, action: PayloadAction<{ kpis: KPI[], recentTransactions: RecentTransaction[], chartData: ChartDataPoint[], systemStatus: SystemStatusNode[] }>) => {
      state.loading = false;
      state.kpis = action.payload.kpis || [];
      state.recentTransactions = action.payload.recentTransactions || [];
      state.chartData = action.payload.chartData || [];
      state.systemStatus = action.payload.systemStatus || [];
    },
    dashboardLoadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const { dashboardLoadStart, dashboardLoadSuccess, dashboardLoadFailure } = dashboardSlice.actions;
export default dashboardSlice.reducer;

import api from '@/lib/api';
import { AppDispatch } from '../store';
import { dashboardLoadStart, dashboardLoadSuccess, dashboardLoadFailure } from '../store/dashboardSlice';
import { userLoadSuccess } from '../store/masterSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

export const handleFetchDashboardData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(dashboardLoadStart());

    // Execute multiple API calls in parallel to improve performance
    const [statsRes, usersRes] = await Promise.all([
      api.post(API_ENDPOINTS.DASHBOARD.GET_STATS),
      api.get(`${API_ENDPOINTS.MASTERS.USERS}?companyid=1`) // Fix: assuming companyid 1 for now
    ]);
    
    if (statsRes.data.status) {
      const statsData = statsRes.data.data;
      const kpis = [...(statsData?.kpis || [])];

      // Update User count from real API data
      if (usersRes?.data?.status) {
        const users = usersRes.data.data || [];
        const userCount = users.length;
        
        // Sync master state too
        dispatch(userLoadSuccess(users));

        const userKpiIndex = kpis.findIndex(k => k.title?.toLowerCase().includes('user'));
        if (userKpiIndex !== -1) {
          kpis[userKpiIndex] = { ...kpis[userKpiIndex], value: userCount.toString() };
        }
      }

      dispatch(dashboardLoadSuccess({
        kpis: kpis,
        recentTransactions: statsData?.recentTransactions || [],
        chartData: statsData?.chartData || [],
        systemStatus: statsData?.systemStatus || []
      }));
    } else {
      dispatch(dashboardLoadFailure("Failed to retrieve dashboard stats"));
    }
  } catch (err: any) {
    dispatch(dashboardLoadFailure(err.message || 'Error fetching dashboard data'));
  }
};

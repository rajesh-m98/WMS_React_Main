import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface HistoryState {
  inward: {
    data: any[];
    loading: boolean;
    totalCount: number;
    error: string | null;
  };
  outward: {
    data: any[];
    loading: boolean;
    totalCount: number;
    error: string | null;
  };
  currentTask: {
    summary: any;
    items: any[];
    loading: boolean;
  };
}

const initialState: HistoryState = {
  inward: {
    data: [],
    loading: false,
    totalCount: 0,
    error: null,
  },
  outward: {
    data: [],
    loading: false,
    totalCount: 0,
    error: null,
  },
  currentTask: {
    summary: null,
    items: [],
    loading: false,
  },
};

export const fetchInwardHistory = createAsyncThunk(
  'history/fetchInward',
  async (params: { page: number; size: number }) => {
    const response = await api.post('taskList/get_all_tasklist', {
      ...params,
      picklist_type: 1,
      status: 2, // Completed
    });
    return response.data;
  }
);

export const fetchOutwardHistory = createAsyncThunk(
  'history/fetchOutward',
  async (params: { page: number; size: number }) => {
    const response = await api.post('taskList/get_all_tasklist', {
      ...params,
      picklist_type: 2,
      status: 2, // Completed
    });
    return response.data;
  }
);

export const fetchTaskById = createAsyncThunk(
  'history/fetchTaskById',
  async (id: number) => {
    const summaryRes = await api.post('taskList/get_task_by_id', { id });
    const itemsRes = await api.post('taskList/get_pick_list_items_by_id', { id, page: 1, size: 100 });
    return { summary: summaryRes.data, items: itemsRes.data };
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask.summary = null;
      state.currentTask.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInwardHistory.pending, (state) => {
        state.inward.loading = true;
      })
      .addCase(fetchInwardHistory.fulfilled, (state, action) => {
        state.inward.loading = false;
        if (action.payload.status) {
          state.inward.data = action.payload.data.items || [];
          state.inward.totalCount = action.payload.data.totalCount || 0;
        }
      })
      .addCase(fetchOutwardHistory.pending, (state) => {
        state.outward.loading = true;
      })
      .addCase(fetchOutwardHistory.fulfilled, (state, action) => {
        state.outward.loading = false;
        if (action.payload.status) {
          state.outward.data = action.payload.data.items || [];
          state.outward.totalCount = action.payload.data.totalCount || 0;
        }
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.currentTask.loading = true;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask.loading = false;
        if (action.payload.summary.status) {
          state.currentTask.summary = action.payload.summary.data;
        }
        if (action.payload.items.status) {
          state.currentTask.items = action.payload.items.data.items || [];
        }
      });
  },
});

export const { clearCurrentTask } = historySlice.actions;
export default historySlice.reducer;

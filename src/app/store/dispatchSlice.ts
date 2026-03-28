import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DispatchHistoryDTO } from '@/core/models/dispatch.model';

interface DispatchState {
  data: DispatchHistoryDTO[];
  currentDetail: DispatchHistoryDTO | null;
  loading: boolean;
  totalCount: number;
  error: string | null;
  filters: {
    page: number;
    pageSize: number;
    search: string;
    from_date: string;
    to_date: string;
  };
}

const initialState: DispatchState = {
  data: [],
  currentDetail: null,
  loading: false,
  totalCount: 0,
  error: null,
  filters: {
    page: 1,
    pageSize: 15,
    search: '',
    from_date: '',
    to_date: '',
  },
};

const dispatchSlice = createSlice({
  name: 'dispatch',
  initialState,
  reducers: {
    dispatchLoadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    dispatchLoadSuccess: (state, action: PayloadAction<{ data: DispatchHistoryDTO[]; total: number }>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.totalCount = action.payload.total;
    },
    dispatchDetailSuccess: (state, action: PayloadAction<DispatchHistoryDTO>) => {
      state.loading = false;
      state.currentDetail = action.payload;
    },
    dispatchLoadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setDispatchFilters: (state, action: PayloadAction<Partial<DispatchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearDispatchData: (state) => {
      state.data = [];
      state.currentDetail = null;
      state.totalCount = 0;
      state.error = null;
    },
  },
});

export const { 
  dispatchLoadStart, 
  dispatchLoadSuccess, 
  dispatchDetailSuccess,
  dispatchLoadFailure, 
  setDispatchFilters, 
  clearDispatchData 
} = dispatchSlice.actions;
export default dispatchSlice.reducer;

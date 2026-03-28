import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PutawayState {
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
  currentDetail: {
    data: any | null;
    loading: boolean;
    error: string | null;
  };
  lastFetched: number | null;
}

const initialState: PutawayState = {
  inward: { data: [], loading: false, totalCount: 0, error: null },
  outward: { data: [], loading: false, totalCount: 0, error: null },
  currentDetail: { data: null, loading: false, error: null },
  lastFetched: null,
};

const putawaySlice = createSlice({
  name: "putaway",
  initialState,
  reducers: {
    putawayLoadStart: (
      state,
      action: PayloadAction<"inward" | "outward" | "detail" | "all">,
    ) => {
      if (action.payload === "inward") state.inward.loading = true;
      else if (action.payload === "outward") state.outward.loading = true;
      else if (action.payload === "all") {
        state.inward.loading = true;
        state.outward.loading = true;
      } else state.currentDetail.loading = true;
    },
    putawayLoadSuccess: (
      state,
      action: PayloadAction<{ type: "inward" | "outward"; data: any[]; total: number }>,
    ) => {
      const { type, data, total } = action.payload;
      if (type === "inward") {
        state.inward.loading = false;
        state.inward.data = data;
        state.inward.totalCount = total;
        state.inward.error = null;
      } else {
        state.outward.loading = false;
        state.outward.data = data;
        state.outward.totalCount = total;
        state.outward.error = null;
      }
    },
    unifiedPutawaySuccess: (
      state,
      action: PayloadAction<{ inward: any[]; outward: any[]; totalInward?: number; totalOutward?: number }>,
    ) => {
      state.inward.loading = false;
      state.outward.loading = false;
      state.inward.data = action.payload.inward;
      state.inward.totalCount = action.payload.totalInward ?? action.payload.inward.length;
      state.outward.data = action.payload.outward;
      state.outward.totalCount = action.payload.totalOutward ?? action.payload.outward.length;
      state.lastFetched = Date.now();
      state.inward.error = null;
      state.outward.error = null;
    },
    putawayDetailSuccess: (state, action: PayloadAction<any>) => {
      state.currentDetail.loading = false;
      state.currentDetail.data = action.payload;
      state.currentDetail.error = null;
    },
    putawayLoadFailure: (
      state,
      action: PayloadAction<{ type: "inward" | "outward" | "detail" | "all"; error: string }>,
    ) => {
      const { type, error } = action.payload;
      if (type === "inward") {
        state.inward.loading = false;
        state.inward.error = error;
      } else if (type === "outward") {
        state.outward.loading = false;
        state.outward.error = error;
      } else if (type === "all") {
        state.inward.loading = false;
        state.outward.loading = false;
        state.inward.error = error;
        state.outward.error = error;
      } else {
        state.currentDetail.loading = false;
        state.currentDetail.error = error;
      }
    },
    clearPutawayDetail: (state) => {
      state.currentDetail.data = null;
      state.currentDetail.error = null;
    },
  },
});

export const {
  putawayLoadStart,
  putawayLoadSuccess,
  unifiedPutawaySuccess,
  putawayDetailSuccess,
  putawayLoadFailure,
  clearPutawayDetail,
} = putawaySlice.actions;

export default putawaySlice.reducer;

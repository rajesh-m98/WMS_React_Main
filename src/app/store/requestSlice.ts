import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequestState {
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
  lastFetched: number | null;
}

const initialState: RequestState = {
  inward: { data: [], loading: false, totalCount: 0, error: null },
  outward: { data: [], loading: false, totalCount: 0, error: null },
  lastFetched: null,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    requestLoadStart: (
      state,
      action: PayloadAction<"inward" | "outward" | "all">,
    ) => {
      if (action.payload === "all") {
        state.inward.loading = true;
        state.outward.loading = true;
      } else {
        state[action.payload].loading = true;
        state[action.payload].error = null;
      }
    },
    inwardLoadSuccess: (
      state,
      action: PayloadAction<{ data: any[]; total?: number }>,
    ) => {
      state.inward.loading = false;
      state.inward.data = action.payload.data;
      state.inward.totalCount =
        action.payload.total ?? action.payload.data.length;
    },
    outwardLoadSuccess: (
      state,
      action: PayloadAction<{ data: any[]; total?: number }>,
    ) => {
      state.outward.loading = false;
      state.outward.data = action.payload.data;
      state.outward.totalCount =
        action.payload.total ?? action.payload.data.length;
    },
    unifiedRequestSuccess: (
      state,
      action: PayloadAction<{ inward: any[]; outward: any[] }>,
    ) => {
      state.inward.loading = false;
      state.outward.loading = false;
      state.inward.data = action.payload.inward;
      state.inward.totalCount = action.payload.inward.length;
      state.outward.data = action.payload.outward;
      state.outward.totalCount = action.payload.outward.length;
      state.lastFetched = Date.now();
      state.inward.error = null;
      state.outward.error = null;
    },
    requestLoadFailure: (
      state,
      action: PayloadAction<{ type: "inward" | "outward" | "all"; error: string }>,
    ) => {
      if (action.payload.type === "all") {
        state.inward.loading = false;
        state.outward.loading = false;
        state.inward.error = action.payload.error;
        state.outward.error = action.payload.error;
      } else {
        state[action.payload.type].loading = false;
        state[action.payload.type].error = action.payload.error;
      }
    },
  },
});

export const {
  requestLoadStart,
  inwardLoadSuccess,
  outwardLoadSuccess,
  unifiedRequestSuccess,
  requestLoadFailure,
} = requestSlice.actions;

export default requestSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: RequestState = {
  inward: { data: [], loading: false, totalCount: 0, error: null },
  outward: { data: [], loading: false, totalCount: 0, error: null },
};

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    requestLoadStart: (state, action: PayloadAction<'inward' | 'outward'>) => {
      state[action.payload].loading = true;
      state[action.payload].error = null;
    },
    inwardLoadSuccess: (state, action: PayloadAction<{ data: any[]; total?: number }>) => {
      state.inward.loading = false;
      state.inward.data = action.payload.data;
      state.inward.totalCount = action.payload.total ?? action.payload.data.length;
    },
    outwardLoadSuccess: (state, action: PayloadAction<{ data: any[]; total?: number }>) => {
      state.outward.loading = false;
      state.outward.data = action.payload.data;
      state.outward.totalCount = action.payload.total ?? action.payload.data.length;
    },
    requestLoadFailure: (state, action: PayloadAction<{ type: 'inward' | 'outward'; error: string }>) => {
      state[action.payload.type].loading = false;
      state[action.payload.type].error = action.payload.error;
    },
  },
});

export const { 
  requestLoadStart, inwardLoadSuccess, outwardLoadSuccess, requestLoadFailure 
} = requestSlice.actions;

export default requestSlice.reducer;

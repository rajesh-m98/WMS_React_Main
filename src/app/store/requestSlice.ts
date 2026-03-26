import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

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
  isGenerating: boolean;
}

const initialState: RequestState = {
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
  isGenerating: false,
};

export const fetchInwardRequests = createAsyncThunk(
  'request/fetchInward',
  async (params: { page: number; size: number; search: string; from_date: string; to_date: string }) => {
    const response = await api.post('inwardrequest/get_all_inward', {
      ...params,
      is_paginate: true,
    });
    return response.data;
  }
);

export const fetchOutwardRequests = createAsyncThunk(
  'request/fetchOutward',
  async (params: { page: number; size: number; search: string; from_date: string; to_date: string }) => {
    const response = await api.post('inwardrequest/get_all_outward', {
      ...params,
      is_paginate: true,
    });
    return response.data;
  }
);

const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    clearInward: (state) => {
      state.inward.data = [];
      state.inward.totalCount = 0;
    },
    clearOutward: (state) => {
      state.outward.data = [];
      state.outward.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInwardRequests.pending, (state) => {
        state.inward.loading = true;
        state.inward.error = null;
      })
      .addCase(fetchInwardRequests.fulfilled, (state, action) => {
        state.inward.loading = false;
        if (action.payload.status) {
          state.inward.data = action.payload.data.items || [];
          state.inward.totalCount = action.payload.data.totalCount || 0;
        } else {
          state.inward.error = action.payload.message;
        }
      })
      .addCase(fetchInwardRequests.rejected, (state, action) => {
        state.inward.loading = false;
        state.inward.error = action.error.message || 'Failed to fetch inward requests';
      })
      .addCase(fetchOutwardRequests.pending, (state) => {
        state.outward.loading = true;
        state.outward.error = null;
      })
      .addCase(fetchOutwardRequests.fulfilled, (state, action) => {
        state.outward.loading = false;
        if (action.payload.status) {
          state.outward.data = action.payload.data.items || [];
          state.outward.totalCount = action.payload.data.totalCount || 0;
        } else {
          state.outward.error = action.payload.message;
        }
      })
      .addCase(fetchOutwardRequests.rejected, (state, action) => {
        state.outward.loading = false;
        state.outward.error = action.error.message || 'Failed to fetch outward requests';
      });
  },
});

export const { setGenerating, clearInward, clearOutward } = requestSlice.actions;
export default requestSlice.reducer;

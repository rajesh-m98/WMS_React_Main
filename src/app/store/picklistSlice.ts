import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface PickListState {
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
  isAssigning: boolean;
}

const initialState: PickListState = {
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
  isAssigning: false,
};

export const fetchInwardPickLists = createAsyncThunk(
  'picklist/fetchInward',
  async (params: { page: number; size: number; search: string }) => {
    const response = await api.post('taskList/get_all_tasklist', {
      ...params,
      picklist_type: 1,
    });
    return response.data;
  }
);

export const fetchOutwardPickLists = createAsyncThunk(
  'picklist/fetchOutward',
  async (params: { page: number; size: number; search: string }) => {
    const response = await api.post('taskList/get_all_tasklist', {
      ...params,
      picklist_type: 2,
    });
    return response.data;
  }
);

const picklistSlice = createSlice({
  name: 'picklist',
  initialState,
  reducers: {
    setAssigning: (state, action: PayloadAction<boolean>) => {
      state.isAssigning = action.payload;
    },
    clearInwardPick: (state) => {
      state.inward.data = [];
      state.inward.totalCount = 0;
    },
    clearOutwardPick: (state) => {
      state.outward.data = [];
      state.outward.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInwardPickLists.pending, (state) => {
        state.inward.loading = true;
      })
      .addCase(fetchInwardPickLists.fulfilled, (state, action) => {
        state.inward.loading = false;
        if (action.payload.status) {
          state.inward.data = action.payload.data.items || [];
          state.inward.totalCount = action.payload.data.totalCount || 0;
        }
      })
      .addCase(fetchInwardPickLists.rejected, (state) => {
        state.inward.loading = false;
        state.inward.data = [];
      })
      .addCase(fetchOutwardPickLists.pending, (state) => {
        state.outward.loading = true;
      })
      .addCase(fetchOutwardPickLists.fulfilled, (state, action) => {
        state.outward.loading = false;
        if (action.payload.status) {
          state.outward.data = action.payload.data.items || [];
          state.outward.totalCount = action.payload.data.totalCount || 0;
        }
      })
      .addCase(fetchOutwardPickLists.rejected, (state) => {
        state.outward.loading = false;
        state.outward.data = [];
      });
  },
});

export const { setAssigning, clearInwardPick, clearOutwardPick } = picklistSlice.actions;
export default picklistSlice.reducer;

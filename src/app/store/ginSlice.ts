import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GinLineDTO, GinHeaderDTO } from '@/core/models/transaction.model';

interface GinState {
  items: GinLineDTO[];
  flowThroughItems: GinLineDTO[];
  putawayItems: GinLineDTO[];
  currentHeader: GinHeaderDTO | null;
  currentLines: GinLineDTO[];
  loading: boolean;
  error: string | null;
  formLoading: boolean;
  total: number;
  totalFlowThrough: number;
  totalPutaway: number;
  page: number;
  fromDate: string;
  toDate: string;
}

const initialState: GinState = {
  items: [],
  flowThroughItems: [],
  putawayItems: [],
  currentHeader: null,
  currentLines: [],
  loading: false,
  error: null,
  formLoading: false,
  total: 0,
  totalFlowThrough: 0,
  totalPutaway: 0,
  page: 1,
  fromDate: "",
  toDate: "",
};

const ginSlice = createSlice({
  name: 'gin',
  initialState,
  reducers: {
    ginFetchStart: (state) => {
      state.loading = true;
      state.error = null;
      state.currentHeader = null;
      state.currentLines = [];
    },
    ginFetchSuccess: (state, action: PayloadAction<{ items: GinLineDTO[]; total: number; page: number; gin_type?: number }>) => {
      state.loading = false;
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
      state.page = action.payload.page || 1;
      
      if (action.payload.gin_type === 1) {
        state.totalFlowThrough = action.payload.total || 0;
        state.flowThroughItems = action.payload.items || [];
      }
      if (action.payload.gin_type === 2) {
        state.totalPutaway = action.payload.total || 0;
        state.putawayItems = action.payload.items || [];
      }
    },
    ginFetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentGinHeader: (state, action: PayloadAction<GinHeaderDTO | null>) => {
      state.currentHeader = action.payload;
      state.loading = false;
    },
    setCurrentGinLines: (state, action: PayloadAction<GinLineDTO[]>) => {
      state.currentLines = action.payload;
      state.loading = false;
    },
    setGinFormLoading: (state, action: PayloadAction<boolean>) => {
      state.formLoading = action.payload;
    },
    setFromDate: (state, action: PayloadAction<string>) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action: PayloadAction<string>) => {
      state.toDate = action.payload;
    },
  },
});

export const {
  ginFetchStart,
  ginFetchSuccess,
  ginFetchFailure,
  setCurrentGinHeader,
  setCurrentGinLines,
  setGinFormLoading,
  setFromDate,
  setToDate,
} = ginSlice.actions;

export default ginSlice.reducer;

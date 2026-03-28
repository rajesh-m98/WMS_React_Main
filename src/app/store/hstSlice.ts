import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HSTDevice {
  id: number;
  device_id: string;
  device_name?: string;
  brand_name?: string;
  device_serial_number: string;
  device_type: string;
  aisle_mapping?: string;
  device_status: number;
  companyid: number;
  warehouse_id: number;
}

interface HSTType {
  device_type: string;
  device_model: string;
}

interface HSTState {
  data: HSTDevice[];
  currentHST: HSTDevice | null;
  unassigned: HSTDevice[];
  types: HSTType[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

const initialState: HSTState = {
  data: [],
  currentHST: null,
  unassigned: [],
  types: [],
  loading: false,
  totalCount: 0,
  error: null,
};

const hstSlice = createSlice({
  name: 'hst',
  initialState,
  reducers: {
    hstLoadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    hstLoadSuccess: (state, action: PayloadAction<{ data: HSTDevice[], total?: number }>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.totalCount = action.payload.total ?? action.payload.data.length;
    },
    hstUnassignedSuccess: (state, action: PayloadAction<HSTDevice[]>) => {
      state.loading = false;
      state.unassigned = action.payload;
    },
    hstTypesSuccess: (state, action: PayloadAction<HSTType[]>) => {
      state.loading = false;
      state.types = action.payload;
    },
    hstDetailSuccess: (state, action: PayloadAction<HSTDevice>) => {
      state.loading = false;
      state.currentHST = action.payload;
    },
    clearCurrentHST: (state) => {
      state.currentHST = null;
    },
    hstLoadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  hstLoadStart, hstLoadSuccess, hstUnassignedSuccess, hstTypesSuccess, hstLoadFailure, hstDetailSuccess, clearCurrentHST
} = hstSlice.actions;

export default hstSlice.reducer;

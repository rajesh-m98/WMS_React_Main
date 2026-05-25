import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HSTDevice {
  id: number;
  deviceId: string;
  deviceName?: string;
  brandName?: string;
  deviceSerialNumber: string;
  deviceType: string;
  aisleMapping?: string;
  deviceStatus: number;
  companyid?: number;
  warehouseId: number;
  locations?: number[];
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
    clearAllHST: (state) => {
      state.data = [];
      state.totalCount = 0;
      state.error = null;
    },
  },
});

export const {
  hstLoadStart, hstLoadSuccess, hstUnassignedSuccess, hstTypesSuccess, hstLoadFailure, hstDetailSuccess, clearCurrentHST, clearAllHST
} = hstSlice.actions;

export default hstSlice.reducer;

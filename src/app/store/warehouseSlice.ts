import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WarehouseItem {
  id: number;
  companyid: number;
  warehouse_name: string;
  warehouse_code: string;
  gstnumber: string;
  bplid: string;
  bplname: string;
  location: string;
  street: string;
  block: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  inactive: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
}

interface WarehouseState {
  data: WarehouseItem[];
  currentWarehouse: WarehouseItem | null;
  loading: boolean;
  totalCount: number;
  error: string | null;
}

const initialState: WarehouseState = {
  data: [],
  currentWarehouse: null,
  loading: false,
  totalCount: 0,
  error: null,
};

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    warehouseLoadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    warehouseLoadSuccess: (state, action: PayloadAction<{ data: WarehouseItem[], total?: number }>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.totalCount = action.payload.total ?? action.payload.data.length;
    },
    warehouseDetailSuccess: (state, action: PayloadAction<WarehouseItem>) => {
      state.loading = false;
      state.currentWarehouse = action.payload;
    },
    warehouseLoadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentWarehouse: (state) => {
      state.currentWarehouse = null;
    },
  },
});

export const { 
  warehouseLoadStart, 
  warehouseLoadSuccess, 
  warehouseDetailSuccess, 
  warehouseLoadFailure,
  clearCurrentWarehouse 
} = warehouseSlice.actions;

export default warehouseSlice.reducer;

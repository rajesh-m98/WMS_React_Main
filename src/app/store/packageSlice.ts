import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PackageDTO } from '@/core/models/master.model';

interface PackageState {
  data: PackageDTO[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

const initialState: PackageState = {
  data: [],
  loading: false,
  totalCount: 0,
  error: null,
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    packageLoadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    packageLoadSuccess: (state, action: PayloadAction<{ data: PackageDTO[], total: number }>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.totalCount = action.payload.total;
    },
    packageLoadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearPackages: (state) => {
      state.data = [];
      state.totalCount = 0;
      state.error = null;
    },
  },
});

export const { 
  packageLoadStart, packageLoadSuccess, packageLoadFailure, clearPackages
} = packageSlice.actions;

export default packageSlice.reducer;

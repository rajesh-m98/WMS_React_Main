import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO, PackageDTO } from '@/core/models/master.model';

interface MasterState {
  users: {
    data: UserDTO[];
    currentUser: UserDTO | null;
    loading: boolean;
    totalCount: number;
    error: string | null;
  };
  packages: {
    data: PackageDTO[];
    loading: boolean;
    totalCount: number;
    error: string | null;
  };
}

const initialState: MasterState = {
  users: { data: [], currentUser: null, loading: false, totalCount: 0, error: null },
  packages: { data: [], loading: false, totalCount: 0, error: null },
};

const masterSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    // User Master
    userLoadStart: (state) => {
      state.users.loading = true;
      state.users.error = null;
    },
    userLoadSuccess: (state, action: PayloadAction<{ data: UserDTO[]; total?: number }>) => {
      state.users.loading = false;
      state.users.data = action.payload.data;
      state.users.totalCount = action.payload.total ?? action.payload.data.length;
    },
    userDetailSuccess: (state, action: PayloadAction<UserDTO>) => {
      state.users.loading = false;
      state.users.currentUser = action.payload;
    },
    userLoadFailure: (state, action: PayloadAction<string>) => {
      state.users.loading = false;
      state.users.error = action.payload;
    },
    clearCurrentUser: (state) => {
      state.users.currentUser = null;
    },


    // Package Master
    packageLoadStart: (state) => {
      state.packages.loading = true;
      state.packages.error = null;
    },
    packageLoadSuccess: (state, action: PayloadAction<{ data: PackageDTO[]; total?: number }>) => {
      state.packages.loading = false;
      state.packages.data = action.payload.data;
      state.packages.totalCount = action.payload.total ?? action.payload.data.length;
    },
    packageLoadFailure: (state, action: PayloadAction<string>) => {
      state.packages.loading = false;
      state.packages.error = action.payload;
    },

  },
});

export const { 
  userLoadStart, userLoadSuccess, userDetailSuccess, userLoadFailure, clearCurrentUser,
  packageLoadStart, packageLoadSuccess, packageLoadFailure
} = masterSlice.actions;

export default masterSlice.reducer;

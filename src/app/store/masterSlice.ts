import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDTO } from '@/core/models/master.model';

interface MasterState {
  users: {
    data: UserDTO[];
    currentUser: UserDTO | null;
    loading: boolean;
    totalCount: number;
    error: string | null;
  };
}

const initialState: MasterState = {
  users: { data: [], currentUser: null, loading: false, totalCount: 0, error: null },
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
    userLoadSuccess: (state, action: PayloadAction<UserDTO[]>) => {
      state.users.loading = false;
      state.users.data = action.payload;
      state.users.totalCount = action.payload.length;
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


    // Items


  },
});

export const { 
  userLoadStart, userLoadSuccess, userDetailSuccess, userLoadFailure, clearCurrentUser
} = masterSlice.actions;

export default masterSlice.reducer;

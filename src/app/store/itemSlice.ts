import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemDTO } from '@/core/models/master.model';

interface ItemState {
  data: ItemDTO[];
  loading: boolean;
  totalCount: number;
  error: string | null;
}

const initialState: ItemState = {
  data: [],
  loading: false,
  totalCount: 0,
  error: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    itemLoadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    itemLoadSuccess: (state, action: PayloadAction<{ data: ItemDTO[], total: number }>) => {
      state.loading = false;
      state.data = action.payload.data;
      state.totalCount = action.payload.total;
    },
    itemLoadFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  itemLoadStart, itemLoadSuccess, itemLoadFailure 
} = itemSlice.actions;

export default itemSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FloorDTO } from '@/core/models/master.model';

interface FloorState {
  data: FloorDTO[];
  currentFloor: FloorDTO | null;
  loading: boolean;
  error: string | null;
  formLoading: boolean;
}

const initialState: FloorState = {
  data: [],
  currentFloor: null,
  loading: false,
  error: null,
  formLoading: false,
};

const floorSlice = createSlice({
  name: 'floor',
  initialState,
  reducers: {
    floorFetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    floorFetchSuccess: (state, action: PayloadAction<FloorDTO[]>) => {
      state.loading = false;
      state.data = action.payload || [];
    },
    floorFetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentFloor: (state, action: PayloadAction<FloorDTO | null>) => {
      state.currentFloor = action.payload;
    },
    setFormLoading: (state, action: PayloadAction<boolean>) => {
      state.formLoading = action.payload;
    },
  },
});

export const {
  floorFetchStart,
  floorFetchSuccess,
  floorFetchFailure,
  setCurrentFloor,
  setFormLoading,
} = floorSlice.actions;

export default floorSlice.reducer;

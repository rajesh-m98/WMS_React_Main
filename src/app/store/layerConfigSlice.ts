import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LayerConfigDTO {
  id: number;
  warehouse_id: number;
  layer1: string | null;
  layer2: string | null;
  layer3: string | null;
  layer4: string | null;
  layer5: string | null;
  layer6: string | null;
  barcode: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

interface LayerConfigState {
  data: LayerConfigDTO[];
  loading: boolean;
  error: string | null;
}

const initialState: LayerConfigState = {
  data: [],
  loading: false,
  error: null,
};

const layerConfigSlice = createSlice({
  name: 'layerConfig',
  initialState,
  reducers: {
    fetchLayerConfigStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLayerConfigSuccess: (state, action: PayloadAction<LayerConfigDTO[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchLayerConfigFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLayerConfigStart,
  fetchLayerConfigSuccess,
  fetchLayerConfigFailure,
} = layerConfigSlice.actions;

export default layerConfigSlice.reducer;

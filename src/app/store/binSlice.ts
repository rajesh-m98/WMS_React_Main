import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BinLayerDTO } from '@/core/models/master.model';

interface BinState {
  data: BinLayerDTO[];
  columns: BinLayerDTO[][];
  selectedPath: BinLayerDTO[];
  loading: boolean;
  error: string | null;
  formStatus: {
    isCreateOpen: boolean;
    isEditOpen: boolean;
    loading: boolean;
  };
}

const initialState: BinState = {
  data: [],
  columns: [],
  selectedPath: [],
  loading: false,
  error: null,
  formStatus: {
    isCreateOpen: false,
    isEditOpen: false,
    loading: false,
  },
};

const binSlice = createSlice({
  name: 'bins',
  initialState,
  reducers: {
    binFetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    binFetchSuccess: (state, action: PayloadAction<BinLayerDTO[]>) => {
      state.loading = false;
      state.data = action.payload;
      // Initialize columns if empty or reset
      if (state.selectedPath.length === 0) {
        state.columns = [action.payload];
      } else {
         // Re-reconstruct columns based on new data if needed
         // For now, simple reset is safer or we can complex update
         state.columns = [action.payload];
         state.selectedPath = [];
      }
    },
    binFetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectNode: (state, action: PayloadAction<{ node: BinLayerDTO; colIndex: number }>) => {
      const { node, colIndex } = action.payload;
      
      // Update selected path
      const nextPath = state.selectedPath.slice(0, colIndex);
      nextPath[colIndex] = node;
      state.selectedPath = nextPath;

      // Update columns
      const nextColumns = state.columns.slice(0, colIndex + 1);
      if (node.children && node.children.length > 0) {
        nextColumns.push(node.children);
      }
      state.columns = nextColumns;
    },
    clearSelection: (state) => {
      state.selectedPath = [];
      state.columns = [state.data];
    },
    setCreateOpen: (state, action: PayloadAction<boolean>) => {
      state.formStatus.isCreateOpen = action.payload;
    },
    setEditOpen: (state, action: PayloadAction<boolean>) => {
      state.formStatus.isEditOpen = action.payload;
    },
    setFormLoading: (state, action: PayloadAction<boolean>) => {
        state.formStatus.loading = action.payload;
    }
  },
});

export const {
  binFetchStart,
  binFetchSuccess,
  binFetchFailure,
  selectNode,
  clearSelection,
  setCreateOpen,
  setEditOpen,
  setFormLoading
} = binSlice.actions;

export default binSlice.reducer;

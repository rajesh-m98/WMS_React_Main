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
    floorFetchSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      
      // Group the flat records by barcode
      const grouped = action.payload.reduce((acc: any, curr: any) => {
        const barcode = curr.barcode;
        if (!barcode) return acc;
        
        if (!acc[barcode]) {
          acc[barcode] = {
            id: curr.id, // Using the first ID as the primary reference
            warehouse_id: curr.warehouse_id,
            barcode: barcode,
            floor1: "-",
            floor2: "-",
            floor3: "-",
            floor4: "-",
            floor5: "-",
            floor6: "-",
            created_at: curr.created_at,
            updated_at: curr.updated_at
          };
        }
        
        // Map dynamically: "floor1" -> floor1, "floor2" -> floor2, etc.
        if (curr.floor && curr.value) {
          acc[barcode][curr.floor] = curr.value;
        }
        
        return acc;
      }, {});
      
      state.data = Object.values(grouped) as FloorDTO[];
    },
    floorFetchFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentFloor: (state, action: PayloadAction<any | null>) => {
      if (!action.payload) {
        state.currentFloor = null;
        return;
      }
      
      // If it's a flat record from the API (has floor and value keys)
      if (action.payload.floor && action.payload.value) {
        const transformed: FloorDTO = {
          id: action.payload.id,
          warehouse_id: action.payload.warehouse_id,
          barcode: action.payload.barcode,
          floor1: "-", floor2: "-", floor3: "-", floor4: "-", floor5: "-", floor6: "-",
          ...state.currentFloor, // Keep existing values if merging multiple calls
          [action.payload.floor]: action.payload.value
        };
        state.currentFloor = transformed;
      } else {
        // If it's already a unified object or a list we need to group
        state.currentFloor = action.payload as FloorDTO;
      }
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

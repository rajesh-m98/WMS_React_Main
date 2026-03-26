import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AttributeState {
  id: number;
  label: string;
  isVisible: boolean;
}

interface AttributesState {
  items: AttributeState[];
  loading: boolean;
  error: string | null;
}

const initialState: AttributesState = {
  items: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    label: `Attribute ${i + 1}`,
    isVisible: true,
  })),
  loading: false,
  error: null,
};

const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    updateAttribute: (state, action: PayloadAction<{ id: number; label: string }>) => {
      const attr = state.items.find((i) => i.id === action.payload.id);
      if (attr) {
        attr.label = action.payload.label;
      }
    },
    toggleVisibility: (state, action: PayloadAction<number>) => {
      const attr = state.items.find((i) => i.id === action.payload);
      if (attr) {
        attr.isVisible = !attr.isVisible;
      }
    },
    setAttributes: (state, action: PayloadAction<AttributeState[]>) => {
      state.items = action.payload;
    },
  },
});

export const { updateAttribute, toggleVisibility, setAttributes } = attributesSlice.actions;
export default attributesSlice.reducer;

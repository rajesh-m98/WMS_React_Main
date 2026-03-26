import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import attributesReducer from './attributesSlice';
import authReducer from './authSlice';
import requestReducer from './requestSlice';
import picklistReducer from './picklistSlice';
import historyReducer from './historySlice';
import masterReducer from './masterSlice';
import dashboardReducer from './dashboardSlice';
import binReducer from './binSlice';
import hstReducer from './hstSlice';
import warehouseReducer from './warehouseSlice';
import itemReducer from './itemSlice';

export const store = configureStore({
  reducer: {
    attributes: attributesReducer,
    auth: authReducer,
    request: requestReducer,
    picklist: picklistReducer,
    history: historyReducer,
    master: masterReducer,
    dashboard: dashboardReducer,
    bins: binReducer,
    hst: hstReducer,
    warehouse: warehouseReducer,
    item: itemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

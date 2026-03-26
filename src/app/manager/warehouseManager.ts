import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  warehouseLoadStart, 
  warehouseLoadSuccess, 
  warehouseDetailSuccess, 
  warehouseLoadFailure,
  clearCurrentWarehouse 
} from '../store/warehouseSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

export const handleFetchAllWarehouses = (params?: { page?: number; size?: number; companyid?: number; is_paginate?: boolean }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const queryParams = new URLSearchParams({
      is_paginate: (params?.is_paginate ?? true).toString(),
      companyid: (params?.companyid ?? 1).toString(),
      page: (params?.page ?? 1).toString(),
      size: (params?.size ?? 50).toString(),
    }).toString();

    const response = await api.get<{ status: boolean; data: any }>(`${API_ENDPOINTS.MASTERS.WAREHOUSE.ALL}?${queryParams}`);
    if (response.data.status) {
      if (params?.is_paginate !== false) {
        dispatch(warehouseLoadSuccess({ 
          data: response.data.data.items || [], 
          total: response.data.data.total 
        }));
      } else {
        dispatch(warehouseLoadSuccess({ data: response.data.data }));
      }
    } else {
      dispatch(warehouseLoadFailure("Failed to retrieve warehouses"));
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error fetching warehouse data"));
  }
};

export const handleGetWarehouseById = (warehouse_id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const response = await api.get<{ status: boolean; data: any }>(`${API_ENDPOINTS.MASTERS.WAREHOUSE.GET_BY_ID}?warehouse_id=${warehouse_id}`);
    if (response.data.status) {
      dispatch(warehouseDetailSuccess(response.data.data));
    } else {
      dispatch(warehouseLoadFailure("Failed to retrieve warehouse details"));
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error fetching warehouse details"));
  }
};

export const handleCreateWarehouse = (data: any, warehouse_id: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const response = await api.post(`${API_ENDPOINTS.MASTERS.WAREHOUSE.CREATE}?warehouse_id=${warehouse_id}`, data);
    if (response.data.status) {
      dispatch(handleFetchAllWarehouses());
      return true;
    } else {
      dispatch(warehouseLoadFailure(response.data.message || "Failed to create warehouse"));
      return false;
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error creating warehouse"));
    return false;
  }
};

export const handleRefreshWarehouse = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const response = await api.get<{ status: boolean; data: any }>(API_ENDPOINTS.MASTERS.WAREHOUSE.REFRESH);
    if (response.data.status) {
      // Typically we'll refetch again to update state
      dispatch(handleFetchAllWarehouses());
      return true;
    } else {
      dispatch(warehouseLoadFailure("Failed to refresh warehouse data"));
      return false;
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error refreshing warehouse data"));
    return false;
  }
};

export const handleDeleteWarehouse = (warehouse_id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const response = await api.delete(`${API_ENDPOINTS.MASTERS.WAREHOUSE.DELETE}?warehouse_id=${warehouse_id}`);
    if (response.data.status) {
      dispatch(handleFetchAllWarehouses());
      return true;
    } else {
      dispatch(warehouseLoadFailure("Failed to delete warehouse"));
      return false;
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error deleting warehouse"));
    return false;
  }
};

export const handleClearCurrentWarehouse = () => (dispatch: AppDispatch) => {
  dispatch(clearCurrentWarehouse());
};

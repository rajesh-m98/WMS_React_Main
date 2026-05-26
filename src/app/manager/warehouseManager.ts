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
import { count } from 'node:console';

export const handleFetchAllWarehouses = (params?: { page?: number; size?: number; companyid?: number; is_paginate?: boolean }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const isPaginated = params?.is_paginate !== false;
    const queryParams = new URLSearchParams({
      is_paginate: isPaginated.toString(),
      companyid: (params?.companyid ?? 1).toString(),
      page: (params?.page ?? 1).toString(),
      size: (params?.size ?? 10).toString(),
    }).toString();

    const response = await api.get<{ status: boolean; data: any }>(`${API_ENDPOINTS.MASTERS.WAREHOUSE.ALL}?${queryParams}`);
    console.log(response.data);
    if (response.data.status) {
      const rawData = isPaginated
        ? (response.data.data?.items || [])
        : (Array.isArray(response.data.data) ? response.data.data : response.data.data?.items || []);

      // Extract the total count returned by the paginated FastAPI backend (checking all common key variations)
      const totalCount =
        response.data.data?.total ??
        response.data.data?.totalCount ??
        response.data.data?.total_count ??
        response.data.data?.count;

      dispatch(warehouseLoadSuccess({
        data: rawData,
        total: isPaginated ? (response.data.data.count ?? rawData.length) : rawData.length,
      }));
      return true;
    } else {
      dispatch(warehouseLoadFailure("Failed to retrieve warehouses"));
      return false;
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error fetching warehouse data"));
    return false;
  }
};

export const handleGetWarehouseById = (warehouse_id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get<{ status: boolean; data: any }>(`${API_ENDPOINTS.MASTERS.WAREHOUSE.GET_BY_ID}?warehouse_id=${warehouse_id}`);
    if (response.data.status) {
      dispatch(warehouseDetailSuccess(response.data.data));
      return response.data.data;
    } else {
      dispatch(warehouseLoadFailure("Failed to retrieve warehouse details"));
      return null;
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error fetching warehouse details"));
    return null;
  }
};

export const handleCreateWarehouse = (data: any, editId?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(warehouseLoadStart());
    const url = editId
      ? `${API_ENDPOINTS.MASTERS.WAREHOUSE.CREATE}?warehouse_id=${editId}`
      : API_ENDPOINTS.MASTERS.WAREHOUSE.CREATE;

    const response = await api.post(url, data);
    if (response.data.status) {
      return true;
    } else {
      dispatch(warehouseLoadFailure(response.data.message || (editId ? "Failed to update warehouse" : "Failed to create warehouse")));
      return false;
    }
  } catch (err: any) {
    dispatch(warehouseLoadFailure(err.message || "Error processing warehouse"));
    return false;
  }
};

export const handleRefreshWarehouse = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get<{ status: boolean; data: any }>(API_ENDPOINTS.MASTERS.WAREHOUSE.REFRESH);
    if (response.data.status) {
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

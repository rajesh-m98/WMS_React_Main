import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  hstLoadStart, hstLoadSuccess, hstUnassignedSuccess, hstTypesSuccess, hstLoadFailure, hstDetailSuccess 
} from '../store/hstSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

export const handleFetchAllHST = (params?: { page?: number; size?: number; companyid?: number }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(hstLoadStart());
    
    // Construct search params with backend required format
    const queryParams = new URLSearchParams({
      companyid: (params?.companyid || 1).toString(),
      is_paginate: 'true',
      page: (params?.page || 1).toString(),
      size: (params?.size || 50).toString()
    });

    const response = await api.get<{ status: boolean; data: any }>(`${API_ENDPOINTS.MASTERS.HST.ALL}?${queryParams.toString()}`);
    
    if (response.data.status) {
      const respData = response.data.data;
      if (respData && respData.items) {
        dispatch(hstLoadSuccess({ 
          data: respData.items,
          total: respData.total || respData.items.length
        }));
      } else {
        dispatch(hstLoadSuccess({ data: respData }));
      }
    } else {
      dispatch(hstLoadFailure("Failed to retrieve all devices"));
    }
  } catch (err: any) {
    dispatch(hstLoadFailure(err.message || "Error fetching all devices"));
  }
};

export const handleFetchUnassignedHST = (companyid: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(hstLoadStart());
    const response = await api.get<{ status: boolean; data: any[] }>(`${API_ENDPOINTS.MASTERS.HST.UNASSIGNED}?companyid=${companyid}`);
    if (response.data.status) {
      dispatch(hstUnassignedSuccess(response.data.data));
    } else {
      dispatch(hstLoadFailure("Failed to retrieve unassigned devices"));
    }
  } catch (err: any) {
    dispatch(hstLoadFailure(err.message || "Error fetching unassigned devices"));
  }
};

export const handleCreateHST = (deviceData: any, editId?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(hstLoadStart());
    
    // For CREATE: no URL params. For EDIT: pass device_id in URL.
    const url = editId 
      ? `${API_ENDPOINTS.MASTERS.HST.CREATE}?device_id=${editId}`
      : API_ENDPOINTS.MASTERS.HST.CREATE;

    const response = await api.post(url, deviceData);
    
    if (response.data.status) {
      return true;
    } else {
      dispatch(hstLoadFailure(response.data.message || (editId ? "Failed to update device" : "Failed to create device")));
      return false;
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail?.[0]?.msg || err.message || (editId ? "Error updating device" : "Error creating device");
    dispatch(hstLoadFailure(errorMsg));
    return false;
  }
};

export const handleDeleteHST = (deviceId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(hstLoadStart());
    const response = await api.delete(`${API_ENDPOINTS.MASTERS.HST.DELETE}?device_id=${deviceId}`);
    if (response.data.status) {
      dispatch(handleFetchAllHST());
      return true;
    } else {
      dispatch(hstLoadFailure(response.data.message || "Failed to delete device"));
      return false;
    }
  } catch (err: any) {
    dispatch(hstLoadFailure(err.message || "Error deleting device"));
    return false;
  }
};

export const handleFetchHSTTypes = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get<{ status: boolean; data: any[]; message?: string }>(API_ENDPOINTS.MASTERS.HST.TYPE_ALL);
    if (response.data.status) {
      // Normalize data: backend might return array of strings instead of objects
      const normalizedData = response.data.data.map((item: any) => {
        if (typeof item === 'string') {
          return { device_type: item, device_model: item };
        }
        return item;
      });
      dispatch(hstTypesSuccess(normalizedData));
    } else {
      dispatch(hstLoadFailure(response.data.message || "Failed to fetch device types"));
    }
  } catch (err: any) {
    console.error("Error fetching device types", err);
    dispatch(hstLoadFailure(err.message || "Error fetching device types"));
  }
};

export const handleFetchHSTById = (deviceId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get<{ status: boolean; data: any; message?: string }>(`${API_ENDPOINTS.MASTERS.HST.GET_BY_ID}?device_id=${deviceId}`);
    if (response.data.status) {
      dispatch(hstDetailSuccess(response.data.data));
      return response.data.data;
    } else {
      dispatch(hstLoadFailure(response.data.message || "Failed to fetch device details"));
      return null;
    }
  } catch (err: any) {
    dispatch(hstLoadFailure(err.message || "Error fetching device details"));
    return null;
  }
};

export const handleCreateHSTType = (typeData: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.post(`${API_ENDPOINTS.MASTERS.HST.TYPE_CREATE}?device_type_id=1`, typeData);
    if (response.data.status) {
      dispatch(handleFetchHSTTypes());
      return true;
    }
    return false;
  } catch (err: any) {
    console.error("Error creating device type", err);
    return false;
  }
};

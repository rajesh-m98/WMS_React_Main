import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  hstLoadStart, hstLoadSuccess, hstUnassignedSuccess, hstTypesSuccess, hstLoadFailure 
} from '../store/hstSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

export const handleFetchAllHST = (companyid: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(hstLoadStart());
    const response = await api.get<{ status: boolean; data: any[] }>(`${API_ENDPOINTS.MASTERS.HST.ALL}?companyid=${companyid}`);
    if (response.data.status) {
      dispatch(hstLoadSuccess({ data: response.data.data }));
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

export const handleCreateHST = (deviceData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(hstLoadStart());
    const response = await api.post(`${API_ENDPOINTS.MASTERS.HST.CREATE}?device_id=1`, deviceData);
    if (response.data.status) {
      dispatch(handleFetchAllHST());
      return true;
    } else {
      dispatch(hstLoadFailure(response.data.message || "Failed to create device"));
      return false;
    }
  } catch (err: any) {
    dispatch(hstLoadFailure(err.message || "Error creating device"));
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

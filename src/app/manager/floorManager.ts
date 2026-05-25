import api from '@/lib/api';
import { toast } from 'sonner';
import { AppDispatch } from '../store';
import {
  floorFetchStart,
  floorFetchSuccess,
  floorFetchFailure,
  setFormLoading,
  setCurrentFloor
} from '../store/floorSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { FloorDTO, CreateFloorPayload } from '@/core/models/master.model';

/**
 * Fetch all floors for a warehouse
 */
export const handleFetchFloors = (warehouseId: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(floorFetchStart());
    const response = await api.get<{ status: boolean; data: FloorDTO[] }>(API_ENDPOINTS.MASTERS.FLOOR.ALL, {
      params: { warehouseId: warehouseId }
    });

    if (response.data.status) {
      const floors = (response.data.data || []).map((f: any) => ({
        ...f,
        floor_Name: f.floor_Name || f.floor_Name
      }));
      dispatch(floorFetchSuccess(floors));
    } else {
      dispatch(floorFetchFailure("Failed to retrieve Floor data"));
    }
  } catch (err: any) {
    dispatch(floorFetchFailure(err.message || "Error fetching Floor data"));
  }
};

/**
 * Create or Update a floor
 */
export const handleCreateOrUpdateFloor = (payload: CreateFloorPayload, floorId?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setFormLoading(true));
    const url = floorId
      ? `${API_ENDPOINTS.MASTERS.FLOOR.CREATE}?floorId=${floorId}`
      : API_ENDPOINTS.MASTERS.FLOOR.CREATE;

    const backendPayload = {
      ...payload,
      floor_Name: payload.floor_Name
    };

    const response = await api.post(url, backendPayload);

    if (response.data.status) {
      toast.success(response.data.message || 'Floor configuration saved successfully');
      dispatch(handleFetchFloors());
      return true;
    } else {
      toast.error(response.data.message || 'Failed to save floor configuration');
      return false;
    }
  } catch (err: any) {
    toast.error('Network error during floor operation');
    return false;
  } finally {
    dispatch(setFormLoading(false));
  }
};

/**
 * Fetch a single floor by ID
 */
export const handleFetchFloorById = (floorId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(floorFetchStart());
    const response = await api.get<{ status: boolean; data: FloorDTO }>(API_ENDPOINTS.MASTERS.FLOOR.GET_BY_ID, {
      params: { floorId: floorId }
    });

    if (response.data.status) {
      const floorData = response.data.data as any;
      dispatch(setCurrentFloor({
        ...floorData,
        floor_Name: floorData.floor_Name || floorData.floor_Name
      }));
      dispatch(floorFetchFailure(""));
    } else {
      toast.error("Failed to fetch floor details");
    }
  } catch (err: any) {
    toast.error("Error fetching floor details");
  } finally {
    dispatch(setFormLoading(false));
  }
};

/**
 * Delete a floor by ID
 */
export const handleDeleteFloor = (floorId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.delete(API_ENDPOINTS.MASTERS.FLOOR.DELETE, {
      params: { floorId: floorId }
    });

    if (response.data.status) {
      toast.success(response.data.message || 'Floor deleted successfully');
      dispatch(handleFetchFloors());
      return true;
    } else {
      toast.error(response.data.message || 'Failed to delete floor');
      return false;
    }
  } catch (err: any) {
    toast.error('Network error during deletion');
    return false;
  }
};

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
      params: { warehouseid: warehouseId }
    });
    
    if (response.data.status) {
      dispatch(floorFetchSuccess(response.data.data || []));
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
      ? `${API_ENDPOINTS.MASTERS.FLOOR.CREATE}?floor_id=${floorId}`
      : API_ENDPOINTS.MASTERS.FLOOR.CREATE;

    const response = await api.post(url, payload);
    
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
      params: { floor_id: floorId }
    });
    
    if (response.data.status) {
      dispatch(setCurrentFloor(response.data.data));
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
      params: { floor_id: floorId }
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

import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  fetchLayerConfigStart, 
  fetchLayerConfigSuccess, 
  fetchLayerConfigFailure,
  LayerConfigDTO
} from '../store/layerConfigSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

export const handleFetchAllLayerConfigs = (warehouseId: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchLayerConfigStart());
    
    const response = await api.get<{ status: boolean; data: LayerConfigDTO[] }>(
      `${API_ENDPOINTS.MASTERS.LAYER_CONFIG_DB}?warehouseid=${warehouseId}`
    );

    if (response.data.status) {
      dispatch(fetchLayerConfigSuccess(response.data.data));
    } else {
      dispatch(fetchLayerConfigFailure("Failed to retrieve layer configuration"));
    }
  } catch (err: any) {
    dispatch(fetchLayerConfigFailure(err.message || "Error fetching layer configuration"));
  }
};

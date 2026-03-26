import api from '@/lib/api';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '../store';
import { 
  binFetchStart, 
  binFetchSuccess, 
  binFetchFailure,
  setCreateOpen,
  setEditOpen,
  setFormLoading
} from '../store/binSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { BinLayerDTO, CreateBinPayload } from '@/core/models/master.model';
import { downloadCSV } from '@/core/utils/csvHelper';

/**
 * Fetch all bin layers (hierarchical)
 */
export const handleFetchBins = (params: { warehouseid?: number } = {}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(binFetchStart());
    const response = await api.get<{ status: boolean; data: BinLayerDTO[] }>(API_ENDPOINTS.MASTERS.BINS_GET, {
      params: { 
        companyid: 1, 
        ...params 
      }
    });
    
    if (response.data.status) {
      dispatch(binFetchSuccess(response.data.data || []));
    } else {
      dispatch(binFetchFailure("Failed to retrieve Bin Layers"));
    }
  } catch (err: any) {
    dispatch(binFetchFailure(err.message || "Error fetching Bin data"));
  }
};

/**
 * Create or update a node. If layer_id is provided, it acts as the parent for new node or target for update depending on URL.
 */
export const handleCreateOrUpdateBin = (payload: { layer_id?: number; body: CreateBinPayload }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setFormLoading(true));
    const url = payload.layer_id 
      ? `${API_ENDPOINTS.MASTERS.BINS_CREATE}?layer_id=${payload.layer_id}`
      : API_ENDPOINTS.MASTERS.BINS_CREATE;

    const response = await api.post(url, payload.body);
    
    if (response.data.status) {
      toast.success(response.data.message || 'Bin configuration saved successfully');
      dispatch(handleFetchBins());
      dispatch(setCreateOpen(false));
      dispatch(setEditOpen(false));
      return response.data;
    } else {
      toast.error(response.data.message || 'Failed to save bin configuration');
      return null;
    }
  } catch (err: any) {
    toast.error('Network error during operation');
    return null;
  } finally {
    dispatch(setFormLoading(false));
  }
};

/**
 * Delete a node by ID.
 */
export const handleDeleteBin = (layer_id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.delete(API_ENDPOINTS.MASTERS.BINS_DELETE, {
      params: { layer_id }
    });

    if (response.data.status) {
      toast.success(response.data.message || 'Bin configuration deleted successfully');
      dispatch(handleFetchBins({ warehouseid: 1 }));
      return true;
    } else {
      toast.error(response.data.message || 'Failed to delete configuration');
      return false;
    }
  } catch (err: any) {
    toast.error('Network error during deletion');
    return false;
  }
};

/**
 * Export all bins to CSV (flattens the hierarchy)
 */
export const handleExportBins = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { data } = getState().bins;
  
  if (!data || data.length === 0) {
    toast.error("No data available to export");
    return;
  }

  // Flatten the hierarchical tree into rows
  const flattened: any[] = [];
  
  const extract = (nodes: BinLayerDTO[], level = 1, parentValues: string[] = []) => {
    nodes.forEach(node => {
      const currentRow = {
         id: node.id,
         layer: node.layer,
         value: node.value,
         barcode: node.barcode,
         full_path: [...parentValues, node.value].join(' > ')
      };
      flattened.push(currentRow);
      if (node.children && node.children.length > 0) {
        extract(node.children, level + 1, [...parentValues, node.value]);
      }
    });
  };

  extract(data);
  downloadCSV(flattened, `Bins_Export_${new Date().toISOString().split('T')[0]}`);
};

/**
 * Process Import (Demo simulation for now, since it requires mass-creation API)
 */
export const handleImportBins = (jsonData: any[]) => async (dispatch: AppDispatch) => {
  if (!jsonData || jsonData.length === 0) return;
  
  toast.info(`Importing ${jsonData.length} bin records... This is a demo simulation.`);
  
  // Real implementation would either loop through handleCreateOrUpdateBin 
  // or use a dedicated Bulk Upload API.
  
  setTimeout(() => {
    toast.success("Import complete (simulation)");
    dispatch(handleFetchBins());
  }, 1000);
};

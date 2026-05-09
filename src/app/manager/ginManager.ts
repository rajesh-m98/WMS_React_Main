import api from '@/lib/api';
import { toast } from 'sonner';
import { AppDispatch } from '../store';
import { 
  ginFetchStart, 
  ginFetchSuccess, 
  ginFetchFailure,
  setGinFormLoading,
  setCurrentGinHeader,
  setCurrentGinLines
} from '../store/ginSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { GinLineDTO, GinHeaderDTO, UpdateGinLinePayload } from '@/core/models/transaction.model';

/**
 * Fetch all GIN lines with optional pagination and filtering
 */
export const handleFetchGins = (params: { 
  gin_type?: number; 
  page?: number; 
  size?: number; 
  is_paginate?: boolean 
} = {}) => async (dispatch: AppDispatch) => {
  try {
    dispatch(ginFetchStart());
    const response = await api.get<{ status: boolean; data: { items: GinLineDTO[]; total: number; page: number } }>(
      API_ENDPOINTS.TRANSACTIONS.GIN.ALL, 
      {
        params: { 
          is_paginate: true,
          page: 1,
          size: 50,
          ...params 
        }
      }
    );
    
    if (response.data.status) {
      dispatch(ginFetchSuccess({ ...response.data.data, gin_type: params.gin_type }));
    } else {
      dispatch(ginFetchFailure("Failed to retrieve GIN data"));
    }
  } catch (err: any) {
    dispatch(ginFetchFailure(err.message || "Error fetching GIN data"));
  }
};

/**
 * Update a specific GIN line
 */
export const handleUpdateGinLine = (lineId: number, payload: UpdateGinLinePayload) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setGinFormLoading(true));
    const response = await api.post(`${API_ENDPOINTS.TRANSACTIONS.GIN.UPDATE_LINE}?line_id=${lineId}`, payload);
    
    if (response.data.status) {
      toast.success(response.data.message || 'Line updated successfully');
      return true;
    } else {
      toast.error(response.data.message || 'Failed to update line');
      return false;
    }
  } catch (err: any) {
    toast.error('Network error during line update');
    return false;
  } finally {
    dispatch(setGinFormLoading(false));
  }
};

/**
 * Update line status
 */
export const handleUpdateLineStatus = (lineId: number, status: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.patch(API_ENDPOINTS.TRANSACTIONS.GIN.LINE_STATUS, null, {
      params: { line_id: lineId, status }
    });
    
    if (response.data.status) {
      toast.success('Status updated');
      return true;
    } else {
      toast.error('Failed to update status');
      return false;
    }
  } catch (err: any) {
    toast.error('Error updating status');
    return false;
  }
};

/**
 * Fetch a single GIN line by its own ID
 */
/**
 * Smart selector that picks a GIN from the existing slice data or fetches it if missing (e.g., on refresh)
 */
export const handleSelectGin = (headerId: number, lineId?: number, ginType?: number) => async (dispatch: AppDispatch, getState: () => any) => {
  const { items } = getState().gin;
  
  // If we already have items and one of them matches the header, we can filter locally
  const headerLines = items.filter((l: any) => 
    Number(l.header_id) === Number(headerId) || Number(l.header?.id) === Number(headerId)
  );

  if (headerLines.length > 0 && !lineId) {
    console.log(`[GIN Manager] Found ${headerLines.length} lines locally for Header ID: ${headerId}`);
    dispatch(setCurrentGinHeader(headerLines[0].header));
    dispatch(setCurrentGinLines(headerLines));
    return true;
  }

  if (lineId) {
    const localMatch = headerLines.find((l: any) => Number(l.id) === Number(lineId));
    if (localMatch) {
      dispatch(setCurrentGinHeader(localMatch.header));
      dispatch(setCurrentGinLines([localMatch])); // or headerLines if you want full table
      return true;
    }
  }
  // Fallback: Fetch everything and filter
  try {
    dispatch(ginFetchStart());
    const response = await api.get<{ status: boolean; data: { items: any[] } }>(
      API_ENDPOINTS.TRANSACTIONS.GIN.ALL,
      { params: { gin_type: ginType, is_paginate: false } }
    );
    
    if (response.data.status) {
      const allItems = response.data.data.items || [];
      const matchLines = allItems.filter((l: any) => 
        Number(l.header_id) === Number(headerId) || Number(l.header?.id) === Number(headerId)
      );

      if (matchLines.length > 0) {
        dispatch(setCurrentGinHeader(matchLines[0].header));
        dispatch(setCurrentGinLines(matchLines));
        return true;
      }
      dispatch(ginFetchFailure("Header not found"));
      return false;
    }
  } catch (err) {
    dispatch(ginFetchFailure("Network error"));
    return false;
  }
};

/**
 * Aggregates all lines for a specific Gate Pass across potentially different headers
 */
export const handleSelectByGatePass = (gatePassNumber: string, ginType?: number) => async (dispatch: AppDispatch, getState: () => any) => {
  const { items } = getState().gin;
  
  // Try local filter first from existing items in store
  const matchLines = items.filter((l: any) => 
    (l.gate_pass_number === gatePassNumber) || (l.header?.gate_pass_number === gatePassNumber)
  );

  if (matchLines.length > 0) {
    dispatch(setCurrentGinHeader(matchLines[0].header || matchLines[0]));
    dispatch(setCurrentGinLines(matchLines));
    return true;
  }

  // Fallback: Fetch everything and filter by Gate Pass
  try {
    dispatch(ginFetchStart());
    const response = await api.get<{ status: boolean; data: { items: any[] } }>(
      API_ENDPOINTS.TRANSACTIONS.GIN.ALL,
      { params: { gin_type: ginType, is_paginate: false } }
    );
    
    if (response.data.status) {
      const allItems = response.data.data.items || [];
      const filteredLines = allItems.filter((l: any) => 
        (l.gate_pass_number === gatePassNumber) || (l.header?.gate_pass_number === gatePassNumber)
      );

      if (filteredLines.length > 0) {
        dispatch(setCurrentGinHeader(filteredLines[0].header || filteredLines[0]));
        dispatch(setCurrentGinLines(filteredLines));
        return true;
      }
      dispatch(ginFetchFailure("Gate Pass not found"));
      return false;
    }
  } catch (err) {
    dispatch(ginFetchFailure("Network error"));
    return false;
  }
};

/**
 * Robust fetcher that gets the latest list and matches the specific line
 */
export const handleFetchGinLine = (headerId: number, lineId: number, ginType?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(ginFetchStart());
    
    // Fetch from the ALL list to ensure we have the data the table uses
    const response = await api.get<{ status: boolean; data: { items: any[] } }>(
      API_ENDPOINTS.TRANSACTIONS.GIN.ALL,
      { 
        params: { 
          gin_type: ginType,
          is_paginate: false 
        } 
      }
    );
    
    if (response.data.status) {
      const allLines = response.data.data.items || [];
      const targetLine = allLines.find((l: any) => Number(l.id) === Number(lineId));

      if (targetLine) {
        const headerData = targetLine.header || {
          id: targetLine.header_id,
          gate_pass_number: targetLine.gate_pass_number,
          grpo_docentry: targetLine.grpo_docentry,
          card_code: targetLine.card_code,
          card_name: targetLine.card_name,
          sync_date: targetLine.sync_date,
          sync_status: targetLine.sync_status
        };

        dispatch(setCurrentGinHeader(headerData));
        dispatch(setCurrentGinLines([targetLine]));
        return true;
      } else {
        dispatch(ginFetchFailure("Transaction details not found in the list"));
        return false;
      }
    } else {
      dispatch(ginFetchFailure("Failed to retrieve transaction data"));
      return false;
    }
  } catch (err: any) {
    console.error("[GIN Manager] Fetch Error:", err);
    dispatch(ginFetchFailure("Error connecting to server"));
    return false;
  }
};

/**
 * Fetch lines for a specific GIN header
 */
export const handleFetchGinLines = (ginId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(ginFetchStart());
    const response = await api.get<{ status: boolean; data: any }>(
      `${API_ENDPOINTS.TRANSACTIONS.GIN.GET_BY_ID}?gin_id=${ginId}`
    );
    
    if (response.data.status) {
      // The API returns an object with 'items' containing the lines
      const items = response.data.data.items || [];
      dispatch(setCurrentGinLines(items));
      
      // If we have at least one line, set the header from the first line for consistency
      if (items.length > 0) {
        dispatch(setCurrentGinHeader(items[0].header));
      }
    } else {
      dispatch(ginFetchFailure("Failed to retrieve lines"));
    }
  } catch (err: any) {
    dispatch(ginFetchFailure(err.message || "Error fetching lines"));
  }
};

/**
 * Fetch a single GIN header by ID
 */
export const handleFetchGinHeader = (ginId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(ginFetchStart());
    const response = await api.get<{ status: boolean; data: GinHeaderDTO }>(
      `${API_ENDPOINTS.TRANSACTIONS.GIN.GET_BY_ID}?gin_id=${ginId}`
    );
    
    if (response.data.status) {
      dispatch(setCurrentGinHeader(response.data.data));
    } else {
      toast.error("Failed to fetch GIN header");
    }
  } catch (err: any) {
    toast.error("Error fetching GIN details");
  } finally {
    dispatch(setGinFormLoading(false));
  }
};

/**
 * Delete a GIN Header
 */
export const handleDeleteGinHeader = (headerId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.delete(API_ENDPOINTS.TRANSACTIONS.GIN.DELETE_HEADER, {
      params: { header_id: headerId }
    });

    if (response.data.status) {
      toast.success('GIN Header deleted');
      return true;
    } else {
      toast.error('Failed to delete header');
      return false;
    }
  } catch (err: any) {
    toast.error('Network error during deletion');
    return false;
  }
};

/**
 * Delete a specific line
 */
export const handleDeleteGinLine = (lineId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.delete(API_ENDPOINTS.TRANSACTIONS.GIN.DELETE_LINE, {
      params: { line_id: lineId }
    });

    if (response.data.status) {
      toast.success('Line deleted');
      return true;
    } else {
      toast.error('Failed to delete line');
      return false;
    }
  } catch (err: any) {
    toast.error('Error deleting line');
    return false;
  }
};

/**
 * Update a GIN header
 */
export const handleUpdateGinHeader = (ginId: number, data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setGinFormLoading(true));
    const response = await api.post<{ status: boolean; message: string }>(
      API_ENDPOINTS.TRANSACTIONS.GIN.UPDATE_HEADER,
      { ...data, gin_id: ginId }
    );
    
    if (response.data.status) {
      toast.success(response.data.message || "Header updated successfully");
      return true;
    } else {
      toast.error(response.data.message || "Failed to update header");
      return false;
    }
  } catch (err: any) {
    toast.error("Error updating header");
    return false;
  } finally {
    dispatch(setGinFormLoading(false));
  }
};

/**
 * Create a new GIN (Header + optional initial lines)
 */
export const handleCreateGinHeader = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setGinFormLoading(true));
    const response = await api.post<{ status: boolean; message: string }>(
      API_ENDPOINTS.TRANSACTIONS.GIN.CREATE,
      data
    );
    
    if (response.data.status) {
      toast.success(response.data.message || "GIN created successfully");
      return true;
    } else {
      toast.error(response.data.message || "Failed to create GIN");
      return false;
    }
  } catch (err: any) {
    toast.error("Error creating GIN");
    return false;
  } finally {
    dispatch(setGinFormLoading(false));
  }
};
/**
 * Add a single line to an existing GIN header
 */
export const handleAddGinLine = (headerId: number, data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setGinFormLoading(true));
    // Assume endpoint for adding line is gin/create_line/ or similar
    const response = await api.post<{ status: boolean; message: string }>(
      'gin/create_line/',
      { ...data, header_id: headerId }
    );
    
    if (response.data.status) {
      toast.success(response.data.message || "Line added successfully");
      return true;
    } else {
      toast.error(response.data.message || "Failed to add line");
      return false;
    }
  } catch (err: any) {
    toast.error("Error adding line");
    return false;
  } finally {
    dispatch(setGinFormLoading(false));
  }
};

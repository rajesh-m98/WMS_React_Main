import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  itemLoadStart, itemLoadSuccess, itemLoadFailure 
} from '../store/itemSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { ItemDTO } from '@/core/models/master.model';

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  companyid?: number;
  warehouseid?: number;
}

export const handleFetchAllItems = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(itemLoadStart());
    
    const queryParams = new URLSearchParams({
      is_paginate: 'true',
      companyid: (params?.companyid || 1).toString(),
      page: (params?.page || 1).toString(),
      size: (params?.size || 15).toString(),
    });
    
    if (params?.warehouseid) {
      queryParams.append('warehouseid', params.warehouseid.toString());
    }
    
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    const response = await api.get(`${API_ENDPOINTS.MASTERS.ITEMS.ALL}?${queryParams.toString()}`);
    
    if (response.data.status) {
      dispatch(itemLoadSuccess({
        data: response.data.data.items || [],
        total: response.data.data.total || 0
      }));
      return true;
    } else {
      dispatch(itemLoadFailure(response.data.message || "Failed to retrieve items"));
      return false;
    }
  } catch (err: any) {
    dispatch(itemLoadFailure(err.message || "Error fetching item data"));
    return false;
  }
};

export const handleCreateItem = (itemData: Partial<ItemDTO>, productId: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(itemLoadStart());
    const response = await api.post(`${API_ENDPOINTS.MASTERS.ITEMS.CREATE}?product_id=${productId}`, itemData);
    if (response.data.status) {
      return true;
    } else {
      dispatch(itemLoadFailure(response.data.message || "Failed to process item"));
      return false;
    }
  } catch (err: any) {
    dispatch(itemLoadFailure(err.message || "Error processing item"));
    return false;
  }
};

export const handleDeleteItem = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(itemLoadStart());
    const response = await api.delete(`${API_ENDPOINTS.MASTERS.ITEMS.DELETE}?product_id=${id}`);
    if (response.data.status) {
      return true;
    } else {
      dispatch(itemLoadFailure(response.data.message || "Failed to delete item"));
      return false;
    }
  } catch (err: any) {
    dispatch(itemLoadFailure(err.message || "Error deleting item"));
    return false;
  }
};

export const handleRefreshItems = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(itemLoadStart());
    const response = await api.get(API_ENDPOINTS.MASTERS.ITEMS.REFRESH);
    if (response.data.status) {
      return true;
    } else {
      dispatch(itemLoadFailure(response.data.message || "Failed to refresh items"));
      return false;
    }
  } catch (err: any) {
    dispatch(itemLoadFailure(err.message || "Error refreshing items"));
    return false;
  }
};

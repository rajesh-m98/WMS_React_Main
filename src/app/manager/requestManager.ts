import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  requestLoadStart, inwardLoadSuccess, outwardLoadSuccess, requestLoadFailure 
} from '../store/requestSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export const handleFetchInwardRequests = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(requestLoadStart('inward'));
    
    const requestBody = {
      page: params?.page || 1,
      pageSize: params?.size || 10,
      is_paginate: true,
      search: params?.search || "",
      from_date: params?.from_date || "",
      to_date: params?.to_date || "",
    };

    const response = await api.post(API_ENDPOINTS.TRANSACTIONS.INWARD.GET_ALL, requestBody);

    if (response.data.status) {
      dispatch(inwardLoadSuccess({ 
        data: response.data.data.items || [], 
        total: response.data.data.totalCount || 0 
      }));
    } else {
      dispatch(requestLoadFailure({ type: 'inward', error: "Failed to retrieve inward requests" }));
    }
  } catch (err: any) {
    dispatch(requestLoadFailure({ 
      type: 'inward', 
      error: err.response?.data?.message || err.message || "Error fetching inward data" 
    }));
  }
};

export const handleFetchOutwardRequests = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(requestLoadStart('outward'));
    
    const requestBody = {
      page: params?.page || 1,
      pageSize: params?.size || 10,
      is_paginate: true,
      search: params?.search || "",
      from_date: params?.from_date || "",
      to_date: params?.to_date || "",
    };

    const response = await api.post(API_ENDPOINTS.TRANSACTIONS.OUTWARD.GET_ALL, requestBody);

    if (response.data.status) {
      dispatch(outwardLoadSuccess({ 
        data: response.data.data.items || [], 
        total: response.data.data.totalCount || 0 
      }));
    } else {
      dispatch(requestLoadFailure({ type: 'outward', error: "Failed to retrieve outward requests" }));
    }
  } catch (err: any) {
    dispatch(requestLoadFailure({ 
      type: 'outward', 
      error: err.response?.data?.message || err.message || "Error fetching outward data" 
    }));
  }
};

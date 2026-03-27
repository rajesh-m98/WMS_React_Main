import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  dispatchLoadStart, 
  dispatchLoadSuccess, 
  dispatchLoadFailure 
} from '../store/dispatchSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export const handleFetchDispatchHistory = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(dispatchLoadStart());
    
    const requestBody = {
      page: params?.page || 1,
      pageSize: params?.size || 15,
      is_paginate: true,
      search: params?.search || "",
      from_date: params?.from_date || "",
      to_date: params?.to_date || "",
    };

    const response = await api.post(API_ENDPOINTS.TRANSACTIONS.DISPATCH.GET_HISTORY, requestBody);

    if (response.data.status) {
      dispatch(dispatchLoadSuccess({ 
        data: response.data.data.items || [], 
        total: response.data.data.totalCount || 0 
      }));
    } else {
      dispatch(dispatchLoadFailure(response.data.message || "Failed to retrieve Dispatch History"));
    }
  } catch (err: any) {
    dispatch(dispatchLoadFailure(
      err.response?.data?.message || err.message || "Error fetching Dispatch History"
    ));
  }
};

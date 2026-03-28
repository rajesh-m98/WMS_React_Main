import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  dispatchLoadStart, 
  dispatchLoadSuccess, 
  dispatchDetailSuccess,
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
    
    const queryParams = {
      page: params?.page || 1,
      size: params?.size || 15,
      is_paginate: true,
      search: params?.search || "",
    };

    const response = await api.get(API_ENDPOINTS.TRANSACTIONS.DISPATCH.GET_HISTORY, { params: queryParams });

    if (response.data.status) {
      dispatch(dispatchLoadSuccess({ 
        data: response.data.data.items || [], 
        total: response.data.data.total || 0 
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

export const handleFetchDispatchDetail = (dispatchId: string | number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(dispatchLoadStart());
    
    const response = await api.get(API_ENDPOINTS.TRANSACTIONS.DISPATCH.GET_DETAIL, { 
      params: { dispatch_id: dispatchId } 
    });

    if (response.data.status) {
      dispatch(dispatchDetailSuccess(response.data.data));
    } else {
      dispatch(dispatchLoadFailure(response.data.message || "Failed to retrieve Dispatch Detail"));
    }
  } catch (err: any) {
    dispatch(dispatchLoadFailure(
      err.response?.data?.message || err.message || "Error fetching Dispatch Detail"
    ));
  }
};

import api from '@/lib/api';
import { AppDispatch } from '../store';
import {
  dispatchLoadStart,
  dispatchLoadSuccess,
  dispatchDetailSuccess,
  dispatchLoadFailure,
  setDispatchFilters,
} from '../store/dispatchSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

interface FetchParams {
  page?: number;
  size?: number;
  whscode?: string;
  carton_barcode?: string;
  search?: string;
  is_paginate?: boolean;
}

export const handleFetchDispatchHistory = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(dispatchLoadStart());

    const queryParams = new URLSearchParams({
      is_paginate: (params?.is_paginate ?? true).toString(),
      page: (params?.page || 1).toString(),
      size: (params?.size || 50).toString(),
    });

    if (params?.whscode) {
      queryParams.append('whscode', params.whscode);
    }
    if (params?.carton_barcode) {
      queryParams.append('carton_barcode', params.carton_barcode);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const response = await api.get(`${API_ENDPOINTS.TRANSACTIONS.DISPATCH.GET_HISTORY}?${queryParams.toString()}`);

    if (response.data.status || response.status === 200) {
      const respData = response.data.data;
      // Handle different response structures if necessary
      const items = Array.isArray(respData) ? respData : (respData.items || []);
      const total = respData.total || items.length;
      
      dispatch(dispatchLoadSuccess({
        data: items,
        total: total
      }));
      return true;
    } else {
      dispatch(dispatchLoadFailure(response.data.message || "Failed to retrieve dispatch history"));
      return false;
    }
  } catch (err: any) {
    dispatch(dispatchLoadFailure(err.message || "Error fetching dispatch history"));
    return false;
  }
};

export const handleFetchDispatchDetail = (dispatchId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(dispatchLoadStart());

    const response = await api.get(`${API_ENDPOINTS.TRANSACTIONS.DISPATCH.GET_DETAIL}?dispatch_id=${dispatchId}`);

    if (response.data.status || response.status === 200) {
      dispatch(dispatchDetailSuccess(response.data.data));
      return true;
    } else {
      dispatch(dispatchLoadFailure(response.data.message || "Failed to retrieve dispatch details"));
      return false;
    }
  } catch (err: any) {
    dispatch(dispatchLoadFailure(err.message || "Error fetching dispatch details"));
    return false;
  }
};

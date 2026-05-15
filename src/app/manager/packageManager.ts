import api from '@/lib/api';
import { AppDispatch } from '../store';
import {
  packageLoadStart, packageLoadSuccess, packageLoadFailure
} from '../store/packageSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { CreatePackagePayload } from '@/core/models/master.model';

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  is_paginate?: boolean;
}

export const handleFetchAllPackages = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());

    const queryParams = new URLSearchParams({
      is_paginate: (params?.is_paginate ?? true).toString(),
      page: (params?.page || 1).toString(),
      size: (params?.size || 10).toString(),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const response = await api.get(`${API_ENDPOINTS.MASTERS.PACKAGING.ALL}?${queryParams.toString()}`);

    if (response.data.status) {
      const respData = response.data.data;
      dispatch(packageLoadSuccess({
        data: respData.items || [],
        total: respData.total || 0
      }));
      return true;
    } else {
      dispatch(packageLoadFailure(response.data.message || "Failed to retrieve packages"));
      return false;
    }
  } catch (err: any) {
    dispatch(packageLoadFailure(err.message || "Error fetching package data"));
    return false;
  }
};

export const handleCreatePackage = (packageData: CreatePackagePayload) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());
    const url = API_ENDPOINTS.MASTERS.PACKAGING.CREATE;

    const response = await api.post(url, packageData);
    if (response.data.status || response.status === 200) {
      return true;
    } else {
      dispatch(packageLoadFailure(response.data.message || "Failed to create package"));
      return false;
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail?.[0]?.msg || err.message || "Error creating package";
    dispatch(packageLoadFailure(errorMsg));
    return false;
  }
};

export const handleDeletePackage = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());
    const response = await api.delete(`${API_ENDPOINTS.MASTERS.PACKAGING.DELETE}?packaging_id=${id}`);
    if (response.data.status) {
      return true;
    } else {
      dispatch(packageLoadFailure(response.data.message || "Failed to delete package"));
      return false;
    }
  } catch (err: any) {
    dispatch(packageLoadFailure(err.message || "Error deleting package"));
    return false;
  }
};

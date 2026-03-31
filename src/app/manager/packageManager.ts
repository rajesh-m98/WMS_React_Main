import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  packageLoadStart, packageLoadSuccess, packageLoadFailure
} from '../store/masterSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { PackageDTO } from '@/core/models/master.model';

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  companyid?: number;
}

export const handleFetchAllPackages = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());
    
    const queryParams = new URLSearchParams({
      is_paginate: 'true',
      companyid: (params?.companyid || 1).toString(),
      page: (params?.page || 1).toString(),
      size: (params?.size || 15).toString(),
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
    dispatch(packageLoadFailure(err.message || "Error fetching packaging data"));
    return false;
  }
};

export const handleCreatePackage = (packageData: Partial<PackageDTO>, editId?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());
    const url = editId 
      ? `${API_ENDPOINTS.MASTERS.PACKAGING.CREATE}?package_id=${editId}`
      : API_ENDPOINTS.MASTERS.PACKAGING.CREATE;

    const response = await api.post(url, packageData);
    if (response.data.status) {
      return true;
    } else {
      dispatch(packageLoadFailure(response.data.message || (editId ? "Failed to update package" : "Failed to create package")));
      return false;
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail?.[0]?.msg || err.message || (editId ? "Error updating package" : "Error creating package");
    dispatch(packageLoadFailure(errorMsg));
    return false;
  }
};

export const handleDeletePackage = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());
    const response = await api.delete(`${API_ENDPOINTS.MASTERS.PACKAGING.DELETE}?package_id=${id}`);
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

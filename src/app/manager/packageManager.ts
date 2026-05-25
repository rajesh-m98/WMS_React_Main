import api from '@/lib/api';
import axios from 'axios';
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

    const isPaginated = params?.is_paginate ?? true;
    const queryParams = new URLSearchParams({
      is_paginate: isPaginated.toString(),
      page: (params?.page || 1).toString(),
      size: (isPaginated ? (params?.size || 10) : 100).toString(),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    // Call the SAP URL directly for all packagings
    const response = await axios.get<{ status: boolean; data: any }>(
      `${SAP_BASE_URL}/packaging/get_all_packagings?${queryParams.toString()}`
    );

    if (response.data.status) {
      const rawData = isPaginated
        ? response.data.data.items
        : (Array.isArray(response.data.data) ? response.data.data : response.data.data.items || []);

      const mappedData = rawData.map((pkg: any) => ({
        ...pkg,
        package_code: pkg.barcode, // Map barcode to package_code
        package_type_name: pkg.package_type === 2 ? "Warehouse" : "Standard", // Map numeric type to name
        status: pkg.status === 1 ? "Active" : "Inactive" // Map 1 to Active
      }));

      dispatch(packageLoadSuccess({
        data: mappedData,
        total: isPaginated ? (response.data.data.total || response.data.data.totalCount || mappedData.length) : mappedData.length
      }));
      return true;
    } else {
      dispatch(packageLoadFailure(response.data.data || "Failed to retrieve packages"));
      return false;
    }
  } catch (err: any) {
    dispatch(packageLoadFailure(err.message || "Error fetching package data"));
    return false;
  }
};

export const handleCreatePackage = (packageData: any, editId?: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());
    const url = editId
      ? `${API_ENDPOINTS.MASTERS.PACKAGING.CREATE}?packaging_id=${editId}`
      : API_ENDPOINTS.MASTERS.PACKAGING.CREATE;

    // Map UI fields to backend fields if necessary
    const mappedData = {
      name: packageData.package_type_name || packageData.name,
      barcode: packageData.package_code || packageData.barcode,
      package_type: packageData.package_type || 1,
      warehouse_id: packageData.warehouse_id,
      whscode: packageData.whscode,
      status: packageData.status === "Active" ? 1 : (packageData.status ?? 1),
      description: packageData.description
    };

    const response = await api.post(url, mappedData);
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

const SAP_BASE_URL = 'http://115.244.101.29:9096/api/v1';

export const handleGenerateBarcodes = (data: { package_type: number; warehouse_id: number; whscode: string; quntity: number }) => async (dispatch: AppDispatch) => {
  try {
    dispatch(packageLoadStart());

    // Use SAP URL directly for barcode generation
    const response = await axios.post(`${SAP_BASE_URL}/packaging/generate-barcode`, {
      packageType: data.package_type,
      warehouseId: data.warehouse_id,
      whscode: data.whscode,
      quntity: data.quntity,
    });

    if (response.data.status || response.status === 200) {
      // The API returns an array of barcodes in response.data.data
      return response.data.data;
    } else {
      dispatch(packageLoadFailure(response.data.message || "Failed to generate barcodes"));
      return null;
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail?.[0]?.msg || err.message || "Error generating barcodes";
    dispatch(packageLoadFailure(errorMsg));
    return null;
  }
};


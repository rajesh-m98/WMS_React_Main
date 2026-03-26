import api from '@/lib/api';
import { AppDispatch } from '../store';
import { 
  userLoadStart, userLoadSuccess, userDetailSuccess, userLoadFailure,
  clearCurrentUser
} from '../store/masterSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';
import { UserDTO, HSTDeviceDTO } from '@/core/models/master.model';

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  companyid?: number;
}

interface PaginatedResponse<T> {
  status: boolean;
  data: {
    items: T[];
    totalCount: number;
  };
}

export const handleFetchUsers = (params?: FetchParams) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userLoadStart());
    
    const queryParams = new URLSearchParams({
      companyid: (params?.companyid || 1).toString(),
    });
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    // Some endpoints use is_paginate for totalCount and items structure
    queryParams.append('is_paginate', 'true');

    const response = await api.get<{ status: boolean; data: { items: UserDTO[]; total: number } | UserDTO[] }>(
      `${API_ENDPOINTS.MASTERS.USERS}?${queryParams.toString()}`
    );

    if (response.data.status) {
      if (Array.isArray(response.data.data)) {
        dispatch(userLoadSuccess({ data: response.data.data }));
      } else {
        dispatch(userLoadSuccess({ 
          data: response.data.data.items, 
          total: response.data.data.total 
        }));
      }
    } else {
      dispatch(userLoadFailure("Failed to retrieve users"));
    }
  } catch (err: any) {
    dispatch(userLoadFailure(err.message || "Error fetching user data"));
  }
};

export const handleFetchUserById = (userId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userLoadStart());
    const response = await api.get<{ status: boolean; data: UserDTO }>(`${API_ENDPOINTS.MASTERS.USER_BY_ID}?user_id=${userId}`);
    if (response.data.status) {
      dispatch(userDetailSuccess(response.data.data));
    } else {
      dispatch(userLoadFailure("Failed to retrieve user details"));
    }
  } catch (err: any) {
    dispatch(userLoadFailure(err.message || "Error fetching user details"));
  }
};



export const handleCreateUser = (userData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userLoadStart());
    const response = await api.post(`${API_ENDPOINTS.MASTERS.CREATE_USER}?user_id=1`, userData);
    if (response.data.status) {
      // Refresh user list
      dispatch(handleFetchUsers({ companyid: 1 }));
      return true;
    } else {
      dispatch(userLoadFailure(response.data.message || "Failed to create user"));
      return false;
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.detail?.[0]?.msg || err.message || "Error creating user";
    dispatch(userLoadFailure(errorMsg));
    return false;
  }
};

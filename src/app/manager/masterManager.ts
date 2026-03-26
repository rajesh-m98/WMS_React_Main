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

export const handleFetchUsers = (companyid: number = 1) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userLoadStart());
    const response = await api.get<{ status: boolean; data: UserDTO[] }>(`${API_ENDPOINTS.MASTERS.USERS}?companyid=${companyid}`);
    if (response.data.status) {
      dispatch(userLoadSuccess(response.data.data || []));
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
      dispatch(handleFetchUsers(1));
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

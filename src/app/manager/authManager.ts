import api from '@/lib/api';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '../store/index';
import { loginStart, loginSuccess, loginFailure, UserData } from '../store/authSlice';
import { API_ENDPOINTS } from '@/core/config/endpoints';

export const handleLoginSubmit = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const { username, password } = state.auth.loginForm;

  if (!username || !password) {
    const errorMsg = "Credentials cannot be empty";
    dispatch(loginFailure(errorMsg));
    toast.error(errorMsg);
    return false;
  }

  try {
    dispatch(loginStart());

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.status) {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;

      // Temporary mock user data until full user profile endpoint is used
      const mockUserData: UserData = {
        id: 1,
        email_id: 'admin@wms.com',
        role: 'ADMIN',
        username: username,
        warehouse_id: 1,
        userid: '',
        status: '',
        companyid: 0,
        mobile_number: ''
      };

      localStorage.setItem('token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      localStorage.setItem('userData', JSON.stringify(mockUserData));

      dispatch(loginSuccess({ access_token, refresh_token, userData: mockUserData }));
      toast.success(response.data.message || 'Authentication successful');
      return true;
    } else {
      const errorMsg = response.data.message || 'Login failed';
      dispatch(loginFailure(errorMsg));
      toast.error(errorMsg);
      return false;
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Server error during login';
    dispatch(loginFailure(errorMsg));
    toast.error(errorMsg);
    return false;
  }
};

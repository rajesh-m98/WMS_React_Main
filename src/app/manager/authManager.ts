import api from '@/lib/api';
import { toast } from 'sonner';
import { AppDispatch, RootState } from '../store/index';
import { loginStart, setSignIn, loginFailure } from '../store/authSlice';
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

    let response;
    try {
      // 1. Try sending as JSON (expected by the .NET backend)
      const payload = {
        username: username,
        password: password,
      };
      response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (jsonErr: any) {
      // 2. If it fails with 422 Unprocessable Entity (FastAPI validation error), retry as URL encoded form
      if (jsonErr.response?.status === 422) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        response = await api.post(API_ENDPOINTS.AUTH.LOGIN, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      } else {
        throw jsonErr;
      }
    }

    if (response && response.data) {
      // Standardize the response status and token structure to support both backend types
      const status = response.data.status ?? (response.status === 200);

      if (status) {
        const accessToken = response.data.accessToken || response.data.access_token || response.data.token;
        const refreshToken = response.data.refreshToken || response.data.refresh_token;
        const userData = response.data.data || response.data.userData || {};

        if (!accessToken) {
          throw new Error("No token received from backend");
        }

        dispatch(setSignIn({
          accessToken: accessToken,
          refreshToken: refreshToken || undefined,
          userData: userData
        }));

        toast.success(response.data.message || 'Authentication successful');
        return true;
      } else {
        const errorMsg = response.data.message || 'Login failed';
        dispatch(loginFailure(errorMsg));
        toast.error(errorMsg);
        return false;
      }
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.response?.data?.detail?.[0]?.msg || err.message || 'Server error during login';
    dispatch(loginFailure(errorMsg));
    toast.error(errorMsg);
    return false;
  }
};

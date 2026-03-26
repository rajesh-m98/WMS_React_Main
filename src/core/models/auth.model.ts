import { UserDTO } from "./master.model";

export interface LoginResponse {
  status: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  data: UserDTO;
}

export interface AuthState {
  user: UserDTO | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

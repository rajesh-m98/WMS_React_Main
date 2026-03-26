export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
  access_token?: string;
  refresh_token?: string;
  total_count?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  companyid?: number;
  warehouse_id?: number;
}

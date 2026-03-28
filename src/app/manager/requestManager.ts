import api from "@/lib/api";
import { AppDispatch, RootState } from "../store";
import {
  requestLoadStart,
  inwardLoadSuccess,
  outwardLoadSuccess,
  unifiedRequestSuccess,
  requestLoadFailure,
} from "../store/requestSlice";
import { API_ENDPOINTS } from "@/core/config/endpoints";

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  forceRefresh?: boolean;
}

/**
 * Unified request fetcher that hits API once and updates both buckets.
 */
const fetchUnifiedRequests = async (
  dispatch: AppDispatch,
  getState: () => RootState,
  params?: FetchParams,
) => {
  const { lastFetched, inward, outward } = getState().request;

  // Deduplicate concurrent requests
  if (inward.loading || outward.loading) {
    console.log("Request fetch already in progress, skipping...");
    return true;
  }

  if (lastFetched && !params?.forceRefresh) {
    console.log("Using cached requests...");
    return true;
  }

  try {
    dispatch(requestLoadStart("all"));

    const queryParams = new URLSearchParams({
      is_paginate: (params?.size !== undefined).toString(),
      page: (params?.page || 1).toString(),
      size: (params?.size || 100).toString(),
    });

    const response = await api.get(
      `${API_ENDPOINTS.TRANSACTIONS.PUTAWAY.GET_ALL}?${queryParams.toString()}`,
    );

    if (response.data.status) {
      const allItems = response.data.data.items || [];
      // Only items that are NOT status 3 (Completed) are "Requests"
      const inward = allItems.filter(
        (i: any) => i.putaway_type === 1 && i.status !== 3,
      );
      const outward = allItems.filter(
        (i: any) => i.putaway_type === 2 && i.status !== 3,
      );

      dispatch(unifiedRequestSuccess({ inward, outward }));
      return true;
    } else {
      dispatch(
        requestLoadFailure({
          type: "all",
          error: "Failed to retrieve unified requests",
        }),
      );
      return false;
    }
  } catch (err: any) {
    dispatch(
      requestLoadFailure({
        type: "all",
        error:
          err.response?.data?.message || err.message || "Error fetching requests",
      }),
    );
    return false;
  }
};

export const handleFetchInwardRequests =
  (params?: FetchParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    return fetchUnifiedRequests(dispatch, getState, params);
  };

export const handleFetchOutwardRequests =
  (params?: FetchParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    return fetchUnifiedRequests(dispatch, getState, params);
  };

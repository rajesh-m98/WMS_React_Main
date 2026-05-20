import api from "@/lib/api";
import { AppDispatch, RootState } from "../store";
import {
  requestLoadStart,
  inwardLoadSuccess,
  outwardLoadSuccess,
  onwardLoadSuccess,
  sortingLoadSuccess,
  manualLoadSuccess,
  unifiedRequestSuccess,
  requestLoadFailure,
} from "../store/requestSlice";
import { API_ENDPOINTS } from "@/core/config/endpoints";

interface FetchParams {
  page?: number;
  size?: number;
  search?: string;
  doc_entry?: string;
  is_paginate?: boolean;
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
    try {
      dispatch(requestLoadStart("outward"));

      const queryParams = new URLSearchParams({
        is_paginate: "true",
        page: (params?.page || 1).toString(),
        size: (params?.size || 50).toString(),
      });

      const response = await api.get(
        `${API_ENDPOINTS.TRANSACTIONS.OUTWARD.GET_ALL}?${queryParams.toString()}`,
      );

      if (response.data.status) {
        dispatch(
          outwardLoadSuccess({
            data: response.data.data.items || [],
            total: response.data.data.total,
          }),
        );
        return true;
      } else {
        dispatch(
          requestLoadFailure({
            type: "outward",
            error: response.data.message || "Failed to fetch outward requests",
          }),
        );
        return false;
      }
    } catch (err: any) {
      dispatch(
        requestLoadFailure({
          type: "outward",
          error: err.message || "Error fetching outward requests",
        }),
      );
      return false;
    }
  };

export const handleFetchOnwardPicklist =
  () =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(requestLoadStart("onward"));

      const response = await api.get(
        API_ENDPOINTS.TRANSACTIONS.OUTWARD.GET_ONWARD_PICKLIST
      );

      if (response.data.status) {
        const rawData = response.data.data;
        const dataArray = Array.isArray(rawData)
          ? rawData
          : (rawData && Array.isArray(rawData.items))
          ? rawData.items
          : [];
        dispatch(
          onwardLoadSuccess({
            data: dataArray,
            total: dataArray.length,
          }),
        );
        return true;
      } else {
        dispatch(
          requestLoadFailure({
            type: "onward",
            error: response.data.message || "Failed to fetch onward picklist",
          }),
        );
        return false;
      }
    } catch (err: any) {
      dispatch(
        requestLoadFailure({
          type: "onward",
          error: err.message || "Error fetching onward picklist",
        }),
      );
      return false;
    }
  };

export const handleGeneratePicklist =
  (docEntry: number) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.post(API_ENDPOINTS.TRANSACTIONS.OUTWARD.GENERATE, {
        doc_entry: docEntry
      });
      return response.data.status;
    } catch (err) {
      console.error("Error generating picklist:", err);
      return false;
    }
  };

export const handleGenerateManualPicklist =
  (payload: { doc_entry: string; item_code: string[] }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(requestLoadStart("manual"));

      const response = await api.post(
        API_ENDPOINTS.TRANSACTIONS.OUTWARD.GET_MANUAL_PICKLIST,
        payload
      );

      if (response.data.status) {
        dispatch(manualLoadSuccess(response.data.data || []));
        return true;
      } else {
        dispatch(
          requestLoadFailure({
            type: "manual",
            error: response.data.message || "Failed to generate manual picklist",
          })
        );
        return false;
      }
    } catch (err: any) {
      dispatch(
        requestLoadFailure({
          type: "manual",
          error: err.message || "Error generating manual picklist",
        })
      );
      return false;
    }
  };

export const handleFetchSorting =
  (params?: FetchParams) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(requestLoadStart("sorting"));

      const queryParams = new URLSearchParams({
        is_paginate: (params?.is_paginate ?? true).toString(),
        page: (params?.page || 1).toString(),
        size: (params?.size || 50).toString(),
      });

      if (params?.doc_entry) queryParams.append("doc_entry", params.doc_entry);

      const response = await api.get(
        `${API_ENDPOINTS.TRANSACTIONS.OUTWARD.GET_ALL_SORTING}?${queryParams.toString()}`
      );

      if (response.data.status) {
        const data = response.data.data.items || response.data.data || [];
        const total = response.data.data.total || data.length;
        
        dispatch(
          sortingLoadSuccess({
            data,
            total,
          })
        );
        return true;
      } else {
        dispatch(
          requestLoadFailure({
            type: "sorting",
            error: response.data.message || "Failed to fetch sorting data",
          })
        );
        return false;
      }
    } catch (err: any) {
      dispatch(
        requestLoadFailure({
          type: "sorting",
          error: err.message || "Error fetching sorting data",
        })
      );
      return false;
    }
  };

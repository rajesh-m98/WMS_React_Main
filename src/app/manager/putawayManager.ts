import api from "@/lib/api";
import { AppDispatch, RootState } from "../store";
import {
  putawayLoadStart,
  putawayLoadSuccess,
  unifiedPutawaySuccess,
  putawayDetailSuccess,
  putawayLoadFailure,
  clearPutawayDetail,
} from "../store/putawaySlice";
import { API_ENDPOINTS } from "@/core/config/endpoints";

interface PutawayParams {
  page?: number;
  size?: number;
  is_paginate?: boolean;
  forceRefresh?: boolean;
}

/**
 * Fetches putaway history and updates both Inward and Outward nodes.
 * Optimized to hit API only once and update both slices.
 */
export const handleFetchPutawayHistory =
  (type: "inward" | "outward", params?: PutawayParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { lastFetched, inward, outward } = getState().putaway;

    // Deduplicate concurrent requests
    if (inward.loading || outward.loading) {
      console.log("Putaway fetch already in progress, skipping duplicate...");
      return true;
    }

    // If we've already fetched the unified result, don't hit it again unless forced
    if (lastFetched && !params?.forceRefresh) {
      console.log("Using cached putaway history...");
      return true;
    }

    try {
      // Start global load for both
      dispatch(putawayLoadStart("all"));

      const queryParams = new URLSearchParams({
        is_paginate: (params?.is_paginate !== false).toString(),
        page: (params?.page || 1).toString(),
        size: (params?.size || 50).toString(),
      });

      const response = await api.get<{ status: boolean; data: any }>(
        `${API_ENDPOINTS.TRANSACTIONS.PUTAWAY.GET_ALL}?${queryParams.toString()}`,
      );

      if (response.data.status) {
        const allItems = response.data.data.items || [];
        const total = response.data.data.total || allItems.length;

        // Distribute to inward/outward buckets
        const inwardArr = allItems.filter((i: any) => i.putaway_type === 1);
        const outwardArr = allItems.filter((i: any) => i.putaway_type === 2);

        // Update BOTH freshly with totals
        dispatch(unifiedPutawaySuccess({ 
          inward: inwardArr, 
          outward: outwardArr,
          totalInward: inwardArr.length,
          totalOutward: outwardArr.length
        }));
        return true;
      } else {
        dispatch(
          putawayLoadFailure({
            type: "all",
            error: "Failed to retrieve unified putaway history",
          }),
        );
        return false;
      }
    } catch (err: any) {
      dispatch(
        putawayLoadFailure({
          type: "all",
          error:
            err.response?.data?.message ||
            err.message ||
            "Error fetching putaway data",
        }),
      );
      return false;
    }
  };

/**
 * Fetches granular detail for a specific putaway transaction.
 */
export const handleFetchPutawayDetail = (putaway_id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(putawayLoadStart('detail'));
    
    const response = await api.get<{ status: boolean; data: any }>(
      `${API_ENDPOINTS.TRANSACTIONS.PUTAWAY.GET_BY_ID}?putaway_id=${putaway_id}`
    );

    if (response.data.status) {
      dispatch(putawayDetailSuccess(response.data.data));
      return response.data.data;
    } else {
      dispatch(putawayLoadFailure({ type: 'detail', error: "Failed to retrieve putaway details" }));
      return null;
    }
  } catch (err: any) {
    dispatch(putawayLoadFailure({ 
      type: 'detail', 
      error: err.response?.data?.message || err.message || "Error fetching putaway details" 
    }));
    return null;
  }
};

export const handleClearCurrentPutaway = () => (dispatch: AppDispatch) => {
  dispatch(clearPutawayDetail());
};

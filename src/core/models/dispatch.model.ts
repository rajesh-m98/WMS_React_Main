export interface DispatchHistoryDTO {
  id: number;
  doc_entry: number;
  line_id: number;
  doc_number: string;
  card_code: string;
  card_name: string;
  doc_date: string;
  carton_barcode: string;
  created_at: string;
  hst_device_id: number;
  hst_device_name?: string;
  created_by_id: number;
  user_name?: string;
  total_qty: number;
  remaining_qty: number;
  filled_qty: number;
  status?: string;
}

export interface DispatchHistoryResponse {
  status: boolean;
  message: string;
  data: {
    items: DispatchHistoryDTO[];
    totalCount: number;
    page: number;
    pageSize: number;
  };
}

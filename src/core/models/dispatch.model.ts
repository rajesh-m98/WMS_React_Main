export interface DispatchHistoryDTO {
  id: number;
  outward_header_id: number | null;
  grpo_doc_entry: string | null;
  doc_entry: string | null;
  line_id: number | null;
  line_no: string | null;
  item_code: string;
  item_name: string;
  qty: number;
  whscode: string;
  whsname: string | null;
  carton_barcode: string;
  status: number | null;
  sync_message: string | null;
  sync_status: string | null;
  sync_date: string | null;
  dispatch_type: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
  // Legacy fields for compatibility if needed
  box_barcode?: string;
  cardname?: string;
  docnum?: string;
}

export interface DispatchHistoryResponse {
  status: boolean;
  message: string;
  data: {
    items: DispatchHistoryDTO[];
    total: number;
    page: number;
    size: number;
    pages: number;
  };
}

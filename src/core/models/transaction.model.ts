export interface GinHeaderDTO {
  id: number;
  warehouse_id: number;
  gate_pass_number: string;
  grpo_docentry: string;
  card_code: string;
  card_name: string;
  status: number | null;
  created_by: string;
  sync_message: string;
  sync_status: string;
  sync_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
}

export interface GinLineDTO {
  id: number;
  header_id: number;
  doc_number: string;
  doc_entry: string;
  line_no: string;
  item_code: string;
  item_desc: string;
  open_qty: number;
  mrp: number;
  line_type: number; // 1 for Flow Through, 2 for Putaway?
  received_qty: number;
  expiry_date: string | null;
  status: number;
  header: GinHeaderDTO;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
}

export interface UpdateGinLinePayload {
  header_id: number;
  doc_number: string;
  doc_entry: string;
  line_no: string;
  item_code: string;
  item_desc: string;
  open_qty: number;
  mrp: number;
  line_type: number;
  received_qty: number;
  expiry_date: string;
  status: number;
}

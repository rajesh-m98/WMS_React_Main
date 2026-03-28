export interface DispatchHistoryDTO {
  id: number;
  box_barcode: string;
  doc_entry: string;
  batch_number: string;
  quantity: number;
  putaway_type: number;
  status: number;
  docnum: string;
  objtype: string;
  cardcode: string;
  cardname: string;
  docdate: string;
  numatcard: string;
  bplid: string;
  branchname: string;
  lineid: string;
  name: string;
  whscode: string;
  sysnumber: string;
  user_id: number;
  device_id: number;
  warehouse_id: number;
  item_code: string;
  item_description: string;
  frgnname: string;
  itmsgrpcod: string;
  manbtchnum: string;
  mansernum: string;
  salunitmsr: string;
  invntryuom: string;
  purunitmsr: string;
  active: string;
  barcode: string;
  current_stock: number;
  layer1: string;
  layer2: string;
  layer3: string;
  layer4: string;
  layer5: string;
  layer6: string | null;
  total_quntity: number;
  remaining_quntity: number;
  filled_quntity: number;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  is_deleted: boolean;
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

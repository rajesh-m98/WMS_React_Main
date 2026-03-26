export interface UserDTO {
  id: number;
  userid: string;
  username: string;
  email_id: string;
  role: number | string;
  status: string;
  warehouse_id: number;
  device_id?: number | string;
  companyid: number;
  mobile_number: string;
  mobile_token?: string;
  permission?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  db_warehouse?: {
    id: number;
    warehouse_name: string;
    warehouse_code: string;
  };
  db_device?: {
    id: number;
    device_type: string;
    device_serial_number: string;
  };
}

export interface HSTDeviceDTO {
  id: number;
  device_name: string;
  mac_address: string;
  status?: string;
}

export interface ItemDTO {
  id: number;
  companyid: number;
  warehouse_id: number;
  item_code: string;
  item_description: string;
  frgnname?: string | null;
  itmsgrpcod?: string | null;
  manbtchnum?: string | null;
  mansernum?: string | null;
  salunitmsr?: string | null;
  invntryuom?: string | null;
  purunitmsr?: string | null;
  active?: string | null;
  barcode?: string | null;
  attribute1?: string | null;
  attribute2?: string | null;
  attribute3?: string | null;
  attribute4?: string | null;
  attribute5?: string | null;
  attribute6?: string | null;
  attribute7?: string | null;
  attribute8?: string | null;
  attribute9?: string | null;
  attribute10?: string | null;
  layer1?: string | null;
  layer2?: string | null;
  layer3?: string | null;
  layer4?: string | null;
  layer5?: string | null;
  layer6?: string | null;
  opening_stock?: number;
  current_stock?: number;
  location_mapping?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WarehouseDTO {
  id: number;
  warehouse_code: string;
  warehouse_name: string;
  location?: string;
}

export interface BinLayerDTO {
  id: number;
  value: string;
  barcode: string;
  layer: number;
  children: BinLayerDTO[];
}

export interface CreateBinPayload {
  companyid: number;
  warehouse_id: number;
  layer1?: string;
  layer2?: string;
  layer3?: string;
  layer4?: string;
  layer5?: string;
  layer6?: string;
  barcode: string;
}

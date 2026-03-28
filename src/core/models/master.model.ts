export interface UserPermissionDTO {
  id: number;
  userid: number;
  operation_type: string;
  operation_pages: string[];
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  is_deleted?: boolean;
}

export interface UserDTO {
  id: number;
  warehouse_id: number;
  userid: string;
  employee_id: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  mobile_number: string;
  department: string;
  role: number | string;
  otp?: string;
  reportingmanager?: string;
  outlet?: number;
  mobile_token?: string;
  status: string;
  db_warehouse?: {
    id: number;
    warehouse_name: string;
    warehouse_code: string;
    gstnumber?: string;
    street?: string;
    block?: string;
    bplid?: string;
    bplname?: string;
    location?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
  permission?: UserPermissionDTO[];
  created_at?: string | null;
  updated_at?: string | null;
  is_deleted?: boolean;
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
  batch_number: string;
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

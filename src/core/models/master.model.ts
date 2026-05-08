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
  warehouse_id: number;
  item_code: string;
  item_description: string;
  batch_number: string;
  active: string;
  ean_barcode: string;
  sap_barcode: string;
  open_quantity: number;
  location: number[];
  floor: number[];
  device: number[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  is_deleted?: boolean;
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

export interface PackageDTO {
  id: number;
  package_type_name: string;
  package_code: string;
  description: string;
  dimensions?: string; // Stored as a JSON string or simplified format
  max_weight?: number;
  weight_unit?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePackagePayload {
  package_type_name: string;
  package_code: string;
  description: string;
  status: string;
}

export interface FloorDTO {
  id: number;
  warehouse_id: number;
  floor1: string;
  floor2: string;
  floor3: string;
  floor4: string;
  floor5: string;
  floor6: string;
  barcode: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFloorPayload {
  warehouse_id: number;
  floor1: string;
  floor2: string;
  floor3: string;
  floor4: string;
  floor5: string;
  floor6: string;
  barcode: string;
}

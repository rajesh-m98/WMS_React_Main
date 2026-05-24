export interface UserPermissionDTO {
  id: number;
  userid: number;
  operation_type: string;
  OperationPages: string[];
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  is_deleted?: boolean;
}

export interface UserDTO {
  ID: number;
  WAREHOUSE_ID: number;
  USERID: string;
  EMPLOYEE_ID: string;
  FIRSTNAME: string;
  LASTNAME: string;
  EMAIL: string;
  USERNAME: string;
  MOBILE_NUMBER: string;
  PASSWORD: string;
  DEPARTMENT: string;
  ROLE: number | string;
  OTP?: string;
  REPORTINGMANAGER?: string;
  OUTLET?: number;
  MOBILE_TOKEN?: string;
  STATUS: string;
  DB_WAREHOUSE?: {
    ID: number;
    WAREHOUSE_NAME: string;
    WAREHOUSE_CODE: string;
    GSTNUMBER?: string;
    STREET?: string;
    BLOCK?: string;
    BPLID?: string;
    BPLNAME?: string;
    LOCATION?: string;
    CITY?: string;
    STATE?: string;
    ZIPCODE?: string;
    COUNTRY?: string;
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
  warehouse_Code: string;
  warehouse_Name: string;
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
  package_type: number;
  description?: string;
  warehouse_id?: number;
  whscode?: string;
  whsname?: string;
  status: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePackagePayload {
  package_type_name: string;
  package_code: string;
  package_type: number;
  description?: string;
  warehouse_id?: number;
  whscode?: string;
  status: string | number;
}

export interface FloorDTO {
  id: number;
  warehouse_id: number;
  floor_Name: string;
  barcode: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFloorPayload {
  warehouse_Id: number;
  floor_Name: string;
}

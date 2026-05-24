export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'users/login/',
  },
  DASHBOARD: {
    GET_STATS: 'dashboard/get_dashboard_stats',
  },
  MASTERS: {
    USERS: 'users/get_all_user/',
    CREATE_USER: 'users/create_user/',
    USER_BY_ID: 'users/get_user_by_id/',
    DELETE_USER: 'users/delete_user/',
    HST: {
      ALL: 'device/get_all_device/',
      CREATE: 'device/device_create/',
      GET_BY_ID: 'device/get_device/',
      UNASSIGNED: 'device/get_all_unassigned_device/',
      DELETE: 'device/delete_device/',
      TYPE_CREATE: 'device/device_type_create/',
      TYPE_ALL: 'device/get_all_device_type/',
    },
    BINS_GET: 'layerconfig/get_all_layerconfig/',
    BINS_CREATE: 'layerconfig/layerconfig_create/',
    BINS_DELETE: 'layerconfig/delete_layerconfig/',
    BINS_BULK_IMPORT: 'layerconfig/bulk_layerconfig/',
    LAYER_CONFIG_DB: 'layerconfig/get_all_layerconfig_db/',
    ITEMS: {
      ALL: 'items/get_all_item/',
      CREATE: 'items/item_create/',
      GET_BY_ID: 'items/get_item/',
      REFRESH: 'items/refresh_item/',
      DELETE: 'items/delete_item/',
    },
    WAREHOUSE: {
      ALL: 'warehouse/get_all_warehouse',
      CREATE: 'warehouse/warehouse_create/',
      GET_BY_ID: 'warehouse/get_warehouse/',
      REFRESH: 'warehouse/refresh_warehouse/',
      DELETE: 'warehouse/delete_warehouse/',
    },
    PACKAGING: {
      ALL: 'packaging/get_all_packagings',
      CREATE: 'packaging/packaging_create/',
      GET_BY_ID: 'packaging/get_packaging/',
      DELETE: 'packaging/delete_package/',
      GENERATE: 'packaging/generate_barcode/',
    },
    FLOOR: {
      ALL: 'floor/get_all_floors/',
      CREATE: 'floor/floor_create/',
      GET_BY_ID: 'floor/get_floor/',
      DELETE: 'floor/delete_floor/',
    },
  },
  TRANSACTIONS: {
    INWARD: {
      // Use PUTAWAY common endpoint
    },
    OUTWARD: {
      GET_ALL: 'outward/get_all_outward/',
      GENERATE: 'outward/generate_picklist/',
      GET_ONWARD_PICKLIST: 'outward/get_all_onward_picklist/',
      GET_MANUAL_PICKLIST: 'outward/get_all_manual_picklist/',
      GET_ALL_SORTING: 'outward/get_all_sorting/',
    },
    TASKS: {
      GET_BY_ID: 'picklist/get_picklist',
      GET_ITEMS: 'picklist/get_all_picklist',
    },
    DISPATCH: {
      GET_HISTORY: 'outward/get_all_dispatch/',
      GET_DETAIL: 'outward/get_dispatch/',
    },
    PUTAWAY: {
      GET_ALL: 'putaway/get_all_putaway/',
      GET_BY_ID: 'putaway/get_putaway/',
    },
    GIN: {
      ALL: 'gin/get_all_gin/',
      GET_BY_ID: 'gin/get_gin/',
      CREATE: 'gin/create_gin/',
      UPDATE_HEADER: 'gin/update_header/',
      UPDATE_LINE: 'gin/update_line/',
      LINE_STATUS: 'gin/line_status/',
      DELETE_HEADER: 'gin/delete_header/',
      DELETE_LINE: 'gin/delete_line/',
    }
  }
};

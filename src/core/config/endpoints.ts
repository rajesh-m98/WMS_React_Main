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
    ITEMS: {
      ALL: 'registration/get_all_product/',
      CREATE: 'registration/product_create/',
      GET_BY_ID: 'registration/get_product/',
      REFRESH: 'registration/refresh_product/',
      DELETE: 'registration/delete_product/',
    },
    WAREHOUSE: {
      ALL: 'warehouse/get_all_warehouse/',
      CREATE: 'warehouse/warehouse_create/',
      GET_BY_ID: 'warehouse/get_warehouse/',
      REFRESH: 'warehouse/refresh_warehouse/',
      DELETE: 'warehouse/delete_warehouse/',
    },
  },
  TRANSACTIONS: {
    INWARD_REQUEST: 'transactions/inward_request',
    OUTWARD_REQUEST: 'transactions/outward_request',
  }
};

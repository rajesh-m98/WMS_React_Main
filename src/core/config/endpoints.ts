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
    ITEMS: {
      ALL: 'items/get_all_item/',
      CREATE: 'items/item_create/',
      GET_BY_ID: 'items/get_item/',
      REFRESH: 'items/refresh_item/',
      DELETE: 'items/delete_item/',
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
    INWARD: {
      // Use PUTAWAY common endpoint
    },
    OUTWARD: {
      // Use PUTAWAY common endpoint
    },
    TASKS: {
      GET_BY_ID: 'picklist/get_picklist',
      GET_ITEMS: 'picklist/get_all_picklist',
    },
    DISPATCH: {
      GET_HISTORY: 'dispatch/get_all_dispatch/',
      GET_DETAIL: 'dispatch/get_dispatch/',
    },
    PUTAWAY: {
      GET_ALL: 'putaway/get_all_putaway/',
      GET_BY_ID: 'putaway/get_putaway/',
    }
  }
};

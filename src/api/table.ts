

import http from '@/common/http/request'
const tableMethod = process.env.NODE_ENV === 'production' ? 'get' : 'post'
export const getTableData = (params: { page: number; pageSize: number }) =>
  http[tableMethod]<any>('/getTableLists',  params)

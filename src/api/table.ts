// import axiosMockWrapper from '@/common/http/requestMock'
// import { MockHttpResponse } from '@/interface'
// import { MockResponseTableData } from '@/interface/table'
// export const getTableData = (params: { page: number; pageSize: number }) =>
//   axiosMockWrapper.get<MockHttpResponse<MockResponseTableData[]>>('/table/list', params)

import http from '@/common/http/request'

export const getTableData = (params: { page: number; pageSize: number }) =>
  http.get('/table/list',  params)

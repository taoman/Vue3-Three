import axiosWrapper from '@/common/http/request'
import { MockResponseTableData } from '@/interface/table'
export const getTableData =  (params:{page:number,pageSize:number}) =>
  axiosWrapper.get<MockResponseTableData[]>('/table/list', params)

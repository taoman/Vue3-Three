import {mockBaseGet} from './index'
import {MockResponseTableData} from '@/interface/table'
const data:MockResponseTableData[] = []
for(let i = 1;i<50;i++){
  data.push({
    id:i,
    name:`张三${i}`,
    turbines:`#${i}号风机`,
    witgets:'发动机',
    status:'正常',
    date:'2021-09-01'
  })
}
export function mockTableList(){
  return mockBaseGet<MockResponseTableData[]>('/api/table/list',data)
}
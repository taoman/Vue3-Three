import {mockBaseGetTable} from './base'
import {MockResponseTableData} from '@/interface/table'
const data:MockResponseTableData[] = []
for(let i = 1;i<50;i++){
  data.push({
    id:i,
    name:`张三${i}`,
    turbines:`#${i}号风机`,
    witgets:'发动机',
    status:'正常',
    checked: i % 2 === 0 ? true : false,
    date:'2021-09-01'
  })
}
export function mockTableList(){
  return mockBaseGetTable<MockResponseTableData[]>('/api/table/list',data)
}
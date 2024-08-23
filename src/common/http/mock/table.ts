import {mockBaseGetTable} from './base'
import {DataType} from '@/interface/table'
const data:DataType[] = []
for(let i = 0;i<100000;i++){
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
  return mockBaseGetTable<DataType[]>(`/api/getTableLists`,data)
}
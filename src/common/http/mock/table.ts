import {mockBaseGet} from './index'
import {MockResponseTableData} from '@/interface/table'
const data:MockResponseTableData[] = []
for(let i = 0;i<50;i++){
  data.push({
    id:i,
    name:`张三${i}`,
    brand:'nike',
    store:'王府井店',
    status:'正常',
    date:'2021-09-01'
  })
}
export function mockTableList(){
  return mockBaseGet<MockResponseTableData[]>('/api/table/list',data)
}
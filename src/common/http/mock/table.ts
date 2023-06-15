import {mockBase,MockBaseInterface} from './index'
interface MockResponseData {
  id:number
  name:string
  brand:string
  store:string
  status:string
  date:string
}
const data:MockResponseData[] = [
  {
    id:1,
    name:'张三',
    brand:'nike',
    store:'王府井店',
    status:'正常',
    date:'2021-09-01'
  },
  {
    id:2,
    name:'李四',
    brand:'adidas',
    store:'王府井店',
    status:'正常',
    date:'2021-09-01'
  },
  {
    id:3,
    name:'王五',
    brand:'jordan',
    store:'王府井店',
    status:'正常',
    date:'2021-09-01'
  }
]
const mockData:MockBaseInterface<MockResponseData[]> = {
  url:'/api/table/list',
  method:'get',
  statusCode:200,
  response:{
    code:200,
    message:'success',
    data
  }
}
export const mockTable =  mockBase(mockData)
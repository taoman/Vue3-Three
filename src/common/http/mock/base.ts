// import {MockMethod} from 'vite-plugin-mock'
// export interface MockBaseInterface<T> {
//   url:string,
//   method:string
//   statusCode:number
//   response:{
//     code:number
//     message:string
//     data:T
//   }
// }
// export const mockBase = <T> (mockData:MockBaseInterface<T>) => {
//   return [
//     {
//       url: mockData.url,
//       method: mockData.method,
//       statusCode:mockData.statusCode,
//       response: {
//         code:mockData.response.code,
//         message:mockData.response.message,
//         data:mockData.response.data
//       }
//     }
//   ] as MockMethod[]
// }

import Mock from 'mockjs'
import { mockTableList } from './table'
export function mockBaseGetTable<T extends any[]>(url: string, data: T) {
  const tableMethod = process.env.NODE_ENV === 'production' ? 'get' : 'post'
  return Mock.mock(url, tableMethod, (params) => {
    const { page, pageSize } = JSON.parse(params.body)
    const start = (page - 1) * pageSize
    const end = page * pageSize
    const list = data.slice(start, end)
    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total: data.length,
        page,
        pageSize
      }
    }
  })
}

mockTableList()
// console.log('loginMock',loginMock())

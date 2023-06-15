
import {MockMethod} from 'vite-plugin-mock'
export interface MockBaseInterface<T> {
  url:string,
  method:string
  statusCode:number
  response:{
    code:number
    message:string
    data:T
  }
}
export const mockBase = <T> (mockData:MockBaseInterface<T>) => {
  return [
    {
      url: mockData.url,
      method: mockData.method,
      statusCode:mockData.statusCode,
      response: {
        code:mockData.response.code,
        message:mockData.response.message,
        data:mockData.response.data
      }
    } 
  ] as MockMethod[]
}
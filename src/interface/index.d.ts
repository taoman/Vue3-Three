export interface MockHttpResponse<T = unknown> {
  message:string
  code:number
  data:{
    list:T
    total:number
    page:number
    pageSize:number
  }
}
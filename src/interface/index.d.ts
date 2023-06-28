export interface HttpResponse<T = unknown> {
  message:string
  code:number
  data:T
}
import { Method, AxiosRequestConfig } from 'axios'

export type RequestMethods = Extract<
Method,
'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>

export interface HttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void
  beforeResponseCallback?: (response: PureHttpResponse) => void
}

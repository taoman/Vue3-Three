import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  CustomParamsSerializer
} from 'axios'
import { RequestMethods, HttpRequestConfig } from './type'
const defaultCofig: AxiosRequestConfig = {
  baseURL: '/api',
  timeout: 10000,
  // headers: {
  //   Accept: 'application/json, text/plain, */*',
  //   'Content-Type': 'application/json',
  //   'X-Requested-With': 'XMLHttpRequest'
  // },
  // paramsSerializer: {
  //   serialize: stringify as CustomParamsSerializer
  // }
}
class AxiosWrapper {
  constructor() {
    // this.instance = axios.create({
    //   baseURL: ''
    // })
    // this.instance.interceptors.request.use(
    //   (config: InternalAxiosRequestConfig) => {
    //     return config
    //   },
    //   (error) => {
    //     return Promise.reject(error)
    //   }
    // )
    // this.instance.interceptors.response.use(
    //   (response: AxiosResponse) => {
    //     return response
    //   },
    //   (error) => {
    //     return Promise.reject(error)
    //   }
    // )
  }
  private static axiosInstance: AxiosInstance = axios.create(defaultCofig)

  public request<T>(
    method: RequestMethods,
    url: string,
    params?: AxiosRequestConfig,
    axiosConfig?: HttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...params,
      ...axiosConfig
    } as HttpRequestConfig

    return new Promise((resolve, reject) => {
      AxiosWrapper.axiosInstance
        .request(config)
        .then((res: AxiosResponse<T>) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  public get<T>(
    url: string,
    params?: Record<string, any>,
    config?: HttpRequestConfig
  ): Promise<T> {
    return this.request<T>('get', url, params, config)
  }

  public post<T>(
    url: string,
    data?: Record<string, any>,
    config?: HttpRequestConfig
  ): Promise<T> {
    return this.request<T>('post', url, data, config)
  }
  // public async get<T>(url: string, params?: any): Promise<T> {
  //   const res: AxiosResponse<T> = await this.instance.get(url, { params })
  //   return res.data
  // }
  // public async post<T>(url: string, data?: any): Promise<T> {
  //   const res: AxiosResponse<T> = await this.instance.post(url, data)
  //   return res.data
  // }
}
const http = new AxiosWrapper()

export default http

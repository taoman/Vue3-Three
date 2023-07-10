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
}
class AxiosWrapper {
  constructor() {

  }
  private static axiosInstance: AxiosInstance = axios.create(defaultCofig)

  public request<T>(
    method: RequestMethods,
    url: string,
    data?: AxiosRequestConfig,
    axiosConfig?: HttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...axiosConfig
    } as HttpRequestConfig

    if (method.toLowerCase() === 'get') {
      config.params = data;
    } else {
      config.data = data;
    }
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
}
const http = new AxiosWrapper()

export default http

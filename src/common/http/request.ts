import axios, { AxiosInstance,AxiosResponse,InternalAxiosRequestConfig } from 'axios'

class AxiosWrapper {
  private instance: AxiosInstance
  constructor(baseUrl: string) {
    this.instance = axios.create({
      baseURL: baseUrl
    })

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response:AxiosResponse) => {
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
  public async get<T>(url: string, params?: any): Promise<T> {
    const res:AxiosResponse<T> = await this.instance.get(url, { params })
    return res.data
  }
}
const axiosWrapper = new AxiosWrapper('/api')

export default axiosWrapper
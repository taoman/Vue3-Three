import http from '@/common/http/request'
import { LoginInterface } from '@/interface/user'
import { HttpResponse } from '@/interface'
export const login = (data?: object) => http.post<HttpResponse<LoginInterface>>('/login', data)

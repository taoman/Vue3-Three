import http from '@/common/http/request'
import { HttpResponse } from '@/interface'

export const chat = (data: { message: string }) => http.post<HttpResponse<string>>('/chat', data)

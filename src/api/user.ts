import http from '@/common/http/request'
import { LoginInterface } from '@/interface/user'
import { HttpResponse } from '@/interface'
import { RouteRecordRaw } from 'vue-router'

export const login = (data?: object) => http.post<HttpResponse<LoginInterface>>('/login', data)

export const getAsyncRoute = () => http.get<HttpResponse<RouteRecordRaw[]>>('/getRoutes')
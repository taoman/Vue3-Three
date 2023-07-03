import { MockMethod } from 'vite-plugin-mock'
import { RouterEnum } from '@/router/enums'
export const authManagement = [
  {
    path: '/auth',
    name: 'auth',
    meta: {
      title: '权限管理',
      rank: RouterEnum.auth
    },
    children: [
      {
        path: '/auth/roleManagement',
        name: 'roleManagement',
        meta: {
          title: '角色权限'
        }
      }
    ]
  }
]

export default [
  {
    url: '/api/getRoutes',
    method: 'get',
    response: () => {
      return {
        message: '请求成功',
        code: 200,
        data: [authManagement]
      }
    }
  }
] as MockMethod[]

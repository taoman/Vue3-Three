import { MockMethod } from 'vite-plugin-mock'
import { RouterEnum } from '@/router/enums'
// export const authManagement = [
//   {
//     path: '/auth',
//     name: 'auth',
//     meta: {
//       title: '权限管理',
//       rank: RouterEnum.auth,
//     },
//     children: [
//       {
//         path: '/auth/Management',
//         name: 'AuthManagement',
//         meta: {
//           title: '角色权限',
//         }
//       }
//     ]
//   }
// ]

export const systemRouter = [
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'components',
      rank: RouterEnum.system
    },
    children: [
      {
        path: '/system/management',
        name: 'SystemManagement',
        meta: {
          title: '用户管理',
          roles:['admin']
        }
      }
    ]
  }
]
export default [
  {
    url:'/api/getRoutes',
    method: 'get',
    response: () => {
      return {
        message: '请求成功',
        code: 200,
        data: [systemRouter]
      }
    }
  }
] as MockMethod[]

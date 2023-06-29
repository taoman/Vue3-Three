import type { RouteRecordRaw } from 'vue-router'
import RoleManagement from '@/views/auth/RoleManagement.vue'
import AppMain from '@/views/layout/AppMain.vue'
export const authManagement: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    component: AppMain,
    meta: {
      title: '权限管理'
    },
    children: [
      {
        path: '/auth/roleManagement',
        name: 'roleManagement',
        component: RoleManagement,
        meta: {
          title: '角色权限'
        }
      }
    ]
  }
]

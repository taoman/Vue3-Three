import type { RouteRecordRaw } from 'vue-router'
export const remainingRoute: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/common/AppLogin.vue')
  },
  {
    path:'/model',
    name:'model',
    component:() => import('@/views/model/ModelIndex.vue')
  }
]

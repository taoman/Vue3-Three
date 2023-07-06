import type { RouteRecordRaw } from 'vue-router'
export const remainingRouter: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/common/AppLogin.vue')
  },
  {
    path:'/model',
    name:'model',
    component:() => import('@/views/model/ModelIndex.vue')
  },
  {
    path:'/:catchAll(.*)',
    name:'404',
    component:() => import('@/views/common/NotFound.vue')
  }
]

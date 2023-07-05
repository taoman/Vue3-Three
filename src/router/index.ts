import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutRoot from '@/views/layout/LayoutRoot.vue'
import ModelOverLay from '@/views/layout/ModelOverLay.vue'
import { authManagement } from './modules/auth'
import { componentsCenter } from './modules/components'
import { remainingRouter } from './modules/remaining'
import { cloneDeep } from 'lodash'

// const modules: Record<string, any> = import.meta.glob(
//   ['./modules/**/*.ts', '!./modules/**/remaining.ts'],
//   {
//     eager: true
//   }
// )
// console.log('modules', modules)
// const routes: RouteRecordRaw[] = []
// Object.keys(modules).forEach((key) => {
//   routes.push(modules[key].default)
// })
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    name: 'root',
    component: LayoutRoot,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
        meta: {
          title: '关于'
        }
      },
      {
        path:'/model',
        name:'model',
        component:() => import('@/views/model/ModelIndex.vue'),
        meta: {
          title: '模型',
          fullScreen:true
        }
      },
      ...componentsCenter
    ]
  }
]
export const constantMenus = cloneDeep(constantRoutes)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes.concat(...(remainingRouter as any))
})

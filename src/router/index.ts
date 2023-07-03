import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutRoot from '@/views/layout/LayoutRoot.vue'
import {authManagement} from './module/auth'
import { componentsCenter } from './module/components'
import { remainingRoute } from './module/remaining'

export const constantMenus: RouteRecordRaw[] = [
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
          title: '模型'
        }
      }
    ],
  }
]
 
constantMenus[0].children?.push(...componentsCenter, ...authManagement)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:constantMenus.concat(...remainingRoute)
})

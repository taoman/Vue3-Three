import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutRoot from '@/views/layout/LayoutRoot.vue'
import { skuCenter } from './sku'
import {authManagement} from './auth'
import { componentsCenter } from './components'
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    name: 'root',
    component: LayoutRoot,
    // meta: {
    //   title: '首页'
    // },
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
      },
      // ...skuCenter,
      ...componentsCenter,
      ...authManagement
    ]
  },
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
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

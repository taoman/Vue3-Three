import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LayoutRoot from '@/views/layout/LayoutRoot.vue'
import ModelOverLay from '@/views/layout/ModelOverLay.vue'
import { authManagement } from './modules/auth'
import { componentsCenter } from './modules/components'
import { remainingRouter } from './modules/remaining'
import { webrtcCenter } from './modules/webrtc'
import { cloneDeep } from 'lodash'
import { useAppStoreHook } from '@/stores/app-stores'
import { usePermissionStoreHook } from '@/stores/permission-stores'
import { initRouter } from './utils'
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
          title: '首页',
          icon: 'home'
        }
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
        meta: {
          title: '流程图',
          icon: 'about'
        }
      },
      {
        path: '/model',
        name: 'model',
        component: ModelOverLay,
        meta: {
          title: '模型组件',
          icon: 'model'
        },
        children: [
          {
            path: '/model',
            name: 'model',
            component: () => import('@/views/model/ModelIndex.vue'),
            meta: {
              title: '风机模型',
              icon: 'turbine',
              fullScreen: true
            }
          }
        ]
      },

      ...webrtcCenter,
      ...componentsCenter,
      ...authManagement
    ]
  }
]
export const constantMenus = cloneDeep(constantRoutes)
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes.concat(...(remainingRouter as any))
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.accessToken
  if (!token && to.path !== '/login') {
    next('/login')
  } else {
    // 这是一种妥协，因为在刷新页面的时候，动态路由会失效指向404
    if (!usePermissionStoreHook().wholeMenus.length) {
      initRouter().then(() => {
        next({ path: to.path })
      })
    } else {
      // 页面需全屏
      if (to.meta.fullScreen) {
        useAppStoreHook().isModelFullScreen = true
      } else {
        useAppStoreHook().isModelFullScreen = false
      }
      next()
    }
  }
})

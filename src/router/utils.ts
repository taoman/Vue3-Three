import { RouteRecordRaw } from 'vue-router'
import { usePermissionStoreHook } from '@/stores/permission-stores'
import { getAsyncRoute } from '@/api/user'
import { router } from './index'
import { cloneDeep } from 'lodash'
import AppMain from '@/views/layout/AppMain.vue'
const modulesRoutes = import.meta.glob('/src/views/**/*.{vue,tsx}')
/**
 * @description: 初始化路由
 * @return {*}
 */
export function initRouter() {
  const asyncRouteList = sessionStorage.asyncRoutes
  if (asyncRouteList && asyncRouteList.length > 0) {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      handleAsyncRoutes(JSON.parse(asyncRouteList))
      resolve(JSON.parse(asyncRouteList))
    })
  } else {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      getAsyncRoute().then((res) => {
        const asyncRoutes = res.data.flat()
        sessionStorage.asyncRoutes = JSON.stringify(asyncRoutes)
        handleAsyncRoutes(cloneDeep(asyncRoutes))
        resolve(asyncRoutes)
      })
    })
  }
}
/**
 * @description: 处理动态路由
 * @param {RouteRecordRaw} routeList
 * @return {*}
 */
export function handleAsyncRoutes(routeList: RouteRecordRaw[]) {
  if (routeList.length === 0) {
    usePermissionStoreHook().handleWholeMenus(routeList)
  } else {
    addAsyncRoutes(routeList)?.map((item) => {
      if (
        router.options.routes[0].children?.findIndex((value) => value.path === item.path) !== -1
      ) {
        return
      } else {
        router.options.routes[0].children?.push(item)
        if (!router.hasRoute(item.name as string)) router.addRoute(item)
        const flattrnRouters = router.getRoutes().find((n) => n.path === '/')
        router.addRoute(flattrnRouters as RouteRecordRaw)
      }
    })
    usePermissionStoreHook().handleWholeMenus(routeList)
  }
}
// function asceneding(arr:RouteRecordRaw[]){
//   arr.forEach((item,index) => {
//     if(item){return}
//   })
// }

/**
 * @description: 判断两个数组是否存在相同值
 * @param {*} arr1
 * @param {*} arr2
 * @return {*}
 */
function hasCommonValue(arr1: [], arr2: []) {
  return arr1.some((item) => arr2.includes(item))
}

/**
 * @description: 有roles的则与当前角色进行对比，相同则显示，没有设置roles的默认为全部显示
 * @param {RouteRecordRaw} data
 * @return {*}
 */
export function filterNoPermissionTree(data: RouteRecordRaw[]) {
  const currentRoles = sessionStorage.roles ?? []
  const newTree = cloneDeep(data).filter((item) => {
    if (item.children && item.children.length > 0) {
      return item.children.some(v => {
        if(v.meta?.roles){
          // return item.children?.some(childItem => hasCommonValue(childItem.meta?.roles as [],currentRoles))
          return hasCommonValue(v.meta.roles as [],currentRoles)
        }else{
          return true
        }
      })
    } else if (item.meta?.roles) {
      return hasCommonValue(item.meta?.roles as [], currentRoles)
    } else {
      return true
    }
  })
  return newTree
}

/**
 * @description: 重新生成路由
 * @param {RouteRecordRaw} arrRoutes
 * @return {*}
 */
export function addAsyncRoutes(arrRoutes: RouteRecordRaw[]) {
  if (!arrRoutes || !arrRoutes.length) return
  const modulesRoutesKeys = Object.keys(modulesRoutes)
  arrRoutes.forEach((item: RouteRecordRaw) => {
    item.component = AppMain
    if (item.children && item.children.length > 0) {
      item.children.forEach((childItem: RouteRecordRaw) => {
        const key = modulesRoutesKeys.find((key) => key.includes(childItem.name as string))
        if (key) {
          childItem.component = modulesRoutes[key]
        }
      })
    }
  })

  return arrRoutes
}

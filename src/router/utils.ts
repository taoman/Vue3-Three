import { RouteRecordRaw } from 'vue-router'
import { usePermissionStoreHook } from '@/stores/permission-stores'
import { getAsyncRoute } from '@/api/user'
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
      addAsyncRoutes(JSON.parse(asyncRouteList))
      //   usePermissionStoreHook().handleWholeMenus(JSON.parse(asyncRouteList))
      resolve(JSON.parse(asyncRouteList))
    })
  } else {
    return new Promise<RouteRecordRaw[]>((resolve) => {
      getAsyncRoute().then((res) => {
        const asyncRoutes = res.data.flat()
        console.log('asyncRoutes',asyncRoutes)
        sessionStorage.asyncRoutes = JSON.stringify(asyncRoutes)
        addAsyncRoutes(asyncRoutes)
        usePermissionStoreHook().handleWholeMenus(asyncRoutes)
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
// export function handleAsyncRoutes(routeList:RouteRecordRaw[]){
//   if(routeList.length === 0){

//   }
// }

export function addAsyncRoutes(arrRoutes: RouteRecordRaw[]) {
  console.log('arrRoutes',arrRoutes)
  if (!arrRoutes || !arrRoutes.length) return
  const modulesRoutesKeys = Object.keys(modulesRoutes)
  //   console.log('modulesRoutesKeys',modulesRoutesKeys)
  arrRoutes.forEach((item: RouteRecordRaw) => {
    item.component = AppMain
    if(item.children && item.children.length > 0){
      item.children.forEach((childItem: RouteRecordRaw) => {
        console.log('childItem',childItem,modulesRoutesKeys)
        const key = modulesRoutesKeys.find((key) => key.includes(childItem.name as string))
        console.log('key',key)
        if (key) {
          childItem.component = modulesRoutes[key]
        }
      })
    }
  })
  console.log('arrRoutes', arrRoutes)
}

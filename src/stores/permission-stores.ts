import { defineStore } from 'pinia'
import { constantMenus } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import {filterNoPermissionTree} from '@/router/utils'
interface PermissionType {
  constantMenus: RouteRecordRaw[]
  wholeMenus: RouteRecordRaw[]
}
export const permissionStore = defineStore('permission-store', {
  state: (): PermissionType => ({
    constantMenus,
    wholeMenus: []
  }),
  // persist: {
  //   enabled: true,
  //   strategies: [{ storage: sessionStorage, paths: ['wholeMenus'] }]
  // },
  actions: {
    handleWholeMenus(routes: RouteRecordRaw[]) {
      const filterAsyncRoutes = filterNoPermissionTree(routes)
      this.wholeMenus =this.constantMenus[0].children?.concat(filterAsyncRoutes) ?? []
    },

    clearAllCachePage(){
      this.wholeMenus = []
    }
  },
  
})

export function usePermissionStoreHook() {
  return permissionStore()
}

import { defineStore } from 'pinia'
import { constantMenus } from '@/router'
import { RouteRecordRaw } from "vue-router"

interface PermissionType {
  constantMenus: RouteRecordRaw[]
  wholeMenus: RouteRecordRaw[]
}
export const permissionStore = defineStore('permission-store', {
  state: ():PermissionType => ({
    constantMenus,
    wholeMenus: []
  }),
  actions: {
    handleWholeMenus(routes:RouteRecordRaw[]){
      this.wholeMenus = this.constantMenus[0].children?.concat(routes) ?? []
    }
  }
})

export function usePermissionStoreHook() {
  return permissionStore()
}
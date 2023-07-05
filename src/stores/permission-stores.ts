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
      console.log('constantMenus+++',this.constantMenus)

      this.wholeMenus = this.constantMenus[0].children?.concat(routes) ?? []
      console.log('wholeMenus---',this.wholeMenus)
    }
  }
})

export function usePermissionStoreHook() {
  return permissionStore()
}